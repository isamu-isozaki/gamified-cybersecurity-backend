import ssh2 from 'ssh2';

import { SSH_HOST, SSH_PORT, SSH_USER, SSH_PASS } from '../config/index.js';
let ssh = new ssh2.Client();
let isSshConnected = false;

export async function sshConnect () {
	return new Promise((res) => {
		console.log('[ssh] Connecting to ssh...');
		ssh.on('ready', () => {
			console.log('[ssh] Connection established');
			isSshConnected = true;
			res();
		}).on('error', (err) => {
			console.error(`[ssh] Connection error: ${err?.message || err}`);
			isSshConnected = false;
		}).on('close', () => {
			console.log('[ssh] Connection closed');
			isSshConnected = false;
		}).connect({ host: SSH_HOST, username: SSH_USER, password: SSH_PASS, port: SSH_PORT });
	});
}

export { ssh as sshConnection, isSshConnected };