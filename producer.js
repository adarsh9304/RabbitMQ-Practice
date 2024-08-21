const amqp = require('amqplib/callback_api');

const queue = 'hello';
const message1 = 'Hello, Node 1';
const message2 = 'Hello, Node 2';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    channel.assertQueue(queue, { durable: false });

    channel.sendToQueue(queue, Buffer.from(message1));
    // { persistent: true } ensures that the message is stored to disk.
    console.log("Sent message:", message1);

    channel.sendToQueue(queue, Buffer.from(message2));
    console.log("Sent message:", message2);

    setTimeout(() => {
      connection.close();
    }, 500); 
  });
});
