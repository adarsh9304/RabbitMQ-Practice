const amqp = require('amqplib');

async function publishEmailTask(email, subject, message) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'email_queue';

        const emailTask = { email, subject, message };

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailTask)));
        console.log(`Email task submitted for: ${email}`);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in publishing email task:', error);
    }
}

// Example usage
publishEmailTask('user@example.com', 'Welcome to Our Platform', 'Thank you for registering!');
