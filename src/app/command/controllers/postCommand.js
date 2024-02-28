import { doCommand } from '../../../ssh/index.js';
import { success } from '../../responses.js';

export async function postCommand (req, res) {
	const { command } = req.body;
	const terminalOutput = await doCommand(command);
	success(res, { terminalOutput });
}