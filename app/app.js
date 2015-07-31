'use strict';

var app = module.exports = require('express')();

require('simple-route-loader')(app, {
    folder: __dirname + '/api'
});
