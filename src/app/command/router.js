/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()
/**
  * Post
  */
const { postCommand } = require('./controllers/postCommand')
router.post('/', postCommand)

module.exports = router
