import {
    Server
} from 'boardgame.io/server';
import {
    Game
} from 'boardgame.io/core';
import game from '../../common/game';

const PORT = parseInt(process.env.PORT, 10) || 8080;
const server = Server({
    games: [ Game(game) ]
});
server.run(PORT, () =>
    console.log(`App launched @ ::${PORT}`)
);
