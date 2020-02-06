const user = require('./user')
const admin = require('./admin')
const music = require('./music')
const musicList = require('./musicList')

module.exports = {
    ...user,
    ...admin,
    ...music,
    ...musicList
}
