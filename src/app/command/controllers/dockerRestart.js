const util = require('util')
const exec = util.promisify(require('child_process').exec)

const labspath = process.env.labspath || './labs'

async function dockerRestart (req, res) {
  const result = await exec(`cd ${labspath} && docker compose down && docker compose up -d`)
  res.success(result)
}

module.exports = { dockerRestart }
