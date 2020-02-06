const database = require('../../../db/models')
const music = database.music

const model = {
    createMusic(title, singer, cover, playUrl) {
        return music.create({ title, singer, cover, playUrl })
    },

    getMusics(page = 1, pageSize = 5) {
        return music.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: database.Sequelize.literal('createdAt DESC')
        })
    }
}

module.exports = model
