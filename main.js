const express = require('express');
const Pool = require('worker-threads-pool');
var amqp = require('amqplib/callback_api');

const exapp = express();

var isResponseReadyTimer;
var isResponseReadyTimers = [];
var isRepsonseReadyFlags  = [];
var totalNumOfResponses = -1;

exapp.get("/translations",function(request,response){
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    var indexOfThisResponse;
    ++totalNumOfResponses;
    indexOfThisResponse = totalNumOfResponses;
    isRepsonseReadyFlags[indexOfThisResponse] = false;
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'translation_queue';
                
        var msg = indexOfThisResponse.toString()+";https://wooordhunt.ru/word/;"+"green";

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
      console.log("indexOfthis"+indexOfThisResponse);
      isResponseReadyTimers[indexOfThisResponse] = setInterval(isResponseReady,1000,response,indexOfThisResponse);
      response.send("Success!");
});

})


exapp.get("/definitions",function(request,response){
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    var indexOfThisResponse;
    ++totalNumOfResponses;
    indexOfThisResponse = totalNumOfResponses;
    isRepsonseReadyFlags[indexOfThisResponse] = false;
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'definitions_queue';
        //поставить другой сайт для дефиниций        
        var msg = indexOfThisResponse.toString()+";https://wooordhunt.ru/word/;"+"green";

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
      console.log("indexOfthis"+indexOfThisResponse);
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
        var data = msg.content.toString().split(';');
        workerData.word = data[2];
        workerData.source = data[1];

        ////////////////
        pool.acquire('./word-tra-worker.js',{workerData} ,function (err, worker) {
          //pool.acquire('./ndl.js', function (err, worker) {
          if (err) throw err
          console.log(`started worker ${i} (pool size: ${pool.size})`)
          worker.on('exit', function () {
            channel.ack(msg);
              {noAck: false }
              indexOfReadyResponse = parseInt(data[0]);
              isRepsonseReadyFlags[indexOfReadyResponse] = true;
            console.log(`worker ${i} exited (pool size: ${pool.size})`)
            })
          })
        });    
    });      
});
}

function isResponseReady(response,indexOfThisResponse){
  console.log("I was Here"+indexOfThisResponse);
  if(isRepsonseReadyFlags[indexOfThisResponse] == true){
    clearInterval(isResponseReadyTimers[indexOfThisResponse]);
    //здесь код ответа из бд
    console.log("index is true");
    response.send
  }
}



var timer = setInterval(giveTask,1000);


