const dbController = require('../models')
const { errorResolver } = require('./resolver')
const axios = require('axios')
const config = require('../config')

const controller = {
    createMusic: async (ctx, next) => {
        const { title, singer, cover, playUrl } = ctx.request.body

        await errorResolver(async () => {
            const music = await dbController.createMusic(title, singer, cover, playUrl)

            ctx.send(music)
        }, ctx)

        return next()
    },

    getMusics: async (ctx, next) => {
        const { page = 1, pageSize = 5 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: musics } = await dbController.getMusics(parseInt(page), parseInt(pageSize))

            ctx.send({
                count,
                musics
            })
        }, ctx)

        return next()
    },

    updateMusic: async (ctx, next) =>{
        const { id, title, singer, cover, playUrl } = ctx.request.body

        await errorResolver(async () => {
            const music = await dbController.updateMusic(id, title, singer, cover, playUrl)

            ctx.send(music)
        }, ctx)

        return next()
    }
}

module.exports = controller
