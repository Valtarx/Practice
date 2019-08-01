const con = {
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
  };
   
  module.exports = con;