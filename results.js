const translations = require('./database.js');
 
translations.findAll;

var W = 'start';
/*
check.isWordExists(W).then(f => {
    if(f > 0){    
        console.log(f,"Yes!");
    }
    else{
        console.log(f, "No!");
    };
})
*/
translations.FindTran(W).then(t => {
    console.log(t);
    
    var trans = [];
    for (j = 0; j<t.length; j++) {
        trans[j] = t[j]['translations.translation']
    }
    if(trans[0] != undefined){    
        console.log(t,"Yes!");
    }
    else{
        console.log(t, "No!");
    };

    //var d = t[1]['translations.translation'];
    for (let tr of trans)
    console.log(tr);
});

/*
    // Init data: Companies & Products
    app.get('/api/companies/init', companies.init);
*/ 
    // Retrieve all Companies
 //   app.get('/api/companies/all', translations.findAll);
