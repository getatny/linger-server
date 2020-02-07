const Router = require('koa-better-router')
const router = Router().loadMethods()
const adminController = require('../controllers/administrator')
const musicController = require('../controllers/music')
const musicListController = require('../controllers/musicList')

// =============================================================================================== administrators
router.post('/login', adminController.login)
router.get('/administrator/:id', adminController.getAdmin)
router.get('/administrators/:page/:pageSize', adminController.getAdmins)

// =============================================================================================== music
router.get('/musics/:page/:pageSize', musicController.getMusics)
router.post('/music', musicController.createMusic)
router.put('/music', musicController.updateMusic)

// =============================================================================================== musicList
router.get('/musicLists/:page/:pageSize', musicListController.getMusicList)
router.post('/musicLists', musicListController.createMusicList)

// =============================================================================================== article

const admin = Router({ prefix: '/rest/admin' }).extend(router)

module.exports = admin