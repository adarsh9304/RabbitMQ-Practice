const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const queue = 'transaction_queue';

        channel.assertQueue(queue, {
            durable: true
        });

        // Start a transaction
        channel.txSelect(function(err) {
            if (err) {
                throw err;
            }

            try {
                // Send multiple messages in a transaction
                for (let i = 1; i <= 3; i++) {
                    const msg = `Message ${i}`;
                    channel.sendToQueue(queue, Buffer.from(msg), {
                        persistent: true
                    });
                    console.log(`Sent: ${msg}`);
                }

                // Commit the transaction
                channel.txCommit(function(err) {
                    if (err) {
                        throw err;
                    }
                    console.log('Transaction committed');
                });
            } catch (err) {
                // Rollback the transaction in case of an error
                channel.txRollback(function(err) {
                    if (err) {
                        throw err;
                    }
                    console.log('Transaction rolled back');
                });
            }
        });
    });
});
