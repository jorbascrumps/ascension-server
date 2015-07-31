'use strict';

var router = module.exports = require('express').Router();

router.route('/')
    .get(function (req, res) {
        res.send('API Home');
    });
