var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (err, connection) {
  if (err) {
    throw err;
  }
  connection.createChannel(function (err1, channel) {
    if (err1) {
      throw err1;
    }

     var exchange='logs';
     var message=process.argv.slice(2).join( ) || 'Hello From msg';

     channel.assertExchange(exchange,'fanout',{
        durable:false
     })

     channel.publish(exchange,'',Buffer.from(message));
     console.log('send message ',message)
  });

  setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500);
});
