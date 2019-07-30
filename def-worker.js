//const {workerData} = require('worker_threads');

const cheerio = require('cheerio');
var request = require('request');
//workerData.source + workerData.word

if(0!=0){

}
else{
    request("https://dictionary.cambridge.org/dictionary/english/check", function (err, res, body) {
        //console.log(body);
        var definitions = [];
        var examples = [];
        const $ = cheerio.load(body);
        console.log("star");
        console.log($("div#dataset-cald4.dictionary").text());


        console.log("end");    
    });
    
   
}