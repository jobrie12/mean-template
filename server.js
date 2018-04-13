// server.js

// modules ===============================
var express = require('express');
var app = require('./app');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// configuration ==========================

// config files
var db = require('./config/db');

// set port
var port = normalizePort(process.env.PORT || 8080);
app.set('port', port);

mongoose.connect(db.url);

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

// expose app
exports = module.exports = app;