import util from 'util';
import { exec } from 'child_process';
import { LABS_DIR } from '../../../config/index.js';
import { success } from '../../responses.js';

const execute = util.promisify(exec);

export async function dockerRestart (req, res) {
	const result = await execute(`cd ${LABS_DIR} && docker compose down && docker compose up -d`);
	success(res, result);
}