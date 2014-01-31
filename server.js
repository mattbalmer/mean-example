//==================
// Modules
//==================
var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path');

//==================
// Initialization
//==================
var port = process.env.PORT || 3000;
var app = express();

// Include Models
mongoose.connect('mongodb://localhost/meanexample');
var models_path = __dirname + '/schemas';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});

//==================
// Configuration
//==================
app.configure(function () {
    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout:false});
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    // Paths
    app.use( '/api', require('./controllers/api/api.js') );
    app.use( require('./controllers/root.js') );
    app.use( require('./controllers/shared.js') );

    // Stylus
    app.use(stylus.middleware({
        src: __dirname + '/public',
        debug: true,
        force: true,
        compile: function(str, path) {
            return stylus(str)
                .set('filename', path)
                .use( nib() );
        }
    }));
    app.use(express.static(path.join(__dirname + '/public')));
});

app.use(function(req, res) {
    res.render('errors/404');
})

app.configure('development', function () {
    app.locals.pretty = true;
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

//==================
// Start Server
//==================
app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});