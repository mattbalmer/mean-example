var express = require('express'),
    utils = require('custom_utils'),
    User = require('mongoose').model('User'),
    errors = require('shared').errors;
var app = express();
module.exports = app;

// Helpers
function render(req, res, view, options) {
    utils.isLoggedIn(req, function(user) {
        var opts = {
            page: view,
            isLoggedIn: !!user,
            user: user
        };

        for( var k in options ) {
            if( options.hasOwnProperty(k) && opts.hasOwnProperty(k) ) {
                opts[k] = options[k];
            }
        }

        res.render(view, opts);
    });
}

// Static Pages
app.get('/', function(req, res) {
    render(req, res, 'index', { page: '' });
});

app.get('/register', function(req, res) {
    render(req, res, 'register');
});

app.get('/login', function(req, res) {
    render(req, res, 'login');
});

app.get('/inventory', utils.requiresLogin, function(req, res) {
    render(req, res, 'inventory');
});

// Jasmine Unit Tests (Specs)
app.get('/spec', function(req, res) {
    res.render('SpecRunner', {
        libs: [ '/vendor/js/angular.min.js', '/vendor/js/angular-mocks.js' ],
        sources: [
            '/ng/app.js',
            '/ng/controllers/register_form.js',
            '/ng/factories/validator.js',
            '/ng/services/validator.js'
        ],
        specs: [
            '/spec/register_form.js',
            '/spec/validator_factory.js',
            '/spec/validator_service.js'
        ]
    });
});


// Control Paths
app.post('/login', utils.requiresAuthHeaders, function(req, res) {

    User.authenticate( req.body.email, req.header('password') || req.header('token'), function(err, data) {
        if( err || !data ) {
            return res.send(404, (err || errors.INVALID_CREDENTIALS).toString() );
        }

        data.generateToken(function(err, user) {
            if( err || !user )
                res.json(206, {
                    data: user || data,
                    error: errors.CANT_MAKE_TOKEN.toString()
                });
            else {
                res.cookie('email', user.email, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false } );
                res.cookie('token', user.token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false } );
                res.json(user);
            }
        })
    });
});

app.get('/logout', function(req, res) {
    if( !(req.cookies.email && req.cookies.token) ) {
        return res.redirect('/');
    }

    User.authenticate( req.cookies.email, req.cookies.token, function(err, user) {
        if( !err && user != undefined ) {
            delete user.token;
            user.save(function() {
                res.clearCookie('email');
                res.clearCookie('token');
                res.redirect('/');
            })
        } else {
            res.redirect('/');
        }
    });
});

app.post('/logout', function(req, res) {

    User.authenticate( req.param('email'), req.header('password') || req.header('token'), function(err, user) {
        if( err || !user ) {
            return res.send(404, (err || errors.INVALID_CREDENTIALS).toString() );
        }

        delete user.token;
        user.save(function(err, user) {
            if( err || !user ) {
                res.send(500, (err || errors.UNKNOWN_ERROR).toString() );
            } else {
                req.clearCookie('email');
                req.clearCookie('token');
                res.json(user);
            }
        })
    });

});