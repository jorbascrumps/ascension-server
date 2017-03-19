import chat from './chat';
import pawn from './pawn';

export default function ({
    socket,
    type,
    payload
} = {}) {
    const [
        isolatedType
    ] = type.split('_');

    switch (isolatedType) {
        case 'CHAT':
            return chat({ socket, type, payload });
        case 'PAWN':
            return pawn({ socket, type, payload });
        default:
            return console.log(type, payload);
    }
}
