import { Router } from 'express';
import commandRouter from './command/router.js';
import labsRouter from './routes/labs.js';

const router = Router();


/**
 * Command
 */
router.use('/command', commandRouter);
router.use('/labs', labsRouter);

export default router;
