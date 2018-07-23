import {
    Server
} from 'boardgame.io/server';
import {
    Game
} from 'boardgame.io/core';

import gameConfig from '../core/common/game';
import {
    chunkMapData
} from '../core/common/util';
import {
    layers as mapLayers
} from '../core/common/data/maps/level';

const PORT = parseInt(process.env.PORT, 10) || 8080;

const {
    data: mapData
} = mapLayers.find(({ name }) => name === 'map');
const {
    data: blockedData
} = mapLayers.find(({ name }) => name === 'blocked');
const {
    data: interactionsData
} = mapLayers.find(({ name }) => name === 'interactions');

const game = gameConfig({
    map: chunkMapData(mapData, 20),
    blocked: chunkMapData(blockedData, 20),
    interactions: chunkMapData(interactionsData, 20)
});
const server = Server({
    games: [ Game(game) ]
});
server.run(PORT, () =>
    console.log(`App launched @ ::${PORT}`)
);
