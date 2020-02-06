const database = require('../../../db/models')
const musicList = database.musicList

const model = {
    createMusicList(title, description, author, tag, cover) {
        return musicList.create({ title, description, author, tag, cover })
    },

    getMusicLists(page = 1, pageSize = 5) {
        return musicList.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: database.Sequelize.literal('createdAt DESC'),
            include: { model: database.music, as: 'musics' }
        })
    }
}

module.exports = model
