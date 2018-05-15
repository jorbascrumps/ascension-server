require('babel-register')({
    ignore: filename => filename.indexOf('/app/') === -1
});
require('babel-polyfill');
require('./app');
