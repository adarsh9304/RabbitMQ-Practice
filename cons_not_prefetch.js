const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    connection.createChannel((err, channel) => {
        const queue = 'no_prefetch_queue';

        channel.assertQueue(queue, { durable: false });

        console.log('Waiting for messages...');

        channel.consume(queue, (msg) => {
            const content = msg.content.toString();
            console.log("Received:", content);

            // Simulating slow processing
            setTimeout(() => {
                console.log("Done processing:", content);
                channel.ack(msg);
            }, 10000); // Simulate 5 seconds of processing
        });
    });
});
