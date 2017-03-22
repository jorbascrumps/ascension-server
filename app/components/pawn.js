export default function ({
    socket,
    type,
    payload
} = {}) {
    const [
        isolatedType,
        ...rest
    ] = type.split('_');

    switch (rest.join('_')) {
        case 'MOVE':
            return socket.broadcast.emit(type, payload);
        case 'REGISTER':
            return socket.broadcast.emit(type, payload);
        default:
            console.log(type, payload);
    }
};
