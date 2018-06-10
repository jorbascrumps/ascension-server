import {
    Server
} from 'boardgame.io/server';
import {
    Game
} from 'boardgame.io/core';
import game from '../../game';

const server = Server({
    games: [ Game(game) ]
});
server.run(process.env.PORT, () => console.log(`App launched @ ::${process.env.PORT}`));
