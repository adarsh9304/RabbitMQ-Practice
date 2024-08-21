const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    connection.createChannel((err, channel) => {
        const queue = 'prefetch_queue';

        channel.assertQueue(queue, { durable: false });

        for (let i = 1; i <= 10; i++) {
            const msg = `Message ${i}`;
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log("Sent:", msg);
        }

        setTimeout(() => {
            connection.close();
        }, 500);
    });
});
