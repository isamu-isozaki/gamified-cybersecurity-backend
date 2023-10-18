/**
 * Author: Isamu Isozaki
 */
/**
 *
 * @param {object} req request
 * @param {object} res response
 * Respond with created group
 */
const { doCommand } = require('@/ssh')
const sanitize = require('mongo-sanitize')

async function postCommand (req, res) {
  sanitize(req.body)
  const { command } = req.body
  const terminalOutput = await doCommand(command)
  res.success({ terminalOutput })
}

module.exports = { postCommand }
