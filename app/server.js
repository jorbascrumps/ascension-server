'use strict'

var app    = require('./api')
  , config = require('./config');

var options = {
    ports: {
        default: config.express.port
    }
};
require('simple-secure-server')(app, options, function (err, normal, secure) {
    console.log('App launched');
});
