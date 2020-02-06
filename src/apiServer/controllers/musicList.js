const dbController = require('../models')
const { errorResolver } = require('./resolver')
const axios = require('axios')
const config = require('../config')

const controller = {
    createMusicList: async (ctx, next) => {
        const { title, description, author, tag, cover, list } = ctx.request.body

        await errorResolver(async () => {
            const musicList = await dbController.createMusicList(title, description, author, tag, cover)

            const musicListItem = []
            list.forEach(item => {
                const res = await musicList.createMusic({ title: item.title, singer: item.singer, cover: item.cover, playUrl: item.playUrl })
                musicListItem.push(res)
            })

            ctx.send({
                ...musicList,
                musics: musicListItem
            })
        }, ctx)

        return next()
    },

    getMusicList: async (ctx, next) => {
        const { page = 1, pageSize = 7 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: musicLists } = dbController.getMusicLists(parseInt(page), parseInt(pageSize))

            ctx.send({
                count,
                musicLists
            })
        }, ctx)

        return next()
    }
}

module.exports = controller
