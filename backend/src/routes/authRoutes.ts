import express from 'express';
import { login, getCurrentUser, logout, changePassword } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);

export default router;
