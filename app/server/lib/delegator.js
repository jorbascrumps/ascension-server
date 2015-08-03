'use strict';

function Delegator (socket) {
    if (!(this instanceof Delegator)) {
        return new Delegator(socket);
    }

    this._socket = socket;

    require('./chat')(this._socket);
    require('./player')(this._socket);

    this._socket.on('disconnect', this.disconnectHandler);
    // this._socket.on('*', this.anyHandler);
}

Delegator.prototype.disconnectHandler = function () {
};

Delegator.prototype.anyHandler = function (payload) {
    var event_name = payload.data[0].split('.'),
        event_data = payload.data[1];

    if (!event_data.sender) {
        event_data.sender = 'System';
    }

    switch (event_name[0]) {
        case 'chat':
            console.log(event_name, event_data);
    }
};

module.exports = Delegator;
