import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController.ts';
import { authenticate } from '../middleware/authMiddleware.ts';

const router = Router();

router.use(authenticate);
router.get('/', getAnalytics);

export default router;
