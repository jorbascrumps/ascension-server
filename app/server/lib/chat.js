'use strict';

function Chat (socket) {
    if (!(this instanceof Chat)) {
        return new Chat(socket);
    }

    this._socket = socket;

    this._socket.on('chat.channel.join', function (payload) {
        this.to('room').emit('chat.message.receive', {
            message: payload.user + ' has joined.'
        });
    });
}

module.exports = Chat;
