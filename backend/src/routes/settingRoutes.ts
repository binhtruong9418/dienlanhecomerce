import express from 'express';
import { getCompanyInfo } from '../controllers/adminController';

const router = express.Router();

router.get('/', getCompanyInfo);

export default router;
