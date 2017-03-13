import socketio from 'socket.io';
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

server.listen(8080, () => {
    console.log('listening on *:8080');
});
