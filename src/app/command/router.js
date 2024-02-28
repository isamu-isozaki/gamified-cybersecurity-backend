import { Router } from 'express';

import { postCommand } from './controllers/postCommand.js';
import { dockerUp } from './controllers/dockerUp.js';
import { dockerDown } from './controllers/dockerDown.js';
import { dockerRestart } from './controllers/dockerRestart.js';
import { dockerList } from './controllers/dockerList.js';

const router = Router();

router.post('/', postCommand);
router.post('/dockerup', dockerUp);
router.post('/dockerdown', dockerDown);
router.post('/dockerrestart', dockerRestart);
router.get('/dockerlist', dockerList);

export default router;
