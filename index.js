require('babel-register')({
    ignore: function (filename) {
        if (filename.indexOf('/app/') === -1) {
            return true;
        }

        return false;
    }
});
require('./app');
