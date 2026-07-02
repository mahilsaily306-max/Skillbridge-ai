import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getProgress, updateProgress } from '../controllers/progressController';

const router = Router();

router.use(authenticate);
router.get('/', getProgress);
router.put('/', updateProgress);

export default router;
