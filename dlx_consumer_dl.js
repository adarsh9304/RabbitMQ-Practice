const amqp = require('amqplib');

async function consumeDeadLetterQueue() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const dlxQueue = 'dead_letter_queue';

  // Consume messages from the dead letter queue
  channel.consume(dlxQueue, (msg) => {
    if (msg !== null) {
      console.log(`Received from DLX: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  }, { noAck: false });
}

consumeDeadLetterQueue().catch(console.error);
