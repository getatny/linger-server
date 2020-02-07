const database = require('../../../db/models')
const music = database.music

const model = {
    createMusic(title, singer, cover, playUrl) {
        return music.create({ title, singer, cover, playUrl })
    },

    updateMusic(id, title, singer, cover, playUrl) {
        return music.update({ title, singer, cover, playUrl }, { where: { id } })
    },

    getMusics(page = 1, pageSize = 5) {
        return music.findAndCountAll({
            where: { musicListId: 0 },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: database.Sequelize.literal('createdAt DESC')
        })
    }
}

module.exports = model
