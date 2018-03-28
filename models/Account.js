const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    'username': {
        type: 'string',
        require: true,
        index: true,
        unique: true,
        match: /^[a-zA-Z][a-zA-Z0-9_\-\.]+$/,
        minlength: 3,
        maxlength: 30
    },
    'password': {
        type: 'string',
        require: true
    },
    'name': {
        type: 'string'
    },
    'family': {
        type: 'string'
    },
    'email': {
        type: 'string',
        require: true,
        unique: true,
        match: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    },
    'registerDate': {
        type: 'date',
        default: Date.now
    }
});

AccountSchema.post('save', function(err, doc, next) {
    if (err.name !== 'BulkWriteError' || err.code !== 11000)
        return next(err);

    if (err.message.indexOf('username') > 0)
        return next({
            code: 50,
            message: 'username is taken.'
        });

    if (err.message.indexOf('email') > 0)
        return next({
            code: 60,
            message: 'email is taken.'
        });

    return next(err);
});

AccountSchema.methods.getView = function() {
    return {
        username: this.username,
        email: this.email,
        name: this.name,
        family: this.family
    }
}

module.exports = mongoose.model('Account', AccountSchema);