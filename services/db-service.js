const Models = require('./../models/');
const crypto = require('crypto');
const makeSentence = require('./make-sentence');

function hashPassword(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

// Perform user authentication operation.
// Using new async/await suntax.
async function login(username, password) {
    hashedPassword = hashPassword(password);

    let user = await Models.Account.findOne({ 'username': username, 'password': hashedPassword }).exec();
    if (user)
        // User Authentication is completed successfully.  
        return Promise.resolve(user.getView());

    return Promise.reject({
        code: 40,
        message: makeSentence(['Invalid', 'username', 'or', 'password'])
    });
}

async function signup(account) {
    hashedPassword = hashPassword(account.password);

    let user = await new Models.Account({
        username: account.username,
        password: hashedPassword,
        name: account.name,
        family: account.family,
        email: account.email
    }).save();
    return Promise.resolve(user.getView());
}

module.exports = {
    signup: signup,
    login: login
}