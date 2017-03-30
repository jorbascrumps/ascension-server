import socketio from 'socket.io';
import wildcard from 'socketio-wildcard';
import express from 'express';
import http from 'http';
import cors from 'cors';
import * as roomManager from './components/room';
import createDelegator from './components/delegator';

const app = express();
const server = http.Server(app);
const io = socketio(server);
io.use(wildcard());

io.on('connection', socket => {
    let _room;
    const {
        handshake: {
            query: {
                room
            }
        }
    } = socket;

    socket.join(room);

    const delegator = createDelegator(socket);
    delegator({
        type: 'CONNECT'
    });

    socket.on('disconnect', () => delegator({
        type: 'DISCONNECT'
    }));

    socket.on('*', ({
        data: [
            type,
            payload
        ]
    } = {}) => delegator({
        type,
        payload
    }));
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});
