'use strict'

var app    = require('./api')
  , config = require('./config');

require('simple-secure-server')(app, {
    ports: {
        default: config.express.port
    }
});
