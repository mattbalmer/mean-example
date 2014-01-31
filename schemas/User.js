var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    errors = require('shared').errors;

// Define Schema
var UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String, index: { unique: true, dropDups: true },
        required: true,
        validate: [ function(value) {
            return /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/.test(value);
        }, 'Email not up to par' ]
    },
    password: {
        type: String,
        required: true,
        validate: [ function(value) {
            return /[a-zA-Z0-9]{6,30}/.test(value);
        }, 'Password not up to par' ]
    },
    points: Number,
    token: String,

    __v: { type: Number, select: false },
    _id: {
        type: mongoose.Schema.ObjectId,
        default: function() {
            var ObjectId = mongoose.Types.ObjectId;
            return new ObjectId();
        }
    }
});

// Instance Methods
UserSchema.methods.generateToken = function(callback) {
    var token = Math.random().toString(36).slice(2);

    this.token = token;
    this.save(function(err, user) {
        callback(err, user);
    });
}
UserSchema.methods.comparePassword = function(password) {
    try {
        return bcrypt.compareSync(password, this.password);
    } catch(e) {
        return e;
    }
}
UserSchema.methods.compareToken = function(token) {
    if( token == undefined || token == null || typeof token !== 'string' ) {
        return errors.EMPTY_TOKEN;
    } else {
        return this.token == token;
    }
}
UserSchema.methods.publicObject = function() {
    return {
        email: this.email
    }
}

// Static Methods
UserSchema.statics.authenticate = function(email, tokenOrPassword, callback) {
    var Users = this;
    Users.findOne({ email: email }, function(err, user) {
        if( err || !user ) {
            return callback( err || errors.INVALID_CREDENTIALS );
        }

        if( user.compareToken(tokenOrPassword) ) {
            return callback( null, user );
        }

        var comparedPassword = user.comparePassword(tokenOrPassword);
        if( comparedPassword === true ) {
            callback( null, user );
        } else {
            callback( errors.INVALID_CREDENTIALS );
        }
    });
}

// Middleware
UserSchema.pre('save', function (next) {
    if( this.isModified('password') ) {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    next();
});
UserSchema.set('toJSON', {
    transform: function(doc, user) {
        delete user.__v;
        delete user._id;
        delete user.password;
        return user;
    }
});

mongoose.model('User', UserSchema);