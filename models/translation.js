'use strict';

module.exports = (sequelize, DataTypes) => {

  var Translation = sequelize.define('translation', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      translation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      word_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.Word,
          key: 'id'
        }
      },
      website_id: {
        type: DataTypes.STRING,
        allowNull:true,     /*надо исправить на false
        references: {
          model: Website,
          key: 'id'
        } */
      }
    }, {
      underscored: true,
      sequelize,
      modelName: 'translation'
    });
/*
    Translation.belongsTo(sequelize.models.Word, {
     // onDelete: "CASCADE",
      foreighKey: 'word_id',
      targetKey: 'id'
    });
*/
    /*
    Translation.associate = function (models) {
      models.Translation.belongsTo(models.Word, {
        onDelete: "CASCADE",
        foreighKey: 'word_id',
        targetKey: 'id'
      });
    };
    */
/*
   Translation.associate = function (models) {
    models.Translation.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
*/
  return Translation;

};
