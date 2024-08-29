const amqp = require('amqplib/callback_api');

const RABBITMQ_URL = 'amqp://localhost';

let isBlocked = false; // Flag to indicate if connection is blocked
let pendingMessages = []; // Queue to hold messages while blocked

/*

# Set memory threshold to 40% of RAM
vm_memory_high_watermark.relative = 0.4

# Set disk free limit to 50MB
disk_free_limit.absolute = 50000000

*/

// Connect to RabbitMQ
amqp.connect(RABBITMQ_URL, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    console.log('Connected to RabbitMQ');

    // Handling blocked connection notification
    connection.on('blocked', (reason) => {
        console.log(`Connection blocked: ${reason}`);
        isBlocked = true;
        // Here you can alert the system admin or trigger a monitoring alert
    });

    // Handling unblocked connection notification
    connection.on('unblocked', () => {
        console.log('Connection unblocked');
        isBlocked = false;
        // Resume publishing messages that were queued while blocked
        while (pendingMessages.length > 0) {
            let { channel, queue, msg } = pendingMessages.shift();
            publishMessage(channel, queue, msg);
        }
    });

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }

        const queue = 'example_queue';

        // Assert a queue (create if it doesn't exist)
        channel.assertQueue(queue, {
            durable: true
        });

        // Example of publishing messages
        const messages = ['Message 1', 'Message 2', 'Message 3'];

        messages.forEach(msg => {
            if (isBlocked) {
                // Queue the message if connection is blocked
                pendingMessages.push({ channel, queue, msg });
                console.log(`Queued ${msg} due to blocked connection`);
            } else {
                // Publish the message if connection is not blocked
                publishMessage(channel, queue, msg);
            }
        });

        // Close connection after a short delay
        setTimeout(() => {
            connection.close();
            console.log('Connection closed');
        }, 500);
    });
});

// Function to publish a message to a queue
function publishMessage(channel, queue, msg) {
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(`[x] Sent ${msg}`);
}
