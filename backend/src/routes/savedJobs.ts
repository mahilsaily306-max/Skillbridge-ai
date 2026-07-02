import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { saveJob, getSavedJobs, updateSavedJob, deleteSavedJob } from '../controllers/savedJobController';

const router = Router();

router.use(authenticate);
router.post('/', saveJob);
router.get('/', getSavedJobs);
router.put('/:id', updateSavedJob);
router.delete('/:id', deleteSavedJob);

export default router;
