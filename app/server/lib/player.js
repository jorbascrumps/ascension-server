'use strict';

var Room = require('./room'),
    io = require('socket.io')();

function Player (socket, server) {
    if (!(this instanceof Player)) {
        return new Player(socket, server);
    }

    this._socket = socket;
    this._server = server;
    this._room = socket.rooms[1];

    var self = this;
    this._socket.on('game.player.create', function (payload) {
        self.playerCreateHandler(payload);
    });

    this._socket.on('game.pawn.movement', function (position) {
        this.to(this.rooms[1]).emit('server.pawn.movement', position);
    })
}

Player.prototype.playerCreateHandler = function (payload) {
    var room = Room.get(payload.room),
        clients = room.clients,
        client = room.clients[this._socket.id];

    client.pawn = {
        id: this._socket.id,
        asset: 'nathan',
        transform: {
            position: {
                x: payload.position.x,
                y: payload.position.y
            },
            rotation: 1,
            width: 50,
            height: 50
        }
    };

    Object.keys(clients).forEach(function (id, index) {
        var client = clients[id];

        if (!client.pawn) {
            return;
        }

        client.pawn.current = id == this._socket.id;

        this._server.to(this._socket.rooms[1]).emit('server.pawn.spawn', client.pawn);
    }, this);
};

Player.prototype.disconnectHandler = function () {
    var room = Room.leave(this._socket.id);

    if (!room.id) {
        return;
    }

    this._socket.to(room.id).emit('server.pawn.kill', {
        id: this._socket.id
    });
};

module.exports = Player;
