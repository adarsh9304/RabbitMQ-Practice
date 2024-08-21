const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    connection.createChannel((err, channel) => {
        const queue = 'prefetch_queue';

        channel.assertQueue(queue, { durable: false });

        // Set prefetch to 1
        channel.prefetch(1);

        console.log('Consumer 2 waiting for messages...');

        channel.consume(queue, (msg) => {
            const content = msg.content.toString();
            console.log("Consumer 2 received:", content);

            // Simulate slower processing time
            setTimeout(() => {
                console.log("Consumer 2 done processing:", content);
                channel.ack(msg);
            }, 2000); // Simulating 2 seconds processing
        });
    });
});
