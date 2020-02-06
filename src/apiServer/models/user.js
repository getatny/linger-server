const database = require('../../../db/models')
const user = database.user

const model = {
    createUser(nickname, avatar, gender, openid) {
        return user.create({ nickname, avatar, gender, openid })
    },
    getUser(openid) {
        return user.findOne({ where: { openid } })
    }
}

module.exports = model