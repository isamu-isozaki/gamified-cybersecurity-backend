import util from 'util';
import { exec } from 'child_process';
import { success } from '../../responses.js';

const execute = util.promisify(exec);

export async function dockerDown (req, res) {
	const result = await execute('cd /labs && docker compose down');
	success(res, result);
}
