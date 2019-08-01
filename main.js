const express = require('express');
const fs = require('fs');
const Pool = require('worker-threads-pool');
const pool = new Pool({max: 6})
var amqp = require('amqplib/callback_api');
const trandata = require('./database.js');

const exapp = express();

var isResponseReadyTimer;
var isResponseReadyTimers = [];
var isResponseReadyFlags  = [];
var totalNumOfResponses = -1;
var timer1;
var timer2;
exapp.get("/translations",function(request,response){
  const {source,word} = request.query;
  // var word   = "lay";
  // var source = "https://wooordhunt.ru";
  // source = "https://dictionary.cambridge.org"; 
  var queue = 'translation_queue';
  var v = "start";

  trandata.FindTran(v).then(data => {
    //console.log(data);
    
    var trans = [];
    for (j = 0; j<data.length; j++) {
      trans[j] = data[j]['translations.translation'];
    }
    var check = trans[0];

    if(check != undefined){    
        console.log("Yes! Word already exists");
        for (j = 0; j<data.length; j++) 
          console.log(trans[j]);
        
        //тут доступен массив trans
    }
    else{
        console.log("No! Word doesn't exist.");
        amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    var indexOfThisResponse;
    ++totalNumOfResponses;
    indexOfThisResponse = totalNumOfResponses;
    isResponseReadyFlags[indexOfThisResponse] = false;
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

    };
})           
  

})


exapp.get("/definitions",function(request,response){
  const {source,word} = request.query;
  var queue = 'definitions_queue';
  //var source = "https://dictionary.cambridge.org"; 
 // source = "https://www.lexico.com";
  
  //var word   = "green";
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    var indexOfThisResponse;
    ++totalNumOfResponses;
    indexOfThisResponse = totalNumOfResponses;
    isResponseReadyFlags[indexOfThisResponse] = false;
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

exapp.get("/flash-cards-maker",function(request,response){
    fs.readFile("./mainPage.html", function(error, data){          
        if(error){
                  
            response.statusCode = 404;
            response.end("Resourse not found!");
        }   
        else{
            response.end(data);
        }
    });
});

exapp.listen(4000,"127.0.0.1",function(){
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
          worker.on('message',response =>{
            
            channel.ack(msg);
            {noAck: false }
            indexOfReadyResponse = parseInt(data[0]);
            isResponseReadyFlags[indexOfReadyResponse] = response;
          })
          worker.on('exit', function () {
            
            console.log(`worker ${i} exited (pool size: ${pool.size})`)
            })
          })
        });    
    });      
});
}

function isResponseReady(response,indexOfThisResponse,data){

  if(isResponseReadyFlags[indexOfThisResponse] != false){
    clearInterval(isResponseReadyTimers[indexOfThisResponse]);
    //здесь код ответа из бд
    
    if(data.queue == "translation_queue"){
      console.log("translation_queue, oke");
      var trans = isResponseReadyFlags[indexOfThisResponse].trans;
      for(var i = 0; i<trans.length;++i){
        console.log(i+trans[i]);
     }
     database.AddWord(data.word).then(id => 
      console.log(id)
    )
    }
    else if(data.queue == "definitions_queue"){
      // console.log(isResponseReadyFlags[indexOfThisResponse].def);
      //     console.log(isResponseReadyFlags[indexOfThisResponse].examp);
      //     console.log(isResponseReadyFlags[indexOfThisResponse].numOfCells);
      var def        = isResponseReadyFlags[indexOfThisResponse].def;
      var examp      = isResponseReadyFlags[indexOfThisResponse].examp;
      var numOfCells = isResponseReadyFlags[indexOfThisResponse].numOfCells
      for(var i =0;i<def.length;++i){
        console.log(def[i]);
      }
      console.log("Examples");  
      for(var i=0;i<def.length*numOfCells;++i){
        if(examp[i]!=undefined)
        console.log(examp[i]);
      }
    }
    // console.log("index is true");
    // console.log(data.word);
    // console.log(data.source);
    // console.log(data.queue);
  }
}






