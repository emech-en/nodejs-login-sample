const { ServiceBroker } = require('moleculer');

const broker = new ServiceBroker({
    namespace: 'cheshmak',
    transporter: 'AMQP',
    logger: console,
    logLevel: 'info',
});

let brokerStarted = false;
let foundedService = {};
async function findService(serviceName) {
    if (!brokerStarted) {
        await broker.start();
        brokerStarted = true;
    }

    if (!foundedService[serviceName]) {
        await broker.waitForServices(serviceName);
        foundedService[serviceName] = true;
    }
}

async function callService(serviceName, methodName, args) {
    await findService(serviceName);
    return await broker.call(serviceName + '.' + methodName, args);
}

module.exports = {
    callService: callService
}