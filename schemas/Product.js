var mongoose = require('mongoose'),
    errors = require('shared').errors;

// Define Schema
var ProductSchema = new mongoose.Schema({
    name: String,
    count: Number,
    cost: Number,
    price: Number,
    description: String,

    __v: { type: Number, select: false },
    _id: {
        type: mongoose.Schema.ObjectId,
        default: function() {
            var ObjectId = mongoose.Types.ObjectId;
            return new ObjectId();
        }
    }
});

// Statics
ProductSchema.statics.findByIdOrName = function(idOrName, callback) {

    // Check to see if the identifier is a valid _id
    if( new RegExp("^[0-9a-fA-F]{24}$").test(idOrName) ) {

        // If it *is*, check it as an ID first.
        this.findOne({ _id: idOrName}, function(err, product) {

            // If the ID check returned nothing, try it as a name value
            if( err || !product ) {
                this.findOne({ 'name' : { $regex : new RegExp(idOrName, 'i') } }, callback);
            } else {
                callback(err, product);
            }
        });
    } else {
        this.findOne({ 'name' : { $regex : new RegExp(idOrName, 'i') } }, callback);
    }
}

// Middleware
ProductSchema.set('toJSON', {
    transform: function(doc, user) {
        delete user.__v;
        return user;
    }
});

mongoose.model('Product', ProductSchema);