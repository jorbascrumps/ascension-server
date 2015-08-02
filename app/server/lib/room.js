'use strict';

var _rooms = {};

exports.add = function (id) {
    if (!this.get(id)) {
        _rooms[id] = {
            id: id,
            clients: []
        };
    }

    return this.get(id);
};

exports.get = function (id) {
    return _rooms[id] || false;
};

exports.join = function (id, user) {
    var room = this.add(id);

    if (room.clients.indexOf(user) < 0) {
        room.clients.push(user);
    }

    return id;
};
