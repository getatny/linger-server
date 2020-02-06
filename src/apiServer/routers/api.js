const Router = require('koa-better-router')
const router = Router().loadMethods()
const userController = require('../controllers/user')

router.get('/user/:openid', userController.getUser)
router.post('/user', userController.createUser)

const api = Router({ prefix: '/rest' }).extend(router)

module.exports = api