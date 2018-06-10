require('babel-register')({
    ignore: filename => filename.indexOf('/node_modules/') !== -1
});
require('babel-polyfill');
require('./app/boardgame');
