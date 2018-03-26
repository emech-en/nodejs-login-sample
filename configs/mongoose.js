const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB);

var dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'Mongoose connection error:'));

dbConnection.once('open', function() {
    console.log('Mongoose connection established.')
});

dbConnection.on('disconnected', function() {
    console.log("Mongoose connection is disconnected.");
});