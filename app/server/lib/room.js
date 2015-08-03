'use strict';

var _rooms = {},
    _room_template = {
        id: null,
        clients: []
    };

exports.add = function (id) {
    var room = this.get(id);

    if (!room) {
        room = _rooms[id] = _room_template;
        room.id = id;
    }

    return room;
};

exports.get = function (id) {
    return _rooms[id] || false;
};

exports.join = function (id, socket, user) {
    var room = this.add(id),
        client = null;

    if (room.clients.indexOf(socket) < 0) {
        room.clients[socket] = user;
    }

    return room.id;
};

exports.leave = function (client_id) {
    var room_id = null,
        client = null;

    Object.keys(_rooms).forEach(function (id) {
        var room = _rooms[id],
            client_exists = room.clients[client_id];

        if (client_exists) {
            room_id = id;
            client = client_exists;
            delete room.clients[client_id];
        }
    });

    return {
        id: room_id,
        client: client
    };
}
