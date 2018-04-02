// Read .env file.
require('dotenv').config();
// Config mongoose
require('./configs/mongoose');

const { ServiceBroker } = require('moleculer');
const { MoleculerError } = require('moleculer').Errors;
const dbService = require('./services/db-service');

const broker = new ServiceBroker({
    namespace: 'cheshmak',
    logger: console,
    logLevel: 'info',
    transporter: 'AMQP'
});

function handlerError(err) {
    // Handle known errors.
    if (err.code && err.code < 100)
        throw new MoleculerError('Service Error', err.code, 'SERVICE_ERR', err);

    throw new MoleculerError(err.message, err.code, 'INTERNAL_ERR', {
        code: err.code,
        message: err.message,
        stack: err.stack
    });
}

broker.createService({
    name: 'db-service',
    actions: {
        async login(ctx) {
            try {
                broker.logger.info('login method called with params:', ctx.params);
                return await dbService.login(ctx.params.username, ctx.params.password);
            } catch (err) {
                return handlerError(err);
            }
        },
        async signup(ctx) {
            try {
                broker.logger.info('signup method called with params:', ctx.params);
                return await dbService.signup(ctx.params.account);
            } catch (err) {
                return handlerError(err);
            }
        }
    }
});

broker.start();