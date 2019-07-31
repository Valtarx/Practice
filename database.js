
const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './Words_DB.db',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false
    }
  });
  var db = {};
  
  // Проверка соединения с бд
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Word = sequelize.import(__dirname + "/models/word");

const Translation = sequelize.import(__dirname + "/models/translation");
const Definition = sequelize.import(__dirname + "/models/definition");
const Example = sequelize.import(__dirname + "/models/example");



var Wo = 'start';

/* Работает
Word.findOne({
  raw:true, 
  where: { 
    word: oldword
  }
}).then(word => {
  console.log(word);
  
}).catch(err=>console.log(err));
*/



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







db.sequelize = sequelize;
db.Sequelize = Sequelize;

//module.exports = db;