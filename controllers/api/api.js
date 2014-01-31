var express = require('express');
var app = module.exports = express();

app.use( '/users', require('./users.js') );
app.use( '/products', require('./products.js') );