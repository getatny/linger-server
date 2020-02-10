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
            for (let i in list) {
                const music = list[i]
                const res = await musicList.createMusic(music)
                musicListItem.push(res)
            }

            ctx.send({
                ...musicList.dataValues,
                music: musicListItem
            })
        }, ctx)

        return next()
    },

    getMusicLists: async (ctx, next) => {
        const { page = 1, pageSize = 7 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: musicLists } = await dbController.getMusicLists(parseInt(page), parseInt(pageSize))

            ctx.send({
                count,
                musicLists
            })
        }, ctx)

        return next()
    },

    updateMusicList: async (ctx, next) =>{
        const { id, title, description, author, tag, cover, list } = ctx.request.body

        await errorResolver(async () => {
            const musicList = await dbController.getMusicList(id) // 找到歌单

            await musicList.update({ title, description, author, tag, cover })

            const musicListItem = []
            for (let i in list) {
                const music = list[i]
                if (music.action === 'update') {
                    await dbController.updateMusic(music.id, music.title, music.singer, music.cover, music.playUrl)
                    musicListItem.push(music)
                } else if (music.action === 'add') {
                    const res = await musicList.createMusic(music)
                    musicListItem.push(res)
                } else {
                    musicListItem.push(music)
                }
            }

            ctx.send({
                ...musicList.dataValues,
                music: musicListItem
            })
        }, ctx)

        return next()
    },

    deleteMusicLists: async (ctx, next) => {
        const { lists } = ctx.request.body

        await errorResolver(async () => {
            const affectedCount = await dbController.deleteMusicLists(lists)
            ctx.send(affectedCount)
        }, ctx)

        return next()
    }
}

module.exports = controller
