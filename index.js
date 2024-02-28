import { APP_PORT } from './src/config/index.js';
import socketManager from './src/ssh/socketModule.js';
import cors from 'cors';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import router from './src/app/router.js';
import { internalServerError } from './src/app/responses.js';

const startExpress = async () => {
	const app = express();
	app.use(cors({
		origin: '*',
		credentials: true
	}));

	app.use(express.json());

	app.use(cookieParser());

	const server = http.createServer(app);
	socketManager(server);

	app.use('/v1', router);

	// eslint-disable-next-line no-unused-vars
	app.use((err, req, res, next) => {
		internalServerError(res, err);
	});

	server.listen(APP_PORT, () => {
		console.log(`Server listening on port ${APP_PORT}`);
	});
};

const start = async () => {
	startExpress();
	//sshConnect()
};

start();
