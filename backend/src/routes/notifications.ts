import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getNotifications, markNotificationRead, markAllRead } from '../controllers/notificationController';

const router = Router();

router.use(authenticate);
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllRead);

export default router;
