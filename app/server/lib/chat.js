'use strict';

var Room = require('./room');

function Chat (socket) {
    if (!(this instanceof Chat)) {
        return new Chat(socket);
    }

    this._socket = socket;

    this._socket.on('chat.channel.join', this.channelJoinHandler);
    this._socket.on('chat.message.send', this.sendMessageHandler);
}

Chat.prototype.connectHandler = function () {};

Chat.prototype.channelJoinHandler = function (payload) {
    var room = Room.join(payload.room, this.id, {
        name: payload.sender
    });

    this.join(room);
    this.to(room).emit('chat.message.receive', {
        message: payload.sender + ' has joined.'
    });
};

Chat.prototype.sendMessageHandler = function (payload) {
    this.to(payload.room).emit('chat.message.receive', {
        message: payload.message,
        sender: payload.sender
    });
};

Chat.prototype.disconnectHandler = function () {
    var room = Room.leave(this.id);

    if (!room.id) {
        return;
    }

    this.to(room.id).emit('chat.message.receive', {
        message: room.client.name + ' has left.'
    });
};

module.exports = Chat;
