'use strict';

var Room = require('./room');

function Player (socket) {
    if (!(this instanceof Player)) {
        return new Player(socket);
    }

    this._socket = socket;

    this._socket.on('game.player.create', this.playerCreateHandler);
    this._socket.on('game.player.spawn', this.playerSpawnHandler);
}

Player.prototype.playerCreateHandler = function (payload) {
    var room = Room.get(payload.room),
        clients = room.clients,
        client = room.clients[this.id];

    client.pawn = {
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
        this.emit('game.player.spawn', client.pawn);
    }, this);
};

Player.prototype.playerSpawnHandler = function () {
    console.log('spawn');
};

module.exports = Player;
