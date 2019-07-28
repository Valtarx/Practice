var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = 'rpc_queue';
    channel.assertQueue(queue, {
      durable: true
    });
    
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
    
      var str = msg.content.toString();
      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from("Hello "+str), {
          correlationId: msg.properties.correlationId
        });
      channel.ack(msg);
    });
  });
});
