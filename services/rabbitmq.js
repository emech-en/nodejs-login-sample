const amqp = require('amqplib/callback_api');
const uniqid = require('uniqid');
const dbService = require('../services/db-service');

const dbQueueName = 'db-service-queue';

function connectToRabbitMQ() {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBIT, (err, connection) => {
            if (err)
                return reject('RabbitMQ connection Error: ' + err);

            console.log('RabbitMQ connection established.');
            return resolve(connection);
        });
    });
};


async function consumeReply(channel, replyQueue, correlationId, resolve, reject) {
    const consumerTag = uniqid();
    return await channel.consume(replyQueue, async(messge) => {
        if (messge.properties.correlationId !== correlationId)
            return;

        await channel.cancel(consumerTag);
        await channel.deleteQueue(replyQueue);
        await channel.close();
        const reply = JSON.parse(messge.content.toString());
        if (reply.status === 'ok')
            return resolve(reply.data);
        else
            return reject(reply.data);
    }, { noAck: true, consumerTag: consumerTag });
}

module.exports = {
    _connection: undefined,
    _init: async function() {
        if (!this._connection)
            this._connection = await connectToRabbitMQ();

        const replyQueue = uniqid();
        const correlationId = uniqid();
        const channel = await this._connection.createChannel();
        await channel.assertQueue(replyQueue, { autoDelete: true });

        return {
            replyQueue: replyQueue,
            correlationId: correlationId,
            channel: channel
        };
    },
    _sendRequest: async function(data) {
        const info = await this._init();
        return new Promise(async(resolve, reject) => {
            await consumeReply(info.channel, info.replyQueue, info.correlationId, resolve, reject);
            info.channel.sendToQueue(dbQueueName, new Buffer(JSON.stringify(data)), {
                correlationId: info.correlationId,
                replyTo: info.replyQueue
            });
        });
    },
    login: async function(username, password) {
        return await this._sendRequest({
            'task': 'login',
            'username': username,
            'password': password
        });
    },
    signup: async function(account) {
        return await this._sendRequest({
            'task': 'signup',
            'account': account
        });
    },
}