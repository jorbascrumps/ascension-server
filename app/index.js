import socketio from 'socket.io';
import express from 'express';
import http from 'http';
import cors from 'cors';
import * as roomManager from './components/room';

const app = express();
const server = http.Server(app);
const io = socketio(server);

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
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});
