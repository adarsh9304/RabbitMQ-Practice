const amqp = require('amqplib/callback_api');

const queue = 'hello';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
  //If you set durable: false for the queue, the queue does not survive a RabbitMQ server restart.
    channel.assertQueue(queue, { durable: false });

    console.log("Waiting for messages in queue:", queue);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log("Received message:", msg.content.toString());
        // Acknowledge the message (RabbitMQ knows it has been received)
        channel.ack(msg);
      }
    }, {
      // Automatically acknowledge receipt of messages
      noAck: false
    });
  });
});
