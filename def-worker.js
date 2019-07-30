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
        //console.log(ukDef.find("div.entry-body").children().length);
        var ukDef = $("div#dataset-cald4.dictionary");
        var partOfSpeech;
        var senseBlock;
        for(var i =0; i<ukDef.find("div.entry-body").children().length;++i){
            partOfSpeech = ukDef.find("div.entry-body").children().eq(i);
            for(var i1 = 0;i1<partOfSpeech.children("div.pos-body").children("sense-block").length;++i1){
                senseBlock = partOfSpeech.children("div.pos-body").children("sense-block").eq(i1);
                if(i==0 && i1==0){
                    console.log(senseBlock.text());
                }
            }
        }
        console.log($("div#dataset-cald4.dictionary").find("div.entry-body").text());




        console.log("end");    
    });
    
   
}