export default function ({
    socket,
    type,
    payload
} = {}) {
    switch (type) {
        case 'CHAT_MESSAGE_SEND':
            return socket.broadcast.emit('CHAT_MESSAGE_RECEIVE', payload);
    }
};
