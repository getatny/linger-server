const dbController = require('../models')
const { errorResolver } = require('./resolver')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

const controller = {
    login: async (ctx, next) => {
        const { username, password, remember } = ctx.request.body

        await errorResolver(async () => {
            const user = await dbController.findAdminByUsername(username)

            if (user) {
                const authPass = await bcrypt.compare(password, user.password)

                if (authPass) {
                    ctx.send({
                        user,
                        token: jwt.sign({
                            id: user.id,
                            username: user.username
                        }, config.jwtSecret, { expiresIn: remember ? '7d' : '1d' })
                    })
                } else {
                    ctx.sendError('User password is wrong.')
                }
            } else {
                ctx.sendError("User doesn't exist.")
            }
        }, ctx)

        return next()
    },

    getAdmins: async (ctx, next) => {
        const { page = 1, pageSize = 20 } = ctx.params

        await errorResolver(async () => {
            const { count, rows: users } = await dbController.getAdmins(parseInt(page), parseInt(pageSize))

            ctx.send({
                data: users,
                count
            })
        }, ctx)

        return next()
    },
    
    getAdmin: async (ctx, next) => {
        const userId = ctx.params.id

        await errorResolver(async () => {
            const user = await dbController.findAdminById(parseInt(userId))
            ctx.send(user)
        }, ctx)

        return next()
    },
}
