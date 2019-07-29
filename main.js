const http = require('http');
const Pool = require('worker-threads-pool');

http.createServer(function(request,response){
    
}).listen(3000,"127.0.0.1",function(){
    console.log("Сервер начал прослушивание")
})  



const pool = new Pool({max: 6})
var taskType;
var source ='https://wooordhunt.ru/word/';

var word;
var keyOfQueue;
var workerData = {taskType,source,word, keyOfQueue};
 var words = ['assume','green','yellow','try','view','assume','green','yellow','try','view','view'];
//  for(let i = 0; i<words.length;++i){
//      workerData.first = words[i];
//      workerData.second = i;
//     pool.acquire('./ndl.js',{workerData} ,function (err, worker) {
//     //pool.acquire('./ndl.js', function (err, worker) {
//         if (err) throw err
//         console.log(`started worker ${i} (pool size: ${pool.size})`)
//         worker.on('exit', function () {
//           console.log(`worker ${i} exited (pool size: ${pool.size})`)
//         })
//       })    
// }
var i = 0;

function giveTask(){
++i;
workerData.word = words[i];
    workerData.taskType = i;
    workerData.keyOfQueue = i;
    pool.acquire('./word-tra-worker.js',{workerData} ,function (err, worker) {
    //pool.acquire('./ndl.js', function (err, worker) {
        if (err) throw err
        console.log(`started worker ${i} (pool size: ${pool.size})`)
        worker.on('exit', function () {
          console.log(`worker ${i} exited (pool size: ${pool.size})`)
        })
      })  
 if(i==words.length){
    clearInterval(timer);
 }
//console.log(i);
}

var timer = setInterval(giveTask,1000);


