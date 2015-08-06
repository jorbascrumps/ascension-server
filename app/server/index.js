'use strict';

var io = require('socket.io').listen(8080);
io.use(require('socketio-wildcard')());

io.on('connection', function (socket) {
    require('./lib/delegator')(socket, io);
});
