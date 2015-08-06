'use strict';

function Delegator (socket, server) {
    if (!(this instanceof Delegator)) {
        return new Delegator(socket, server);
    }

    this._socket = socket;
    this._server = server;

    this._components = {
        chat: require('./chat')(this._socket),
        pawn: require('./player')(this._socket, this._server)
    };

    var self = this;
    this._socket.on('disconnect', function () {
        self.disconnectHandler();
    });
    // this._socket.on('*', this.anyHandler);
}

Delegator.prototype.disconnectHandler = function () {
    Object.keys(this._components).forEach(function (component) {
        this._components[component].disconnectHandler();
    }, this);
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
