import {
    Server,
    // Firebase,
} from 'boardgame.io/server';
import {
    Game
} from 'boardgame.io/core';
import Dungeon from '@mikewesthad/dungeon';
import Firebase from './CustomFirebase';

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
    .map((tile, i) => ({
        index: tile,
        seen: false,
        tags: [],
    }));

const PORT = parseInt(process.env.PORT, 10) || 8080;

const game = gameConfig({
    map: {
        ...map,
        rooms: rooms.map(({ tiles, ...room }) => ({
            ...room,
            tiles: tiles
                .map(convertTiles),
        }))
    },
});
const server = Server({
    games: [ Game(game) ],
    db: new Firebase({
        config: {
            apiKey: process.env.FB_API_KEY,
            authDomain: process.env.FB_AUTH_DOMAIN,
            databaseURL: process.env.FB_DATABASE_URL,
            projectId: process.env.FB_PROJECT_ID,
        },
        dbname: process.env.FB_DATABASE_NAME,
        engine: 'RTDB',
    }),
});
server.run(PORT, () =>
    console.log(`App launched @ ::${PORT}`)
);
