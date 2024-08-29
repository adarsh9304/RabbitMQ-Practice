/*

Define the Exchanges:

logs_direct: A direct exchange that routes messages based on the type.
services_topic: A topic exchange that routes messages based on the service name.
Bind the Exchanges:

Bind logs_direct to services_topic so that messages that pass through logs_direct are further routed by services_topic.
Create a Queue:

Create a queue that listens for a specific combination of message type and service name.

*/


const amqp = require('amqplib/callback_api');

const RABBITMQ_URL = 'amqp://localhost';

amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const logsExchange = 'logs_direct';
        const servicesExchange = 'services_topic';
        const queueName = 'error_serviceA_queue';

        // Declare exchanges
        channel.assertExchange(logsExchange, 'direct', { durable: true });
        channel.assertExchange(servicesExchange, 'topic', { durable: true });

        // Bind the logs exchange to the services exchange
        // This means that any message sent to logs_direct with the routing key error will be forwarded to the services_topic exchange.
        channel.bindExchange(servicesExchange, logsExchange, 'error');

        // Declare the queue and bind it to the services exchange
        channel.assertQueue(queueName, { durable: true }, (error2, q) => {
            if (error2) {
                throw error2;
            }

            console.log(`Waiting for messages in ${q.queue}`);

            // Bind the queue to the services exchange with a routing key
            channel.bindQueue(q.queue, servicesExchange, 'serviceA');

            // Consume messages from the queue
            channel.consume(q.queue, (msg) => {
                console.log(`Received: ${msg.content.toString()}`);
            }, { noAck: true });
        });
    });
});
