import { Client } from 'ssh2';

export const createSshConnection = async (
  { host, username, password, port = 22 },
  onClose
) => {
  let ssh = new Client();

  return new Promise((res) => {
    ssh
      .on('ready', () => {
        res(ssh);
      })
      .on('error', (err) => {
        console.error(`[ssh] Connection error: ${err?.message || err}`);
        onClose();
      })
      .on('close', onClose)
      .connect({
        host,
        username,
        password,
        port,
      });
  });
};
