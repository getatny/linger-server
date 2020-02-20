const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const cors = require('@koa/cors')
const json = require('koa-json')
const koajwt = require('koa-jwt')
const compress = require('koa-compress')
const responseHandler = require('./middleware/responseHandler')
const authErrorHandler = require('./middleware/authErrorHandler')

const config = require('./config.js')
const publicApi = require('./routers/api')
const adminApi = require('./routers/admin')

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(compress({
    filter: function (content_type) {
        return /javascript/i.test(content_type)
    },
    threshold: 2048
}))
app.use(serve('build'))
app.use(cors({
    origin: function(ctx) {
        let isWhiteList = null
        const whiteList = config.whiteList
        whiteList.forEach(item => ctx.request.header.origin.indexOf(item) > -1 ? isWhiteList = ctx.request.header.origin : null)
        return isWhiteList
    }
}))
app.use(json({ pretty: false, param: 'pretty' }))

app.use(responseHandler())
app.use(authErrorHandler)
app.use(koajwt({ secret: config.jwtSecret }).unless({ path: [/\/rest\/admin\/login/, /\/rest\/public/] }))
app.use(publicApi.middleware())
app.use(adminApi.middleware())

app.listen(config.port, '127.0.0.1', () => {
    console.info(`[Info] ${Date(Date.now()).toLocaleString()}: Linger service started on port: ${config.port}`)
})
