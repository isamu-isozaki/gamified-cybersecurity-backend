const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function dockerRestart (req, res) {
    const result = await exec('cd /labs && docker compose down && docker compose up -d');
    res.success(result);
  }
  
  module.exports = { dockerRestart }