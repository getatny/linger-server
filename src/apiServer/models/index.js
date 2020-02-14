const user = require('./user')
const admin = require('./admin')
const music = require('./music')
const musicList = require('./musicList')
const article = require('./article')
const favorite = require('./favorite')

module.exports = {
    ...user,
    ...admin,
    ...music,
    ...musicList,
    ...article,
    ...favorite
}
