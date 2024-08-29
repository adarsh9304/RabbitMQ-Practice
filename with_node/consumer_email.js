const amqp = require('amqplib');
const nodemailer = require('nodemailer'); // Example email library

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
    console.log(`Email sent to: ${email}`);
}

async function consumeEmailQueue() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'email_queue';

        await channel.assertQueue(queue, { durable: true });
        console.log('Waiting for email tasks...');

        channel.consume(queue, async (msg) => {
            const emailTask = JSON.parse(msg.content.toString());
            console.log(`Received email task: ${emailTask.email}`);
            await sendEmail(emailTask.email, emailTask.subject, emailTask.message);
            channel.ack(msg); // Acknowledge the message after processing
        });
    } catch (error) {
        console.error('Error in consuming email queue:', error);
    }
}

consumeEmailQueue();
