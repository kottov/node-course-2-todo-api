const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens:[{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    return _.pick(this.toObject(), ['email', '_id']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toString(), access }, 'abc123').toString();

    user.tokens.push({ access, token });

    return user.save().then(() => {
            return token;
        });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    
    return User.findOne({email}).then((user) => {
        return new Promise((resolve, reject) => {
            if(!user) reject();
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) resolve(user);
                reject();
            });
        });
    });
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject(new Error());
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    });
};

UserSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {
        var saltDeep = parseInt(process.env.SALT_DEEP);
        bcrypt.genSalt(saltDeep, (err, salt) => {
            if(err) next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
    
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };