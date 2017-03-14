import chat from './chat';

export default function ({
    socket,
    type,
    payload
} = {}) {
    switch (0) {
        case type.indexOf('CHAT'):
            return chat({ socket, type, payload });
        default:
            return console.log(type, payload);
    }
}
