export default function ({
    type,
    payload
} = {}) {
    switch (0) {
        case type.indexOf('CHAT'):
            return console.log(type, payload);
        default:
            // Default event
    }
}
