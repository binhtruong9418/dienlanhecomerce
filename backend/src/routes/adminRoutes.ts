import express from 'express';
import {
  getDashboardStats,
  uploadFile,
  uploadMultipleFiles,
  getCompanyInfo,
  updateCompanyInfo,
} from '../controllers/adminController';
import { getTimeseries, getGa4Stats } from '../controllers/admin-stats-controller';
import { protect, authorize } from '../middleware/auth';
import { upload, uploadSingleToCloudinary, uploadMultipleToCloudinaryMiddleware } from '../middleware/upload';

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/stats/timeseries', getTimeseries);
router.get('/stats/ga4', getGa4Stats);

// Upload routes với middleware xử lý Cloudinary
router.post('/upload', 
  upload.single('file'), 
  uploadSingleToCloudinary,  // Middleware upload lên Cloudinary và gắn URL
  uploadFile                 // Controller chỉ cần lấy URL từ req
);

router.post('/upload-multiple', 
  upload.array('files', 10), 
  uploadMultipleToCloudinaryMiddleware,  // Middleware upload nhiều file
  uploadMultipleFiles
);

router.get('/company-info', getCompanyInfo);
router.put('/company-info', updateCompanyInfo);

export default router;