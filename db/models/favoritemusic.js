'use strict';
module.exports = (sequelize, DataTypes) => {
  const favoriteMusic = sequelize.define('favoriteMusic', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'uk_index'
    },
    musicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'uk_index'
    }
  }, {});
  favoriteMusic.associate = function(models) {
    // associations can be defined here
  };
  return favoriteMusic;
};
