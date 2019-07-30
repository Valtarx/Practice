const express = require('express');
const Pool = require('worker-threads-pool');
var amqp = require('amqplib/callback_api');

const exapp = express();

var isResponseReadyTimer;
var isResponseReadyTimers = [];
var isRepsonseReadyFlags  = [];
var totalNumOfResponses = -1;
exapp.get("",function(request,response){
  response.send(index.html);
})
exapp.get("/translations",function(request,response){
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var indexOfThisResponse;
        var queue = 'translation_queue';
        ++totalNumOfResponses;
        indexOfThisResponse = totalNumOfResponses;
        isRepsonseReadyFlags[indexOfThisResponse] = false;
        var msg = "green";

        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        console.log(" [x] Sent '%s'", msg);
    });
      //закрыть соединение с серверов очередей (если надо)
      // setTimeout(function() {
      // connection.close();
      // process.exit(0);
      // }, 500);
      isResponseReadyTimers[indexOfThisResponse] = setInterval(isResponseReady,1000,response,indexOfThisResponse);
      response.send("Success!");
});

})

exapp.listen(3000,"127.0.0.1",function(){
    console.log("Сервер начал прослушивание")
})  



const pool = new Pool({max: 6})
var source ='https://wooordhunt.ru/word/';

var word;

var workerData = {source,word};
 

var i = 0;

function giveTask(){
  amqp.connect('amqp://localhost', function(error, connection) {
    connection.createChannel(function(error, channel) {
        var queue = 'translation_queue';

        console.log(" [*] Waiting for messages in %s.", queue);
        channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());

        workerData.word = msg.content.toString();
        workerData.source = "https://wooordhunt.ru/word/";

        ////////////////
        pool.acquire('./word-tra-worker.js',{workerData} ,function (err, worker) {
          //pool.acquire('./ndl.js', function (err, worker) {
          if (err) throw err
          console.log(`started worker ${i} (pool size: ${pool.size})`)
          worker.on('exit', function () {
            channel.ack(msg);
              {noAck: false }
            console.log(`worker ${i} exited (pool size: ${pool.size})`)
            })
          })
        });    
    });      
});
}

function isResponseReady(response,indexOfThisResponse){
  if(isRepsonseReadyFlags[indexOfThisResponse] == true){
    clearInterval(isResponseReadyTimers[indexOfThisResponse]);
    //здесь код ответа из бд
    response.send
  }
}



var timer = setInterval(giveTask,1000);


