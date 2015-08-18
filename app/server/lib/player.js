'use strict';

var Room = require('./room'),
    io = require('socket.io')();

function Player (socket, server) {
    if (!(this instanceof Player)) {
        return new Player(socket, server);
    }

    this._socket = socket;
    this._server = server;
    this._room = null;

    var self = this;
    this._socket.on('game.player.create', function (payload) {
        self._room = payload.room;
        self.playerCreateHandler(payload);
    });

    this._socket.on('game.pawn.spawn', function (payload) {
        self.spawnHandler(payload);
    });

    this._socket.on('game.pawn.movement', function (payload) {
        self.pawnMovementHandler(payload);
    });

    this._socket.on('game.tagged.enter', function (payload) {
        self.taggedTileEnterHandler(payload);
    });

    this._socket.on('game.tagged.exit', function (payload) {
        self.taggedTileExitHandler(payload);
    });
}

Player.prototype.connectHandler = function () {};

Player.prototype.pawnMovementHandler = function (payload) {
    var room = Room.get(this._room),
        clients = room.clients,
        client = room.clients[this._socket.id];

    client.pawn.transform.position = {
        x: payload.position.x - (payload.position.x % 50),
        y: payload.position.y - (payload.position.y % 50)
    };

    this._socket.to(this._room).emit('server.pawn.movement', payload);
};

Player.prototype.playerCreateHandler = function (payload) {
    this.syncPlayers();
};

Player.prototype.spawnHandler = function (payload) {
    var room = Room.get(this._room),
        clients = room.clients,
        client = room.clients[this._socket.id];

    client.pawn = {
        id: this._socket.id,
        asset: payload.asset,
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

    this.syncPlayers();
};

Player.prototype.syncPlayers = function () {
    var room = Room.get(this._room)
      , clients = room.clients;

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

Player.prototype.taggedTileEnterHandler = function (payload) {
    this._socket.to(this._room).emit('server.tagged.enter', payload);
};

Player.prototype.taggedTileExitHandler = function (payload) {
    this._socket.to(this._room).emit('server.tagged.exit', payload);
};

module.exports = Player;
