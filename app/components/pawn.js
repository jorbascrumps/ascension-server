import * as roomManager from './room';

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
    const roomData = roomManager
        .get({
            id: room
        });
    const {
        clients: {
            [socket.id]: client,
            ...clients
        }
    } = roomData;

    switch (type) {
        case 'PAWN_MOVE':
            return socket.broadcast.to(room).emit(type, payload);
        case 'PAWN_REGISTER':
            let {
                id,
                ...pawn
            } = payload;

            client.pawns[id] = pawn;

            return socket.broadcast.to(room).emit(type, {
                ...payload,
                owner: socket.id
            });
        case 'CONNECT':
            return Object.keys(clients)
                .map(id => ({
                    ...clients[id],
                    id
                }))
                .forEach(({ id: owner, pawns }) => Object.keys(pawns)
                    .map(id => ({
                        ...pawns[id],
                        id,
                        owner
                    }))
                    .forEach(pawn => socket.emit('PAWN_REGISTER', pawn))
                );
        case 'DISCONNECT':
            roomData.leave({
                user: socket.id
            });

            return socket.broadcast.to(room).emit('PAWN_UNREGISTER', {
                owner: socket.id
            });
        default:
            console.log('"', type, payload);
    }
};
