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
  console.log({command})
  const terminalOutput = await doCommand(command)
  console.log({terminalOutput})
  res.success({ terminalOutput })
}

module.exports = { postCommand }
