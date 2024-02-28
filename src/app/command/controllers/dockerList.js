import Docker from 'dockerode';
import { success } from '../../responses.js';

const docker = new Docker();

export async function dockerList (req, res) {
	const containers = await docker.listContainers({
		all: true,
		filters: {
			label: ['heisenberg']
		}
	});

	success(res, containers);
}
