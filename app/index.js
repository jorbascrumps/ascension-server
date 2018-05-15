import socketio from 'socket.io';
import wildcard from 'socketio-wildcard';
import express from 'express';
import http from 'http';
import path from 'path';

import createDelegator from './components/delegator';

const app = express();
app.use('/build', express.static(path.resolve(__dirname, '../build')));

const server = http.Server(app);
const io = socketio(server);
io.use(wildcard());

io.on('connection', async socket => {
    const {
        handshake: {
            query: {
                room = DEFAULT_ROOM
            }
        }
    } = socket;

    socket.join(room);

    const delegator = createDelegator(socket);
    await delegator({
        type: 'CONNECT'
    });

    socket.on('disconnect', () => delegator({
        type: 'DISCONNECT'
    }));

    socket.on('*', async ({
        data: [
            type,
            payload
        ]
    } = {}) => await delegator({
        type,
        payload
    }));
});

server.listen(8080, () => console.log('listening on *:8080'));
