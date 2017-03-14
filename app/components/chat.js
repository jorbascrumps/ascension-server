export default function ({
    socket,
    type,
    payload
} = {}) {
    switch (type) {
        case 'CHAT_MESSAGE_SEND':
            return socket.broadcast.emit('MESSAGE', payload);
    }
};
