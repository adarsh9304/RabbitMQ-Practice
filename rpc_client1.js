var amqp = require('amqplib/callback_api');
const correlationId = generateUniqueId();

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, channel) {
    const replyQueue = channel.assertQueue('', { exclusive: true });

    replyQueue.then(function(q) {
      const replyQueueName = q.queue;

      channel.consume(replyQueueName, function(msg) {
        if (msg.properties.correlationId === correlationId) {
          console.log("Received response: ", msg.content.toString());
          conn.close();
        }
      }, { noAck: true });

      const rpcRequest = { operation: 'add', numbers: [5, 3] };
      channel.sendToQueue('rpc_queue', Buffer.from(JSON.stringify(rpcRequest)), {
        correlationId: correlationId,
        replyTo: replyQueueName
      });
    });
  });
});

function generateUniqueId() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
