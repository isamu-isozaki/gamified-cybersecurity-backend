import { Router } from 'express';
import dockerRouter from './routes/docker.js';
import labsRouter from './routes/labs.js';

const router = Router();

router.use('/labs', labsRouter);
router.use('/docker', dockerRouter);

export default router;
