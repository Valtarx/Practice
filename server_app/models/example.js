'use strict';

module.exports = (sequelize, DataTypes) => {

  var Example = sequelize.define('Example', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    example: {
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
        allowNull:true,     /* потом надо исправить на false
    references: {
        model: Website,
        key: 'id'
    } */
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'example'
  });

  Example.associate = function (models) {
    models.Example.belongsTo(models.Word, {
      onDelete: "CASCADE",
      foreighKey: 'word_id',
      targetKey: 'id'
    });

  };

  return Example;

};
