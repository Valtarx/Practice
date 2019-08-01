const con = require('./condb.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize({

  dialect: con.dialect,
  storage: con.storage,

  pool: {
    max: con.max,
    min: con.pool.min,
    acquire: con.pool.acquire,
    idle: con.pool.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.word = require('../models/word.js')(sequelize, Sequelize);
db.translation = require('../models/translation.js')(sequelize, Sequelize);
 
// Here we can connect companies and products base on company'id
db.word.hasMany(db.translation, {foreignKey: 'word_id', sourceKey: 'id'});
db.translation.belongsTo(db.word, {foreignKey: 'word_id', targetKey: 'id'});
 
module.exports = db;

