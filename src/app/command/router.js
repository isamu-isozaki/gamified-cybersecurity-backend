/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()
/**
  * Post
  */
const { postCommand } = require('./controllers/postCommand')
const { dockerUp } = require('./controllers/dockerUp')
const { dockerDown } = require('./controllers/dockerDown')
const { dockerRestart } = require('./controllers/dockerRestart')
const { dockerList } = require('./controllers/dockerList')

router.post('/', postCommand)
router.post('/dockerup', dockerUp)
router.post('/dockerdown', dockerDown)
router.post('/dockerrestart', dockerRestart)
router.get('/dockerlist', dockerList)

module.exports = router
