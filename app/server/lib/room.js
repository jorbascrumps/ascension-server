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

exports.join = function (id, user) {
    var room = this.add(id);

    if (room.clients.indexOf(user) < 0) {
        room.clients.push(user);
    }

    return id;
};

exports.leave = function (client_id) {
    var room_id = Object.keys(_rooms).filter(function (room_id) {
        var room = _rooms[room_id],
            clients = room.clients,
            index = clients.indexOf(client_id);

        if (index >= 0) {
            clients.splice(index, 1);

            return true;
        }

        return false;
    });

    return room_id[0];
}
