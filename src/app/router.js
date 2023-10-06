/**
 * Author: Isamu Isozaki
 */
const router = require('express').Router()

/**
 * Command
 */
const commandRouter = require('./command/router')
router.use('/command', commandRouter)

module.exports = router
