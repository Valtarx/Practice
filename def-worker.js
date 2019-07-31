const {workerData} = require('worker_threads');

const cheerio = require('cheerio');
var request = require('request');

if(0!=0){

}
else{
    request(workerData.source + workerData.word, function (err, res, body) {
        
        const $ = cheerio.load(body);
        console.log("star");
        var definitions = [];
        var examples = [];
        var partOfSpeech;
        var definitionBlock;
        var definition;
        var examplesBlock;
        var example;
        var numOfDef =0;
        const minNumOfExamples = 3;
        var min;
        var j;
        var ukDef = $("div#dataset-cald4.dictionary");
        for(var i =0; i<ukDef.find("div.entry-body").children().length;++i){
            partOfSpeech = ukDef.find("div.entry-body").children().eq(i);
            for(var i1 = 0;i1<partOfSpeech.find("div.pos-body").children("div.sense-block").length;++i1){
                definitionBlock = partOfSpeech.children("div.pos-body").children("div.sense-block").eq(i1);
                definitionBlock = definitionBlock.children("div.sense-body");
                definitionBlock = definitionBlock.children("div.def-block.pad-indent");
                definition = definitionBlock.children("p.def-head.semi-flush");
                definition = definition.children("b.def");
                definitions[numOfDef] = definition;
                ++numOfDef;
                examplesBlock = definitionBlock.children("span.def-body");
                min = minNumOfExamples<examplesBlock.children("div.examp.emphasized").length ? minNumOfExamples:examplesBlock.children("div.examp.emphasized").length;
                j=0;
                while(j<min){
                    example = examplesBlock.children("div.examp.emphasized").eq(j);
                    examples[(numOfDef-1)*minNumOfExamples+j] = example.text();
                    ++j;
                }
            }
        }
        for(var i =0;i<definitions.length;++i){
            console.log(definitions[i].text());
        }
        console.log("Examples");
        for(var i=0;i<numOfDef*minNumOfExamples;++i){
            if(examples[i]!=undefined)
            console.log(examples[i]);
        }
        //в массиве definitions лежат все дефиниции

        //в массиве examples лежат примеры употребления слова с данной дефиницией

        //minNumOfDef - количество ячеек массива examples, приходящийся на одну дефиницию,
        //то есть, если minNumOfDef = 3, то первой дефиниции соответствует 0,1 и 2 ячейки,
        //2-ой дефиниции 3,4 и 5, n-ой деф : n,n+1,n+2

        //Бывают случаи, когда для какой-то дефиниции нашлось примеров меньше, чем minNumOfDef,
        //в этом случае часть ячеек для такой дефиниции = undefined, короче, проверяй
        //if(examples[i]!=undefined){
        //то могу класть в бд};

        //workerData.word - здесь хранится слов
        //workerData.source - сайт

        console.log("end");    
    });
    
   console.log("end2");
}