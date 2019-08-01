const db = require('./configure.js');
const Word = db.word;
const Translation = db.translation;


module.exports.isWordExists = function(W){
  return Word.count({
   raw:true, 
   where: { 
     word: W
   }
 }).then(count => 
 {
  var f = count;
   //console.log(f);
    return count; 
 }) 
};



module.exports.FindTran = function(W){
return Word.findAll({
  raw:true,
  where: { 
    word: W
  },
  attributes: [ /*'id', 'word'*/],
  include: [{
    model: Translation,
    where: { word_id: db.Sequelize.col('word.id') },
    attributes: ['translation']
  }]
}).then(words => {
   //res.send(words);
   
   //var d = words[1]['translations.translation'];
   
   //return d;
   //console.log(d);
   return words;
});
}


/*
module.exports.findTranslations = function(req, res){
  Word.findAll({
    attributes: [ 'id', 'word'],
    include: [{
      model: Translation,
      where: { word_id: db.Sequelize.col('company.id') },
      attributes: ['id', 'translation', 'word_id']
    }]
  }).then(words => {
     res.send(words);
     console.log(res);
  });
}*/
/*  
exports.findAll = (req, res) => {
    Word.findAll({
      attributes: [ 'id', 'word'],
      include: [{
        model: Translation,
        where: { word_id: db.Sequelize.col('company.id') },
        attributes: ['id', 'translation', 'word_id']
      }]
    }).then(words => {
       res.send(words);
    });
  };
  */