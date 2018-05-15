import * as roomManager from './room';
import chat from './chat';
import pawn from './pawn';

const DEFAULT_ROOM = 'lobby';

export default function (socket) {
    return async ({
        type,
        payload
    } = {}) => {
        const {
            handshake: {
                query: {
                    room = DEFAULT_ROOM
                } = {}
            }
        } = socket;
        const [
            isolatedType
        ] = type.split('_');

        switch (isolatedType) {
            case 'CHAT':
                return chat({ socket, type, payload });
            case 'PAWN':
                return pawn({ socket, type, payload });
            case 'CONNECT':
                let r = await roomManager
                    .add({
                        id: room,
                        socket
                    });

                r.join({
                    user: {
                        id: socket.id,
                        pawns: {}
                    }
                });

                pawn({ type, socket });
                chat({ type, socket });

                return;
            case 'DISCONNECT':
                pawn({ type, socket });
                chat({ type, socket });

                return;
            default:
                return console.log(type, payload);
        }
    };
}
