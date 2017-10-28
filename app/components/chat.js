import users from './user';

export default function ({
    socket,
    type,
    payload: {
        user: userId,
        ...payload
    } = {}
} = {}) {
    const {
        handshake: {
            query: {
                room
            }
        }
    } = socket;
    const {
        [userId]: user = {}
    } = users;

    switch (type) {
        case 'CHAT_MESSAGE_SEND':
            return socket.broadcast.to(room).emit('CHAT_MESSAGE_RECEIVE', payload);
        case 'CHAT_JOIN_ROOM':
            return socket.broadcast.to(room).emit('CHAT_MESSAGE_RECEIVE', {
                sender: 'System',
                text: `[${user.name}] has joined the fight!`
            });
        case 'DISCONNECT':
            return socket.broadcast.to(room).emit('CHAT_MESSAGE_RECEIVE', {
                sender: 'System',
                text: `[${user.name}] has abandoned the fight!`
            });
    }
};
