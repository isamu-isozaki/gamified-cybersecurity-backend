require('module-alias/register')

require('env-smart').load()

const { APP_PORT } = require('@/config')
const { sshConnect } = require('@/ssh')
const socketManager = require('@/ssh/socketModule')
const cors = require('cors');
const http = require('http');

async function startApp () {
  startExpressApp()
  //sshConnect()
}

async function startExpressApp () {
  const express = require('express')
  const app = express()
  app.use(cors({
    origin: '*',
    credentials: true
    }));
  app.use(express.json());

  const cookieParser = require('cookie-parser')
  app.use(cookieParser())

  const responsesMiddleware = require('@/middlewares/responses');
  app.use(responsesMiddleware);

  const server = http.createServer(app);
  socketManager(server);

  const router = require('@/app/router')
  app.use('/v1', router)

  app.use((err, req, res, next) => {
    console.log(err)
    res.serverError()
  });

  /* app.use((req, res) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log({fullUrl})
    res.notFound()
  }) */

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

  server.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`)
  });
}

startApp()
