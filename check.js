const check = require('./database.js');

var W = 'start';


check.isWordExists(W).then(f => {
    if(f > 0){    
        console.log(f,"Yes!");
    }
    else{
        console.log(f, "No!");
    };
})