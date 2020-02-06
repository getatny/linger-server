'use strict'
module.exports = (sequelize, DataTypes) => {
    const musicList = sequelize.define('musicList', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.STRING,
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tag: DataTypes.STRING,
        cover: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {})
    musicList.associate = function (models) {
        musicList.hasMany(models.music)
        musicList.belongsToMany(models.user, { as: 'musicLists', through: 'favoriteMusicList', foreignKey: 'musicListId' })
    }
    return musicList
}
