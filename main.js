const express = require('express');
const Pool = require('worker-threads-pool');
const pool = new Pool({max: 6})
var amqp = require('amqplib/callback_api');

const exapp = express();

var isResponseReadyTimer;
var isResponseReadyTimers = [];
var isRepsonseReadyFlags  = [];
var totalNumOfResponses = -1;
var timer1;
var timer2;
exapp.get("/translations",function(request,response){
  var word   = "green";
  var source = "https://wooordhunt.ru";
  source = "https://dictionary.cambridge.org"; 
  var queue = 'translation_queue';           
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
        var msg = indexOfThisResponse.toString()+";"+source+";"+word;

        channel.assertQueue(queue, {
            durable: true
        });
        if(timer1 == undefined)
          timer1 = setInterval(giveTask,1000,{queueName:queue,fileName:'./tra-worker.js'});
        
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
      isResponseReadyTimers[indexOfThisResponse] = setInterval(isResponseReady,1000,response,
        indexOfThisResponse,{source:source,word:word,queue:queue});
      response.send("Success!");
});

})


exapp.get("/definitions",function(request,response){
  var queue = 'definitions_queue';
  var source = "https://dictionary.cambridge.org"; 
  source = "https://www.lexico.com";
  var word   = "green";
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
        
        var msg = indexOfThisResponse.toString()+";"+source+";"+word;

        channel.assertQueue(queue, {
            durable: true
        });
        if(timer2 == undefined)
          timer2 = setInterval(giveTask,1000,{queueName:queue,fileName:'./def-worker.js'});
        
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
      isResponseReadyTimers[indexOfThisResponse] = setInterval(isResponseReady,1000,response,
        indexOfThisResponse,{source:source,word:word,queue:queue});
      response.send("Success!");
});
})



exapp.listen(3000,"127.0.0.1",function(){
    console.log("Сервер начал прослушивание")
})  


var i = 0;

function giveTask(typeOfTask){
  var source;
  var word;
  var workerData = {source,word};
  amqp.connect('amqp://localhost', function(error, connection) {
    connection.createChannel(function(error, channel) {
        var queue = typeOfTask.queueName;

        console.log(" [*] Waiting for messages in %s.", queue);
        channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
        var data = msg.content.toString().split(';');
        workerData.word = data[2];
        workerData.source = data[1];
        
        ////////////////
        pool.acquire(typeOfTask.fileName,{workerData} ,function (err, worker) {
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

function isResponseReady(response,indexOfThisResponse,data){
  console.log("I was Here"+indexOfThisResponse);
  if(isRepsonseReadyFlags[indexOfThisResponse] == true){
    clearInterval(isResponseReadyTimers[indexOfThisResponse]);
    //здесь код ответа из бд
    
    console.log("index is true");
    console.log(data.word);
    console.log(data.source);
    console.log(data.queue);
    response.send
  }
}






