import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { matchResumeWithJob, getMatchHistory, getLearningRoadmap, getInterviewQuestions, getSalaryInsights } from '../controllers/matchController';

const router = Router();

router.use(authenticate);
router.post('/', matchResumeWithJob);
router.get('/history', getMatchHistory);
router.get('/roadmap', getLearningRoadmap);
router.get('/interview-questions', getInterviewQuestions);
router.get('/salary', getSalaryInsights);

export default router;
