'use strict';

function Delegator (socket) {
    if (!(this instanceof Delegator)) {
        return new Delegator(socket);
    }

    this._socket = socket;

    this._socket.on('disconnect', this.disconnectHandler);
    this._socket.on('*', this.anyHandler);
}

Delegator.prototype.disconnectHandler = function () {
    this.to('room').emit('chat.message.receive', {
        message: 'User has left.'
    });
};

Delegator.prototype.anyHandler = function (payload) {
    var event_name = payload.data[0].split('.'),
        event_data = payload.data[1];

    console.log(event_name, event_data);
    this.join('room');

    switch (event_name[0]) {
        case 'chat':
            if (!event_data.sender) {
                event_data.sender = 'System';
            }
            this.to('room').emit('chat.message.receive', event_data);
    }
};

module.exports = Delegator;
