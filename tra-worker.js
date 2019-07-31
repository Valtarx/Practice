const {workerData} = require('worker_threads');
//workerData.source + workerData.word
    
const cheerio = require('cheerio');
var request = require('request');
if(0!=0){

}
else{
    var site;
        switch(workerData.source){
            case "https://dictionary.cambridge.org":
                site = workerData.source+"/dictionary/english-russian/"+workerData.word;
                break;
            case "https://wooordhunt.ru":
                site = workerData.source+"/word/"+workerData.word;
                break;
            default:
                break;
            }
    request(site, function (error, response, body) {
        
        const $ = cheerio.load(body);
        var translations = [];
        var numOfTra = 0;
        switch(workerData.source){
            case "https://wooordhunt.ru":
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
                break;
            case "https://dictionary.cambridge.org":
                console.log(workerData.source);
                var translationsBlock;
                var translation;
                var numOfSpaces;
                translationsBlock = $('div.cdo-dblclick-area');
                translationsBlock = translationsBlock.children("div.entry-body");
                translationsBlock = translationsBlock.find("div.di-body.normal-entry-body");
                translationsBlock = translationsBlock.children("div.pos-body");
                translationsBlock = translationsBlock.children("div.pos-block");
                translationsBlock = translationsBlock.children("div.pos-body");
                for(var i=0;i<translationsBlock.children("div.sense-block").length;++i){
                    translation = translationsBlock.children("div.sense-block").eq(i);
                    translation = translation.children("div.sense-body");
                    //translation = translation.children("div.phrase-block.pad-indent");
                    //translation = translation.children("div.phrase-body.pad-indent");
                    translation = translation.find("div.def-block.pad-indent");
                    translation = translation.children("span.def-body");
                    translation = translation.children("span.trans");
                    translation = translation.text();  
                    numOfSpaces = 0;
                    //while(translation[numOfSpaces]==' ') ++numOfSpaces;
                    while(translation.includes("  ")) translation = translation.replace("  "," ");
                    translation = translation.substring(2,translation.length);
                    translations[numOfTra] = translation;
                    ++numOfTra;
                }
                break;
            default:
                break;
        }
        

        for(var i = 0; i<translations.length;++i){
            console.log(i+translations[i]);
        }
        
        console.log("end");
        

    
})
}

