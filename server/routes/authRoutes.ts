import { Router } from 'express';
import { register, login, getMe, updateProfile, updatePassword } from '../controllers/authController.ts';
import { authenticate } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, updatePassword);

export default router;
