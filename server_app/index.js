
const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './Words_DB.db',
    define: {
      timestamps: false
    }
  });
  
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

//Синхронизация моделей с бд
sequelize.sync().then(result=>{
 // console.log(result);
})
.catch(err=> console.log(err));


Word.findOne({
  raw:true, 
  where: { 
    word: 'start'
  }
}).then(word => {
  console.log(word);
  
}).catch(err=>console.log(err));


Translation.findAll({raw:true, attributes: ['id', 'translation'],
where: {
  word_id: 1
  }
}).then(translations=>{
  console.log(translations);
}).catch(err=>console.log(err));

Definition.findAll({raw:true, attributes: ['id', 'definition'],
where: {
  word_id: 1
  }
}).then(definitions=>{
  console.log(definitions);
}).catch(err=>console.log(err));

Example.findAll({raw:true, attributes: ['id', 'example'],
where: {
  word_id: 1
  }
}).then(examples=>{
  console.log(examples);
}).catch(err=>console.log(err));