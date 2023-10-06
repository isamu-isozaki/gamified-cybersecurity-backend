require('module-alias/register')

require('env-smart').load()

const { APP_PORT } = require('@/config')
const { sshConnect } = require('@/ssh')

async function startApp () {
  startExpressApp()
  sshConnect()
}

async function startExpressApp () {
  const express = require('express')
  const app = express()
  const { landingPageCors } = require('@/middlewares/cors')
  app.use(landingPageCors)

  const bodyParser = require('body-parser')
  app.use(bodyParser.json({
    limit: '50mb'
  }))

  const cookieParser = require('cookie-parser')
  app.use(cookieParser())

  const responsesMiddleware = require('@/middlewares/responses')
  app.use(responsesMiddleware)

  const router = require('@/app/router')
  app.use('/v1', router)

  app.use((err, req, res, next) => {
    console.log(err)
    res.serverError()
  })

  app.use((req, res) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log({fullUrl})
    res.notFound()
  })

  app.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`)
  })
}

startApp()
