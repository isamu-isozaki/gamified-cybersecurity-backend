import util from 'util';
import { exec } from 'child_process';
import { success } from '../../responses.js';

const execute = util.promisify(exec);

export async function dockerUp (req, res) {
	const result = await execute('cd /labs && docker compose up -d');
	success(res, result);
}