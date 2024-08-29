const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function sendEmail(email, subject, message) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Follow-up email sent to: ${email}`);
}

async function consumeDelayedQueue() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'delayed_exchange';

        await channel.assertExchange(exchange, 'x-delayed-message', {
            arguments: { 'x-delayed-type': 'direct' },
            durable: true,
        });

        const queue = await channel.assertQueue('follow_up_queue', { durable: true });
        console.log('Waiting for follow-up emails...');

        channel.bindQueue(queue.queue, exchange, '');

        channel.consume(queue.queue, async (msg) => {
            const emailTask = JSON.parse(msg.content.toString());
            console.log(`Received delayed email task: ${emailTask.email}`);
            await sendEmail(emailTask.email, emailTask.subject, emailTask.message);
            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error in consuming delayed queue:', error);
    }
}

consumeDelayedQueue();
