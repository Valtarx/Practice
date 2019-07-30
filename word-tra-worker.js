//const {workerData} = require('worker_threads');

var needle = require('needle');
const cheerio = require('cheerio');
//workerData.source + workerData.word
needle.get("https://wooordhunt.ru/word/green",function(error,respone){
    if(!error){
        const $ = cheerio.load(respone.body);
        var translations = [];
        var numOfTra = 0;
        var numOfHidden;
        console.log("star");
        for(var i = 0; i<$('div.tr').length;++i){
            //console.log("NumOfChildren:"+$('div.tr').eq(i).children().length);
            
            for(var j = 0; j<$('div.tr').eq(i).children("span").length-1;++j){
                translations[numOfTra] = $('div.tr').eq(i).children("span").eq(j).text();
                numOfTra++;
            }
            //console.log("hidden:"+$('div.tr').eq(i).children("div.hidden").children("span").length);
            numOfHidden = $('div.tr').eq(i).children("div.hidden").length;
            for(var j =0; j<$('div.tr').eq(i).children("div.hidden").eq(numOfHidden-1).children("span").length;++j){
                translations[numOfTra] = $('div.tr').eq(i).children("div.hidden").eq(numOfHidden-1).children("span").eq(j).text();
                ++numOfTra;
            }
            
        }

        for(var i = 0; i<translations.length;++i){
            console.log(i+translations[i]);
        }
        console.log("end");
        

    }
})
