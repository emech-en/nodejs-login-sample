const makeSentence = require('./services/make-sentence')

// Read .env file.
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const dbService = require('./services/rabbitmq');
const UserService = require('./services/user-service');

const userService = new UserService(express.Router(), dbService);

const app = express();
app.use(express.json());
app.use(morgan(':method :url :status - :response-time ms'));
app.use('/api/v1.0/auth/', userService.getRouter());

app.use(function(error, req, res, next) {
    console.log('Error:', error);
    if (error.code < 100) {
        return res.status(400).json(error);
    } else {
        return res.status(500).json({
            code: 40,
            message: makeSentence(['Internal', 'Server', 'Error'])
        });
    }
});


app.listen(process.env.PORT, () => console.log('Cheshmak test app listening on port ' + process.env.PORT + '!'));