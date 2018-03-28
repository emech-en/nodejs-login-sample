const amqp = require('amqplib/callback_api');
const uniqid = require('uniqid');

// Read .env file.
require('dotenv').config();
// Load Mongoose config,
require('./configs/mongoose');

const dbService = require('./services/db-service');
const qName = 'db-service-queue';

async function handleRequest(request) {
    console.log('Request received: ', request);
    if (request.task === 'login')
        return await dbService.login(request.username, request.password);
    else if (request.task === 'signup')
        return await dbService.signup(request.account);

    return Promise.reject({
        code: 150,
        message: 'Unkown task'
    });
};

console.log('Staring db-worker...');
amqp.connect(process.env.RABBIT, async(err, connection) => {
    if (err) {
        console.error('RabbitMQ connection Error: ' + err);
        process.exit(1);
    }

    console.log('RabbitMQ connection established.');

    const channel = await connection.createChannel();
    channel.assertQueue(qName, { durable: false });
    channel.prefetch(1);

    const consumerOptions = {
        consumerTag: uniqid()
    };
    const consumer = await channel.consume(qName, async message => {
        console.log('Message received');
        let request = JSON.parse(message.content.toString());
        let result = {};
        try {
            let reqResult = await handleRequest(request);
            result.status = 'ok';
            result.data = reqResult;
        } catch (err) {
            console.error(err);
            result.data = err;
        }

        result = new Buffer(JSON.stringify(result));
        channel.sendToQueue(message.properties.replyTo, result, {
            correlationId: message.properties.correlationId
        });

        channel.ack(message);
        console.log('Request replied.');
    }, consumerOptions);

    // console.log(consumer.consumerTag);
    process.on('SIGINT', async(singal) => {
        try {
            console.log();
            console.log('SIGINT received...');
            console.log('       Closing connections.');
            await channel.cancel(consumerOptions.consumerTag);
            await channel.close();
            await connection.close();
            console.log('       Exit successfully.');
            process.exit(0);
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    });
});