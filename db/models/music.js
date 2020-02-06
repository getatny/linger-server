'use strict'
module.exports = (sequelize, DataTypes) => {
    const music = sequelize.define('music', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        singer: DataTypes.STRING,
        cover: {
            type: DataTypes.STRING,
            allowNull: false
        },
        playUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        musicListId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {})
    music.associate = function (models) {
        music.belongsTo(models.musicList)
        music.belongsToMany(models.user, { as: 'musics', through: 'favoriteMusic', foreignKey: 'musicId' })
    }
    return music
}
