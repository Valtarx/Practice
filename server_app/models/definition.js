
'use strict';

module.exports = (sequelize, DataTypes) => {

  var Definition = sequelize.define('Definition', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    definition: {
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
    modelName: 'definition'
  });

  Definition.associate = function (models) {
    models.Definition.belongsTo(models.Word, {
      onDelete: "CASCADE",
      foreighKey: 'word_id',
      targetKey: 'id'
    });

  };

  return Definition;

};

