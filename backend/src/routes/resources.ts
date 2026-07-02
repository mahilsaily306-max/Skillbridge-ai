import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getLearningResources, getLearningResourceBySkill, getCertificates, getInterviewQuestions } from '../controllers/resourceController';

const router = Router();

router.use(authenticate);
router.get('/learning', getLearningResources);
router.get('/learning/:skill', getLearningResourceBySkill);
router.get('/certificates', getCertificates);
router.get('/interview-questions', getInterviewQuestions);

export default router;
