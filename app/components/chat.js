export default function ({
    socket,
    type,
    payload
} = {}) {
    const {
        handshake: {
            query: {
                room
            }
        }
    } = socket;

    switch (type) {
        case 'CHAT_MESSAGE_SEND':
            return socket.broadcast.to(room).emit('CHAT_MESSAGE_RECEIVE', payload);
        case 'CONNECT':
            return socket.broadcast.to(room).emit('CHAT_MESSAGE_RECEIVE', {
                sender: 'System',
                text: `[Name] has joined the fight!`
                // text: `${user.name} has abandoned the fight!`
            });
        case 'DISCONNECT':
            return socket.broadcast.to(room).emit('CHAT_MESSAGE_RECEIVE', {
                sender: 'System',
                text: `[Name] has abandoned the fight!`
                // text: `${user.name} has abandoned the fight!`
            });
    }
};
