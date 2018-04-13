var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');

require('./app/models/user');

var app = express();

require('./config/passport')(passport); // pass passport for configuration

// Set up scripts to point to node_modules folder
app.use('/libs', express.static(__dirname + '/node_modules/'));

// get data from POST parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// routes ==================================================
require('./app/routes')(app, passport); // configure our routes


module.exports = app;