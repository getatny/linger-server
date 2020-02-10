const database = require('../../../db/models')
const musicList = database.musicList

const model = {
    createMusicList(title, description, author, tag, cover) {
        return musicList.create({ title, description, author, tag, cover })
    },

    updateMusicList(id, title, description, author, tag, cover) {
        return musicList.update({ title, description, author, tag, cover }, { where: { id } })
    },

    getMusicLists(page = 1, pageSize = 5) {
        return musicList.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: database.Sequelize.literal('createdAt DESC'),
            include: { model: database.music, as: 'music' }
        })
    },

    deleteMusicLists(lists) {
        return musicList.destroy({ where: {
            [Op.or]: { id: lists }
        } })
    },

    getMusicList(id) {
        return musicList.findOne({ where: { id } })
    }
}

module.exports = model
