const database = require('../../../db/models')
const music = database.music
const Op = database.Sequelize.Op

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
    },

    deleteMusics(list) {
        return music.destroy({ where: {
            [Op.or]: { id: list }
        } })
    },

    getMusic(musicId) {
        return music.findOne({ where: { id: musicId } })
    },

    getMusicsWithFavorite(page = 1, pageSize = 5, userId) {
        return music.findAndCountAll({
            where: { musicListId: 0 },
            include: { model: database.user, as: 'users', attributes: ['id'], through: { where: { userId } } },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: database.Sequelize.literal('createdAt DESC')
        })
    }
}

module.exports = model
