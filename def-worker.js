//const {workerData} = require('worker_threads');

var needle = require('needle');
const cheerio = require('cheerio');
//workerData.source + workerData.word
if(0!=0){

}
else{
    needle.get("https://dictionary.cambridge.org/dictionary/english/find",function(error,respone){
        if(!error){
            console.log("star");
            const $ = cheerio.load(respone.body);
            console.log(respone.body);
            
            console.log("star");
            
            
            console.log("end");              
        }
        else{
            throw error;
            console.log("star");
        }
    })
}