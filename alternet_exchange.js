const amqp = require('amqplib');

async function setupAlternateExchange() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        // Declare the alternate exchange
        const alternateExchange = 'unroutable_exchange';
        await channel.assertExchange(alternateExchange, 'fanout', { durable: true });

        // Declare a queue to bind to the alternate exchange
        const alternateQueue = 'unroutable_queue';
        await channel.assertQueue(alternateQueue, { durable: true });

        // Bind the queue to the alternate exchange
        await channel.bindQueue(alternateQueue, alternateExchange, '');

        console.log('Alternate exchange and queue set up successfully');
        
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error setting up alternate exchange:', error);
    }
}

setupAlternateExchange();


async function setupPrimaryExchange() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        // Declare the primary exchange with an alternate exchange
        const primaryExchange = 'primary_exchange';
        const alternateExchange = 'unroutable_exchange';

        await channel.assertExchange(primaryExchange, 'direct', {
            durable: true,
            arguments: { 'alternate-exchange': alternateExchange },
        });

        // Declare a queue to bind to the primary exchange
        const primaryQueue = 'primary_queue';
        await channel.assertQueue(primaryQueue, { durable: true });

        // Bind the queue to the primary exchange with a specific routing key
        await channel.bindQueue(primaryQueue, primaryExchange, 'valid_key');

        console.log('Primary exchange and queue set up successfully');

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error setting up primary exchange:', error);
    }
}

setupPrimaryExchange();


async function publishMessage() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchange = 'primary_exchange';

        // Publish a message with a routing key that matches
        channel.publish(exchange, 'valid_key', Buffer.from('This is a valid message'));
        console.log('Published valid message');

        // Publish a message with a routing key that doesn't match
        channel.publish(exchange, 'invalid_key', Buffer.from('This message will go to the alternate exchange'));
        console.log('Published invalid message');

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error publishing messages:', error);
    }
}

publishMessage();
