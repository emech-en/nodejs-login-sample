const makeSentence = require('./make-sentence')

// Read .env file.
require('dotenv').config();
// Load Mongoose config,
require('./configs/mongoose');

const express = require('express');
const dbService = require('./services/db-service');
const UserService = require('./services/user-service');

const userService = new UserService(express.Router(), dbService);

const app = express();
app.use(express.json());
app.use('/api/v1.0/auth/', userService.getRouter());

app.use(function(error, req, res, next) {
    if (error.name === 'ReqValidation') {
        // Log the error 
        console.log('Bad Request');

        // Set a bad request http response status or whatever you want 
        res.status(400);

        // Create response 
        let responseData = {
            message: 'Bad Request',
            code: error.code
        };

        // Send error response 
        res.json(responseData);
    } else {
        console.log(error);
        // pass error to next error middleware handler 
        res.status(500).send(makeSentence(['Internal', 'Server', 'Error']));
    }
});


app.listen(process.env.PORT, () => console.log('Cheshmak test app listening on port ' + process.env.PORT + '!'));