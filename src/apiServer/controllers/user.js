const dbController = require('../models')
const { errorResolver } = require('./resolver')

const controller = {
    createUser: async (ctx, next) => {
        const { nickname, avatar, gender, openid } = ctx.request.body

        await errorResolver(async () => {
            const user = await dbController.createUser(nickname, avatar, gender, openid)

            ctx.send(user)
        }, ctx)

        return next()
    },

    getUser: async (ctx, next) => {
        const { openid } = ctx.params

        await errorResolver(async () => {
            const user = await dbController.getUser(openid)

            ctx.send(user)
        }, ctx)

        return next()
    }
}

module.exports = controller