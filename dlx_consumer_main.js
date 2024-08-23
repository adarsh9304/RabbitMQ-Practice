const amqp = require('amqplib');

async function consumeMainQueue() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const mainQueue = 'main_queue';

  // Consume messages from the main queue
  channel.consume(mainQueue, (msg) => {
    if (msg !== null) {
      console.log(`Received from main queue: ${msg.content.toString()}`);
      
      // Simulate rejecting the message, which will dead-letter it
      channel.reject(msg, false);  // false -> do not requeue, send to DLX
    }
  }, { noAck: false });
}

consumeMainQueue().catch(console.error);
