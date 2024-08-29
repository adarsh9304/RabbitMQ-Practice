const amqp = require('amqplib');

async function createLazyQueue() {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare a lazy queue
    await channel.assertQueue('my_lazy_queue', {
        durable: true,
        arguments: {
            'x-queue-mode': 'lazy'
        }
    });

    console.log('Lazy queue created');

    // Close the connection
    await channel.close();
    await connection.close();
}

createLazyQueue().catch(console.error);


async function publishMessages() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Publish messages to the lazy queue
    for (let i = 0; i < 100000; i++) {
        const message = `Message ${i}`;
        channel.sendToQueue('my_lazy_queue', Buffer.from(message));
    }

    console.log('Messages published to lazy queue');

    // Close the connection
    await channel.close();
    await connection.close();
}

publishMessages().catch(console.error);


async function consumeMessages() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Consume messages from the lazy queue
    channel.consume('my_lazy_queue', (msg) => {
        if (msg !== null) {
            console.log('Received:', msg.content.toString());
            channel.ack(msg); // Acknowledge the message
        }
    });

    console.log('Consumer started');
}

consumeMessages().catch(console.error);
