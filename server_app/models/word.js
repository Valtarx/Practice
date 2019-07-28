'use strict';

module.exports = (sequelize, DataTypes) => {

  var Word = sequelize.define('Word', {
    // attributes
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  word: {
    type:DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
    underscored: true,
    sequelize,
    modelName: 'word',
    getterMethods: {
        wordid() {
      return this.getDataValue('id');
    }
  },
});

  Word.associate = function(models) {
    models.Word.hasMany(models.Translation, {
        foreighKey: 'word_id',
        sourceKey: 'id'
      });
  };

  Word.associate = function(models) {
    models.Word.hasMany(models.Definition, {
        foreighKey: 'word_id',
        sourceKey: 'id'
      });
  };

  Word.associate = function(models) {
    models.Word.hasMany(models.Example, {
        foreighKey: 'word_id',
        sourceKey: 'id'
      });
  };


  return Word;

};