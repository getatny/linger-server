const database = require('../../../db/models')
const article = database.article

const model = {
    createArticle(title, description, author, tag, cover, content) {
        return article.create({ title, description, author, tag, cover, content })
    },

    updateArticle(id, title, description, author, tag, cover, content) {
        return article.update({ title, description, author, tag, cover, content }, { where: { id } })
    },

    getArticles(page = 1, pageSize = 5) {
        return article.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: database.Sequelize.literal('createdAt DESC')
        })
    },

    deleteArticles(lists) {
        return article.destroy({ where: {
            [Op.or]: { id: lists }
        } })
    },

    getPureArticlesList(page, pageSize) {
        return article.findAndCountAll({
            attributes: ['id', 'title', 'cover'],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: database.Sequelize.literal('createdAt DESC')
        })
    },

    getArticle(id) {
        return article.findOne({ where: { id } })
    }
}

module.exports = model
