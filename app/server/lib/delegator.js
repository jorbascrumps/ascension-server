'use strict';

module.exports = function (socket) {
    socket.on('disconnect', function () {
        socket.to('room').emit('chat.message.receive', {
            message: 'User has left.'
        });
    });

    socket.on('*', function (payload) {
        var event_name = payload.data[0].split('.'),
            event_data = payload.data[1];

        console.log(event_name, event_data);
        socket.join('room');

        switch (event_name[0]) {
            case 'chat':
                if (!event_data.sender) {
                    event_data.sender = 'System';
                }
                socket.to('room').emit('chat.message.receive', event_data);
        }
    });
}
