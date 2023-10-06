
const SSH = require('simple-ssh')

const { SSH_HOST, SSH_PORT, SSH_USER, SSH_PASS } = require('@/config')
let ssh = null

async function sshConnect () {
  console.log('[ssh] Connecting to ssh...')
  ssh = new SSH({ host: SSH_HOST, user: SSH_USER, pass: SSH_PASS, port: SSH_PORT })
  console.log('[ssh] Connection established')
}

async function doCommand (command) {
  return new Promise((resolve, reject) => {
    ssh.exec('echo $PATH', {
      out: function (stdout) {
        console.log("Resolving")
        resolve(stdout)
      }
    }).start()
  })
}

module.exports = { sshConnect, doCommand }
