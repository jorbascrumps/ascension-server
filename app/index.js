import socketio from 'socket.io';
import wildcard from 'socketio-wildcard';
import express from 'express';
import http from 'http';
import cors from 'cors';
import * as roomManager from './components/room';
import delegator from './components/delegator';

const app = express();
const server = http.Server(app);
const io = socketio(server);
io.use(wildcard());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

io.on('connection', socket => {
    let _room = null;

    socket.on('CHAT_JOIN_ROOM', ({ user, room }) => {
        _room = roomManager
            .add({
                id: room
            })
            .join({
                user: {
                    id: socket.id,
                    name: user
                }
            });

        socket.broadcast.emit('MESSAGE', {
            sender: 'System',
            text: `${user} has joined the fight!`
        });
    });

    socket.on('disconnect', () => {
        const {
            clients: {
                [socket.id]: user
            }
        } = _room;

        _room.leave({
            user: socket.id
        });

        socket.broadcast.emit('MESSAGE', {
            sender: 'System',
            text: `${user.name} has abandoned the fight!`
        });
    });

    socket.on('*', ({
        data: [
            type,
            payload
        ]
    } = {}) => delegator({
        socket,
        type,
        payload
    }));
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});
