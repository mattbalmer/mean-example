var express = require('express'),
    fs = require('fs');
var app = module.exports = express();

// Index shared files
var shared_files = {};
var shared_path = './node_modules/shared/bin';
fs.readdirSync(shared_path).forEach(function (file) {
    if (~file.indexOf('.js')) {
        shared_files[file] = shared_path + '/' + file;
    }
});

// Index partials
var view_partials = [];
var partials_path = './views/partials';
fs.readdirSync(partials_path).forEach(function (file) {
    if (~file.indexOf('.jade')) {
        view_partials.push( file.substring(0, file.length-5) );
    }
});

// Spec Files
var spec_files = [];
var spec_path = './spec';
fs.readdirSync(spec_path).forEach(function (file) {
    if (~file.indexOf('.js')) {
        spec_files[file] = spec_path + '/' + file;
    }
});

// Route Shared Files
app.get( '/shared/:filename', function(req, res) {
    var requestedFile = shared_files[req.param('filename')];
    if( requestedFile )
        res.sendfile( requestedFile );
    else
        res.send(404);
});
app.get( '/partials/:filename', function(req, res) {
    if( ~view_partials.indexOf(req.param('filename')) )
        res.render( 'partials/' + req.param('filename') );
    else
        res.send(404);
});
app.get( '/spec/:filename', function(req, res) {
    var requestedFile = spec_files[req.param('filename')];
    if( requestedFile )
        res.sendfile( requestedFile );
    else
        res.send(404);
});
