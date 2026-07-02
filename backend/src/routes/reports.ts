import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { generateReport, getReports, getReportById } from '../controllers/reportController';

const router = Router();

router.use(authenticate);
router.post('/', generateReport);
router.get('/', getReports);
router.get('/:id', getReportById);

export default router;
