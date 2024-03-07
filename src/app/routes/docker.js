import { Router } from 'express';
import Dockerode from 'dockerode';
import { badRequest, notFound, success } from '../responses.js';

const docker = new Dockerode();

const getContainerResponse = async (id) => {
	const containerInfo = await docker.getContainer(id).inspect();
	return {
		id: containerInfo.Id,
		name: containerInfo.Config.Image,
		state: containerInfo.State.Status
	};
};

const getRelatedContainers = async (props = {}) => {
	const containers = await docker.listContainers({
		all: true,
		filters: {
			label: ['heisenberg']
		},
		...props,
	});

	return containers.map(({ Image, State, Id }) => ({
		id: Id,
		name: Image,
		state: State
	}));
};

const listContainers = async (req, res) => {
	success(res, await getRelatedContainers());
};

const containerStart = async (req, res) => {
	const id = req.params.id;
	const foundContainer = docker.getContainer(id);

	try {
		await getContainerResponse(id);
	}catch {
		return notFound(res, 'Machine not found');
	}

	try {
		await foundContainer.start();
	}catch(e) {
		console.error(e);
	}

	success(res, {
		message: 'Machine started',
		data: await getContainerResponse(id),
	});
};

const containerStop = async (req, res) => {
	const id = req.params.id;
	const foundContainer = docker.getContainer(id);

	try {
		await getContainerResponse(id);
	}catch(e) {
		console.error(e);
		return notFound(res, 'Machine not found');
	}

	try {
		await foundContainer.stop();
	}catch(e) {
		console.error(e);
	}

	success(res, {
		message: 'Machine stopped',
		data: await getContainerResponse(id),
	});
};

const containerRestart = async (req, res) => {
	const id = req.params.id;
	const foundContainer = docker.getContainer(id);

	try {
		await getContainerResponse(id);
	}catch {
		return notFound(res, 'Machine not found');
	}

	try {
		await foundContainer.restart();
	}catch(e) {
		console.error(e);
	}

	success(res, {
		message: 'Machine restarted',
		data: await getContainerResponse(id),
	});
};

const restartContainers = async (req, res) => {
	const ids = req.body.ids;

	console.log(ids);

	if(!Array.isArray(ids) || ids.length <= 0) {
		return badRequest(res, 'No containers to restart');
	}

	const containers = await docker.listContainers({
		ids
	});

	const promises = [];

	for(const container of containers) {
		promises.push(new Promise((res, rej) => {
			docker.getContainer(container.Id).restart().then(res).catch((e) => rej(`Failed to restart ${container.Id}: ${e}`));
		}));
	}

	const results = await Promise.allSettled(promises);

	const numRestarted = results.reduce((acc, result) => {
		if(result.status === 'rejected') {
			console.error(result.reason);
			return acc;
		}

		return acc + 1;
	}, 0);

	success(res, {
		message: `${numRestarted} machine${numRestarted === 1 ? '' : 's'} restarted`,
		data: await getRelatedContainers({
			ids
		}),
	});
};

const router = Router();

router.get('/', listContainers);
router.post('/restart', restartContainers);
router.post('/:id/start', containerStart);
router.post('/:id/stop', containerStop);
router.post('/:id/restart', containerRestart);

export default router;