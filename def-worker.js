const {workerData, parentPort} = require('worker_threads');
const cheerio = require('cheerio');
var request = require('request');
//workerData = {source:"https://dictionary.cambridge.org",word:"green"};
    var site;
    switch(workerData.source){
        case "https://dictionary.cambridge.org":
            site = workerData.source+"/dictionary/english/"+workerData.word;
            break;
        case "https://www.lexico.com":
            site = workerData.source+"/en/definition/"+workerData.word;
            break;
        default:
            break;
    }
    request(site, function (err, res, body) {
        console.log("start");
        const $ = cheerio.load(body);
        var definitions = [];
        var examples = [];
        var numOfDef =0;
        const minNumOfExamples = 3;
        var partOfSpeech;
        var definitionBlock;
        var examplesBlock;
        var definition;
        var example;
        var min;
        var j;
        console.log(workerData.source);
        switch(workerData.source){
            case "https://dictionary.cambridge.org":
                    var ukDef = $("div#dataset-cald4.dictionary");
                    for(var i =0; i<ukDef.find("div.entry-body").children().length;++i){
                        partOfSpeech = ukDef.find("div.entry-body").children().eq(i);
                        for(var i1 = 0;i1<partOfSpeech.find("div.pos-body").children("div.sense-block").length;++i1){
                            definitionBlock = partOfSpeech.children("div.pos-body").children("div.sense-block").eq(i1);
                            definitionBlock = definitionBlock.children("div.sense-body");
                            definitionBlock = definitionBlock.children("div.def-block.pad-indent");
                            definition = definitionBlock.children("p.def-head.semi-flush");
                            definition = definition.children("b.def");
                            definitions[numOfDef] = definition.text();
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
                    break;
                case "https://www.lexico.com":
                    console.log("lexico");
                    var partOfSpeechBlock = $("div.entryWrapper");
                    var extraExamplesBlock;
                    var exLen1;
                    var exLen2;
                    var j1 =0;
                    for(var i =0;i<partOfSpeechBlock.children("section.gramb").length;++i){
                        partOfSpeech = partOfSpeechBlock.children("section.gramb").eq(i);
                        partOfSpeech = partOfSpeech.children("ul.semb");
                        for(var i1 =0;i1<partOfSpeech.children("li").length;++i1){
                            definitionBlock = partOfSpeech.children("li").eq(i1);
                            definitionBlock = definitionBlock.children("div.trg");
                            definition = definitionBlock.children("p").children("span.ind").text();
                            definitions[numOfDef] = definition;
                            ++numOfDef;

                            examplesBlock = definitionBlock;
                            extraExamplesBlock = examplesBlock.children("div.examples");
                            extraExamplesBlock = extraExamplesBlock.children("div.exg");
                            extraExamplesBlock = extraExamplesBlock.children("ul.english-ex");
                            exLen1 = examplesBlock.children("div.exg").length;
                            exLen2 = extraExamplesBlock.children("li.ex").length
                            min = minNumOfExamples<exLen1+exLen2 ? minNumOfExamples:exLen1+exLen2;
                            j = 0;
                            j1= 0;
                            while(j<min){
                                if(j<exLen1){
                                    example = examplesBlock.children("div.exg").eq(j).text();
                                    examples[(numOfDef-1)*3+j] = example;
                                }
                                else{
                                    example = extraExamplesBlock.children("li.ex").eq(j1).text();
                                    examples[(numOfDef-1)*3+j] = example;
                                    ++j1;
                                }
                                ++j;
                            }
                        }
                    }
                    break;
                default:
                    break;
        }

        


        // for(var i =0;i<definitions.length;++i){
        //     console.log(definitions[i]);
        // }
        // console.log("Examples");
        // for(var i=0;i<numOfDef*minNumOfExamples;++i){
        //     if(examples[i]!=undefined)
        //     console.log(examples[i]);
        // }
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
        parentPort.postMessage({def:definitions,examp:examples,numOfCells:minNumOfExamples});
        console.log("end");    
    });




