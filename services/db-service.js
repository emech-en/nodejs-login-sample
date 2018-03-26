const Models = require('./../models/');
const crypto = require('crypto');

function hashPassword(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

async function login(username, password, cb) {
    // Hash password
    hashedPassword = hashPassword(password);

    try {
        let user = await Models.Account.findOne({ 'username': username, 'password': hashedPassword }).exec();
        if (!user)
            return cb('UserNotFound');
    } catch (err) { return cb(err); }

    return cb();
}

async function signup(account, cb) {
    // Hash password
    hashedPassword = hashPassword(account.password);

    try {
        // Check 
        let result = await Models.Account.find({ 'username': account.username }).exec();
        if (result.length)
            return cb('UsernameDuplicated');

        result = await Models.Account.find({ 'email': account.email }).exec();
        if (result.length)
            return cb('EmailDuplicated');
    } catch (err) { return cb(err) }

    return new Models.Account({
        username: account.username,
        password: hashedPassword,
        name: account.name,
        family: account.family
    }).save(cb);
}

module.exports = {
    signup: signup,
    login: login
}