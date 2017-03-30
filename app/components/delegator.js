import * as roomManager from './room';
import chat from './chat';
import pawn from './pawn';

export default function (socket) {
    return ({
        type,
        payload
    } = {}) => {
        const {
            handshake: {
                query: {
                    room
                }
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
                let r = roomManager
                    .add({
                        id: room
                    })
                    .join({
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
