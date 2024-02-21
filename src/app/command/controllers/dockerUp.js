const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function dockerUp (req, res) {
  const result = await exec('cd /labs && docker compose up -d')
  res.success(result)
}

module.exports = { dockerUp }
