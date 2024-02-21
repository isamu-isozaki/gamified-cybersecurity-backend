const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function dockerDown (req, res) {
  const result = await exec('cd /labs && docker compose down')
  res.success(result)
}

module.exports = { dockerDown }
