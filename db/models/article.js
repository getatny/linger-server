'use strict'
module.exports = (sequelize, DataTypes) => {
    const article = sequelize.define('article', {
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
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {})
    article.associate = function (models) {
        article.belongsToMany(models.user, { as: 'articles', through: 'favoriteArticle', foreignKey: 'articleId' })
    }
    return article
}
