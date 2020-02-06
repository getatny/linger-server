const dbController = require('../models')
const { errorResolver } = require('./resolver')
const axios = require('axios')
const config = require('../config')

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
        const { code } = ctx.params

        await errorResolver(async () => {
            const { data: { openid } } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appid}&secret=${config.secret}&js_code=${code}&grant_type=authorization_code`)

            const user = await dbController.getUser(openid)

            ctx.send({
                user,
                openid
            })
        }, ctx)

        return next()
    }
}

module.exports = controller
