'use strict'

var app = require('./app'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    async = require('async');

var certs = {
    key: '/etc/ssl/mb.carproof.key',
    cert: '/etc/ssl/bundle.crt'
};
readMultipleFilesAsync([certs.key, certs.cert], function (err, certificates) {
    var options = [app],
        port = (process.env.PORT || 80);

    // Launch default server
    var default_server = launchServer(port, options);

    if (err) {
        return;
    }

    options.unshift({
        key: certificates[0],
        cert: certificates[1]
    });
    port = 443;

    // Launch secure server
    var secure_server = launchServer(port, options, true);

    // Add listener to redirect http requests
    default_server.addListener('request', function (req, res) {
        return res.redirect('https://' + req.headers.host + req.url);
    });
});

function launchServer (port, options, secure) {
    var secure = secure || false,
        server = require(secure ? 'https' : 'http').createServer.apply(null, options);

    server.listen(port, function () {
        console.log('App launched @ %s:%s', this.address().address, this.address().port);
    });

var io = require('socket.io')(server);
io.use(require('socketio-wildcard')());
io.on('connection', function (socket) {
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
});

    return server;
}

function readMultipleFilesAsync (files, callback) {
    var results = [];
    async.eachSeries(files, function (file, next) {
        fs.readFile(file, function (err, result) {
            if (err) {
                return next(err);
            }

            results.push(result);
            next();
        });
    }, function (err) {
        callback(err, results);
    });
}
