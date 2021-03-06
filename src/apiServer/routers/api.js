const Router = require('koa-better-router')
const router = Router().loadMethods()
const userController = require('../controllers/user')
const musicController = require('../controllers/music')
const musicListController = require('../controllers/musicList')
const articleController = require('../controllers/article')
const indexController = require('../controllers/index')

router.get('/user/:code', userController.getUser)
router.post('/user', userController.createUser)

router.get('/musics/:page/:pageSize', musicController.getMusics)
router.get('/musicLists/:page/:pageSize', musicListController.getMusicList)
router.get('/articles/:page/:pageSize', articleController.getPureArticlesList)
router.get('/article/:id', articleController.getArticle)

router.get('/index', indexController.getIndexData)
router.get('/index/:userId', indexController.getIndexData)

router.post('/user/:userId/music/:musicId', userController.addFavoriteMusic)
router.post('/user/:userId/music/:musicId/delete', userController.deleteFavoriteMusic)

const api = Router({ prefix: '/rest/public' }).extend(router)

module.exports = api
