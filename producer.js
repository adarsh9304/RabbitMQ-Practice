const amqp = require('amqplib/callback_api');

const queue = 'hello';
const message = 'Hello, Node';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queue, { durable: false });

    channel.sendToQueue(queue, Buffer.from(message));

    console.log("sent message is : ", message);
  });

});
