'use strict';

var Room = require('./room'),
    io = require('socket.io')();

function Player (socket, server) {
    if (!(this instanceof Player)) {
        return new Player(socket, server);
    }

    this._socket = socket;
    this._server = server;

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
                x: 100,
                y: 250
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

        client.pawn.current = id == this.id;
        client.pawn.transform.position.y = 150 * (index + 1);

        this._server.to(this._socket.rooms[1]).emit('server.pawn.spawn', client.pawn);
    }, this);
};

module.exports = Player;
