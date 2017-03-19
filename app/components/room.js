let rooms = {};

export function add ({
    id
} = {}) {
    const room = get({ id });

    if (room !== undefined) {
        return room;
    }

    return rooms[id] = {
        id,
        clients: {},
        join: ({ user }) => join({
            id,
            user
        }),
        leave: ({ user }) => leave({
            id,
            user
        })
    };
}

export function get ({
    id = null
} = {}) {
    if (!id) {
        return rooms;
    }

    return rooms[id];
}

export function join ({
    id,
    user
} = {}) {
    const room = get({ id });
    const {
        id: userId,
        ...userData
    } = user;

    room.clients[userId] = userData;

    return room;
}

export function leave ({
    id,
    user
} = {}) {
    const room = get({ id });
    const {
        [user.toString()]: deletedUser,
        ...clients
    } = room.clients;

    room.clients = clients;

    return room;
}
