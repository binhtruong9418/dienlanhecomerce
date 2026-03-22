import express from 'express';
import {
  submitQuoteRequest,
  getQuoteRequests,
  getQuoteRequestById,
  updateQuoteStatus,
  addQuoteNote,
  deleteQuoteRequest,
} from '../controllers/quoteController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Public route
router.post('/', upload.array('files', 5), submitQuoteRequest);

// Admin routes
router.get('/', protect, authorize('admin', 'staff'), getQuoteRequests);
router.get('/:id', protect, authorize('admin', 'staff'), getQuoteRequestById);
router.patch('/:id/status', protect, authorize('admin', 'staff'), updateQuoteStatus);
router.post('/:id/notes', protect, authorize('admin', 'staff'), addQuoteNote);
router.delete('/:id', protect, authorize('admin'), deleteQuoteRequest);

export default router;