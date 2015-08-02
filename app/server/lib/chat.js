'use strict';

var Room = require('./room');

function Chat (socket) {
    if (!(this instanceof Chat)) {
        return new Chat(socket);
    }

    this._socket = socket;

    this._socket.on('chat.channel.join', function (payload) {
        var room = Room.join(payload.room, this.id);
        this.join(room);
        this.to(room).emit('chat.message.receive', {
            message: payload.id + ' has joined.'
        });
    });

    this._socket.on('chat.message.send', function (payload) {
        this.to(payload.room).emit('chat.message.receive', {
            message: payload.message,
            sender: payload.sender
        });
    });

    this._socket.on('disconnect', function () {
        Room.leave(this.id);
    });
}

module.exports = Chat;
