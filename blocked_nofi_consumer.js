const amqp = require('amqplib/callback_api');

const RABBITMQ_URL = 'amqp://localhost';

// Connect to RabbitMQ
amqp.connect(RABBITMQ_URL, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    console.log('Connected to RabbitMQ');

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const queue = 'example_queue';

        // Assert a queue (create if it doesn't exist)
        channel.assertQueue(queue, {
            durable: true
        });

        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

        // Consume messages from the queue
        channel.consume(queue, function(msg) {
            if (msg !== null) {
                console.log(`[x] Received ${msg.content.toString()}`);
                // Acknowledge the message
                channel.ack(msg);
            }
        }, {
            noAck: false // Ensure that messages are acknowledged after processing
        });
    });
});
