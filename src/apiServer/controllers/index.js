const dbController = require('../models')
const { errorResolver } = require('./resolver')

const controller = {
    getIndexData: async (ctx, next) => {
        const { userId = null } = ctx.params

        await errorResolver(async () => {
            const { musicCount, rows: musics } = userId ?  await dbController.getMusicsWithFavorite(1, 5, userId) : await dbController.getMusics(1, 5)
            const { musicListCount, rows: musicLists } = await dbController.getMusicLists(1, 5)
            const musicFavorites = await dbController.getMusicFavorites()

            ctx.send({
                musicCount,
                musics,
                musicListCount,
                musicLists,
                musicFavorites
            })
        }, ctx)

        return next()
    }
}

module.exports = controller
