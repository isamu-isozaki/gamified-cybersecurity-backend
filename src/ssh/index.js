
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
    ssh.exec(command, {
      out: function (stdout) {
        resolve(stdout)
      },
      err: function (stderr) {
        resolve(stderr) // this-does-not-exist: command not found
      },
      exit: function () {
        resolve('Command exited')
      }
    }).start()
  })
}

module.exports = { sshConnect, doCommand }
