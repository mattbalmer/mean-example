var express = require('express')
    , User = require('mongoose').model('User')
    , utils = require('custom_utils')
    , errors = require('shared').errors;
var app = express();
module.exports = app;

// Find all
app.get('/', function(req, res) {
    User.find({}, function(err, data) {
        if( err || data == undefined) {
            res.send( (err || errors.DATA_NOT_FOUND).toString() );
        } else {
            res.json( data.map(function(user) {
                return user.publicObject();
            }));
        }
    })
});

// Create a new user
app.post('/', function(req, res) {
    if( !req.body ) {
        return res.send(400, 'No data');
    }

    var user = new User(req.body);
    user.save(function(err, data) {
        if( err || !data ) {
            res.send(500, (err || errors.UNKNOWN_ERROR).toString() );
        } else {
            res.json(data);
        }
    })
});

// Find one by email
app.get('/:email', utils.requiresAuthHeaders, function(req, res) {
    User.authenticate( req.param('email'), req.header('password') || req.header('token'), function(err, data) {
        if( err || !data ) {
            res.send(404, (err || errors.INVALID_CREDENTIALS).toString() );
        } else {
            res.json(data);
        }
    });
});

// Delete a user
app.delete('/:email', utils.requiresAuthHeaders, function(req, res) {

    User.authenticate( req.param('email'), req.header('password'), function(err, user) {
        if( err || !user ) {
            return res.send(404, (err || errors.INVALID_CREDENTIALS ).toString() );
        }

        User.remove({ email: user.email }, function(err, data) {
            if( err || !data ) {
                res.send(500, (err || errors.UNKNOWN_ERROR).toString() )
            } else {
                res.send('User removed');
            }
        })

    });
});