const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    connection.createChannel((err, channel) => {
        const queue = 'prefetch_queue';

        channel.assertQueue(queue, { durable: false });

        // Set prefetch to 1
        channel.prefetch(1);

        console.log('Waiting for messages with prefetch...');

        channel.consume(queue, (msg) => {
            const content = msg.content.toString();
            console.log("Received:", content);

            // Simulating slow processing
            setTimeout(() => {
                console.log("Done processing:", content);
                channel.ack(msg);
            }, 5000); // Simulate 5 seconds of processing
        });
    });
});
