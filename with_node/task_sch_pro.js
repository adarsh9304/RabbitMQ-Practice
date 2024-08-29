const amqp = require('amqplib');

async function scheduleFollowUpEmail(email) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'delayed_exchange';

        await channel.assertExchange(exchange, 'x-delayed-message', {
            arguments: { 'x-delayed-type': 'direct' },
            durable: true,
        });

        const message = { email, subject: 'Follow-up', message: 'We noticed you haven’t been active lately!' };

        channel.publish(exchange, '', Buffer.from(JSON.stringify(message)), {
            headers: { 'x-delay': 86400000 }, // Delay in milliseconds (24 hours)
        });
        console.log(`Scheduled follow-up email for: ${email}`);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in scheduling follow-up email:', error);
    }
}

// Example usage
scheduleFollowUpEmail('user@example.com');
