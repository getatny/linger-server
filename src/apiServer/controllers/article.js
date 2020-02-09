const dbController = require('../models')
const { errorResolver } = require('./resolver')
const axios = require('axios')
const config = require('../config')

const controller = {
    createArticle: async (ctx, next) => {
        const { title, description, author, tag, cover, content } = ctx.request.body

        await errorResolver(async () => {
            const article = await dbController.createArticle(title, description, author, tag, cover, content)

            ctx.send(article)
        }, ctx)

        return next()
    },

    getArticles: async (ctx, next) => {
        const { page = 1, pageSize = 7 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: articles } = await dbController.getArticles(parseInt(page), parseInt(pageSize))

            ctx.send({
                count,
                articles
            })
        }, ctx)

        return next()
    },

    updateArticle: async (ctx, next) =>{
        const { id, title, description, author, tag, cover, content } = ctx.request.body

        await errorResolver(async () => {
            const article = await dbController.updateArticle(id, title, description, author, tag, cover, content)

            ctx.send(article)
        }, ctx)

        return next()
    },

    deleteArticles: async (ctx, next) => {
        const { lists } = ctx.request.body

        await errorResolver(async () => {
            const affectedCount = await dbController.deleteArticles(lists)
            
            ctx.send(affectedCount)
        }, ctx)

        return next()
    },

    getPureArticlesList: async (ctx, next) => {
        const { page = 1, pageSize = 15 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: articles } = await dbController.getPureArticlesList(parseInt(page), parseInt(pageSize))
            
            ctx.send({
                count,
                articles
            })
        }, ctx)

        return next()
    },

    getArticle: async (ctx, next) => {
        const { id } = ctx.params

        await errorResolver(async () => {
            const article = await dbController.getArticle(parseInt(id))
            
            ctx.send(article)
        }, ctx)

        return next()
    }
}

module.exports = controller
