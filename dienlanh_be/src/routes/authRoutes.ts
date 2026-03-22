import express from 'express';
import { login, getCurrentUser, logout } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

export default router;