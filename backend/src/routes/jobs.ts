import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createJob, uploadJob, getJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController';

const router = Router();

router.use(authenticate);
router.post('/', createJob);
router.post('/upload', upload.single('file'), uploadJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
