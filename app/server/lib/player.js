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
        client = room.clients[this.id];

    client.type = payload.type;
    this.emit('game.player.spawn', {
        asset: 'nathan',
        transform: {
            position: {
                x: 150,
                y: 150
            },
            rotation: 1,
            width: 50,
            height: 50
        }
    });
};

Player.prototype.playerSpawnHandler = function () {
    console.log('spawn');
};

module.exports = Player;
