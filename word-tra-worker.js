const {workerData} = require('worker_threads');

var needle = require('needle');
const cheerio = require('cheerio');

needle.get(workerData.source + workerData.word,function(error,respone){
    if(!error){
        const $ = cheerio.load(respone.body);
        
        console.log("star");
        console.log("my"+ workerData.site+" " + workerData.word);
        //let k = 0;
        // for(var i = 0; i<100000000000;++i){
        //     ++k;
        // }
        for(var i = 0; i<$('div.tr').length;++i){
            //console.log($('div.tr').eq(i).children("span").length);
            for(var j = 0; j<$('div.tr').eq(i).children("span").length;++j){
                console.log($('div.tr').eq(i).children("span").eq(j).text());
            }
            // if($('div.tr').eq(i).children('span.more').length){
            //     for(var j=0;j<$('div.tr').eq(i).children('span.more').children("span").length;++j){
            //         console.log($('div.tr').eq(i).children('span.more').children("span").eq(j).text());
            //     }
            // }
        }
        console.log("end");
        

    }
})
