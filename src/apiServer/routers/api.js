const Router = require('koa-better-router')
const router = Router().loadMethods()
const userController = require('../controllers/user')
const musicController = require('../controllers/music')
const musicListController = require('../controllers/musicList')

router.get('/user/:code', userController.getUser)
router.post('/user', userController.createUser)

router.get('/musics/:page/:pageSize', musicController.getMusics)
router.get('/musicLists/:page/:pageSize', musicListController.getMusicList)

const api = Router({ prefix: '/rest/public' }).extend(router)

module.exports = api
