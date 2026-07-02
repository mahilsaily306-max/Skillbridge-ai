import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { uploadResume, getResumes, getResumeById, deleteResume, analyzeResume } from '../controllers/resumeController';

const router = Router();

router.use(authenticate);
router.post('/upload', upload.single('file'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.get('/:id/analyze', analyzeResume);
router.delete('/:id', deleteResume);

export default router;
