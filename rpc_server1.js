var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, channel) {
    channel.assertQueue('rpc_queue', { durable: false });

    channel.consume('rpc_queue', function(msg) {
      const request = JSON.parse(msg.content.toString());
      const result = performCalculation(request);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(result.toString()), {
        correlationId: msg.properties.correlationId
      });

      channel.ack(msg);
    });
  });
});

function performCalculation(request) {
  if (request.operation === 'add') {
    return request.numbers[0] + request.numbers[1];
  }
}
