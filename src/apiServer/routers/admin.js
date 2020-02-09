const Router = require('koa-better-router')
const router = Router().loadMethods()
const adminController = require('../controllers/administrator')
const musicController = require('../controllers/music')
const musicListController = require('../controllers/musicList')
const articleController = require('../controllers/article')

// =============================================================================================== administrators
router.post('/login', adminController.login)
router.get('/administrator/:id', adminController.getAdmin)
router.get('/administrators/:page/:pageSize', adminController.getAdmins)

// =============================================================================================== music
router.get('/musics/:page/:pageSize', musicController.getMusics)
router.post('/music', musicController.createMusic)
router.put('/music', musicController.updateMusic)
router.post('/musics/delete', musicController.deleteMusics)

// =============================================================================================== musicList
router.get('/musicLists/:page/:pageSize', musicListController.getMusicLists)
router.post('/musicList', musicListController.createMusicList)
router.put('/musicList', musicListController.updateMusicList)
router.post('/musicLists/delete', musicListController.deleteMusicLists)

// =============================================================================================== article
router.get('/articles/:page/:pageSize', articleController.getArticles)
router.post('/article', articleController.createArticle)
router.put('/article', articleController.updateArticle)
router.post('/articles/delete', articleController.deleteArticles)

const admin = Router({ prefix: '/rest/admin' }).extend(router)

module.exports = admin
