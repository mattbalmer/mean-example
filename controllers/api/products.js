var express = require('express')
    , Product = require('mongoose').model('Product')
    , utils = require('custom_utils')
    , errors = require('shared').errors;
var app = module.exports = express();

// Find all
app.get('/', function(req, res) {
    Product.find({}, function(err, data) {
        if( err || data == undefined) {
            res.send( (err || errors.DATA_NOT_FOUND).toString() );
        } else {
            res.json( data );
        }
    })
});

// Create a new product
app.post('/', utils.requiresAuthHeaders, function(req, res) {
    if( !req.body ) {
        return res.send(400, 'No data');
    }

    var product = new Product(req.body);
    product.save(function(err, data) {
        if( err || !data ) {
            res.send(500, (err || errors.UNKNOWN_ERROR).toString() );
        } else {
            res.json(201, data);
        }
    })
});

// Find one by id or name
app.get('/:identifier', function(req, res) {
    Product.findByIdOrName( req.param('identifier') , function respond(err, product) {
        if( err || !product ) {
            res.send(404, (err || errors.INVALID_CREDENTIALS).toString() );
        } else {
            res.json(product);
        }
    });
});

// Delete a product
app.delete('/:identifier', utils.requiresAuthHeaders, function(req, res) {

    Product.findByIdOrName( req.param('identifier') , function respond(err, product) {
        if( err || !product ) {
            return res.send(404, (err || errors.INVALID_CREDENTIALS ).toString() );
        }

        Product.remove({ _id: product._id }, function(err, data) {
            if( err || !data ) {
                res.send(500, (err || errors.UNKNOWN_ERROR).toString() )
            } else {
                res.send('Product removed');
            }
        })
    });

});

// Updates a product
app.patch('/:identifier', utils.requiresAuthHeaders, function(req, res) {

    Product.findByIdOrName( req.param('identifier') , function respond(err, product) {
        if( err || !product ) {
            return res.send(404, (err || errors.INVALID_CREDENTIALS ).toString() );
        }

        Product.findOneAndUpdate({ _id : product._id }, req.body || {}, function(err, product) {
            if( err || !product ) {
                res.send(500, (err || errors.UNKNOWN_ERROR).toString() )
            } else {
                res.json(product);
            }
        })
    });

});