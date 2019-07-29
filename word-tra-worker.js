const {workerData} = require('worker_threads');

var needle = require('needle');
const cheerio = require('cheerio');

needle.get(workerData.source + workerData.word,function(error,respone){
    if(!error){
        const $ = cheerio.load(respone.body);
        var translations = [];
        console.log("star");
        for(var i = 0; i<$('div.tr').length;++i){
            //console.log($('div.tr').eq(i).children("span").length);
            for(var j = 0; j<$('div.tr').eq(i).children("span").length;++j){
                translations[j] = $('div.tr').eq(i).children("span").eq(j).text();
            }
            // if($('div.tr').eq(i).children('span.more').length){
            //     for(var j=0;j<$('div.tr').eq(i).children('span.more').children("span").length;++j){
            //         console.log($('div.tr').eq(i).children('span.more').children("span").eq(j).text());
            //     }
            // }
        }
        for(var i = 0; i<translations.length;++i){
            console.log(translations[i]);
        }
        console.log("end");
        

    }
})
