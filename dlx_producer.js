const amqp = require('amqplib');

async function sendMessage() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // Declare a dead letter exchange and queue
  const dlxExchange = 'dlx_exchange';
  const dlxQueue = 'dead_letter_queue';
  
  await channel.assertExchange(dlxExchange, 'direct', { durable: true });
  await channel.assertQueue(dlxQueue, { durable: true });
  await channel.bindQueue(dlxQueue, dlxExchange, '');

  // Declare the main queue with dead-letter settings
  const mainQueue = 'main_queue';
  await channel.assertQueue(mainQueue, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': dlxExchange,  // Bind to the DLX
      'x-message-ttl': 10000,                 // Message TTL (e.g., 10 seconds)
      'x-dead-letter-routing-key': ''         // Optional, defaults to the same routing key
    }
  });

  // Send a message to the main queue
  const message = 'This is a test message';
  channel.sendToQueue(mainQueue, Buffer.from(message), { persistent: true });
  console.log(`Sent message to ${mainQueue}: ${message}`);

  setTimeout(() => {
    connection.close();
  }, 500);
}

sendMessage().catch(console.error);
