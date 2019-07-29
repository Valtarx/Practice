const express = require('express');
const Pool = require('worker-threads-pool');

const exapp = express();
exapp.get("/translations",function(request,response){
  
response.send("Success!");
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
    workerData.word = "try";
    ////////////////
    pool.acquire('./word-tra-worker.js',{workerData} ,function (err, worker) {
      //pool.acquire('./ndl.js', function (err, worker) {
          if (err) throw err
          console.log(`started worker ${i} (pool size: ${pool.size})`)
          worker.on('exit', function () {
            
            console.log(`worker ${i} exited (pool size: ${pool.size})`)
          }
          )
    
});
  
}


var timer = setInterval(giveTask,1000);


