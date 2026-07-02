import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getAnalytics, getUserAnalytics } from '../controllers/analyticsController';

const router = Router();

router.get('/', authenticate, getUserAnalytics);
router.get('/admin', getAnalytics);

export default router;
