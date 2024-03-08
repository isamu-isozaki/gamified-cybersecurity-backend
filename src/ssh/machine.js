import { ulid } from 'ulidx';

export const onRequestSsh = async (
  socket,
  { ssh, reconnect, isConnected },
  labName
) => {
  const id = ulid();

  if (!isConnected()) {
    await reconnect();
  }

  ssh.shell(
    {},
    {
      env: {
        LANG: 'en_US.UTF-8',
      },
    },
    (err, stream) => {
      stream.setEncoding('utf8');
      if (err) {
        console.error(`[ssh] SSH creation failed: ${err.message}`);
        return socket.emit('sshFailed', err.message);
      }

      socket.emit('sshConnected', id);

      socket.on(`sshCommand:${id}`, async (command) => {
        stream.write(`${command}\n`);
      });

      socket.on(`sshDisconnect:${id}`, () => {
        ssh.end();
      });

      stream
        .on('data', (result) => {
          socket.emit(`sshOutput:${id}`, result.toString('binary'));
        })
        .on('close', () => {
          socket.emit(`sshDisconnect:${id}`, 'SSH connection closed');
        });
    }
  );
};
