import {
    Server
} from 'boardgame.io/server';
import {
    Game
} from 'boardgame.io/core';
import Dungeon from '@mikewesthad/dungeon';

import gameConfig from '../core/common/game';

const dungeonData = new Dungeon({
    randomSeed: 1234,
    doorPadding: 2,
    height: 30,
    rooms: {
        height: {
            max: 11,
            min: 5,
            onlyOdd: true
        },
        width: {
            max: 11,
            min: 5,
            onlyOdd: true
        }
    },
    width: 30
});

const {
    doorPadding,
    roomConfig,
    r,
    roomGrid,
    tiles,
    rooms,
    ...map
} = dungeonData;

const createBlankRoom = (width, height) => Array(height)
    .fill(null)
    .map(() => Array(width)
        .fill(0)
    )

const convertTiles = tiles => tiles
    .map(tile => ({
        index: tile,
        seen: false,
    }));

const PORT = parseInt(process.env.PORT, 10) || 8080;

const game = gameConfig({
    map: {
        ...map,
        rooms: rooms.map(({ tiles, ...room }) => ({
            ...room,
            tiles: tiles.map(convertTiles),
        }))
    },
});
const server = Server({
    games: [ Game(game) ]
});
server.run(PORT, () =>
    console.log(`App launched @ ::${PORT}`)
);
