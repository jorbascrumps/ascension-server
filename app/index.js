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

io.on('connection', socket => {
    let _room;

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

        socket.broadcast.emit('CHAT_MESSAGE_RECEIVE', {
            sender: 'System',
            text: `${user} has joined the fight!`
        });
    });

    socket.on('disconnect', () => {
        if (!_room) {
            return;
        }

        const {
            clients: {
                [socket.id]: user
            } = {}
        } = _room;

        _room.leave({
            user: socket.id
        });

        socket.broadcast.emit('CHAT_MESSAGE_RECEIVE', {
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
