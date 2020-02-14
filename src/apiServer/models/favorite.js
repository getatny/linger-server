const database = require('../../../db/models')
const favoriteMusic = database.favoriteMusic
// const favoriteMusicList = database.favoriteMusicList
// const favoriteArticle = database.favoriteArticle

const model = {
    getMusicFavorites() {
        return favoriteMusic.count({ group: ['musicId'] })
    }
}

module.exports = model
