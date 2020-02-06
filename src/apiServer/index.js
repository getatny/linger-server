const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const cors = require('@koa/cors')
const json = require('koa-json')
const koajwt = require('koa-jwt')
const responseHandler = require('./middleware/responseHandler')
const authErrorHandler = require('./middleware/authErrorHandler')

const config = require('./config.js')
const publicApi = require('./routers/api')

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(serve('dist'))
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
app.use(koajwt({ secret: config.jwtSecret }).unless({ path: [/\/rest\/login/] }))
app.use(publicApi.middleware())

app.listen(config.port, () => {
    console.info(`[Info] ${Date(Date.now()).toLocaleString()}: Linger service started on port: ${config.port}`)
})