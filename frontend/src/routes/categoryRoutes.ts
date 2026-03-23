import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  updateCategoryOrder,
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);
router.patch('/:id/status', protect, authorize('admin'), updateCategoryStatus);
router.patch('/:id/order', protect, authorize('admin'), updateCategoryOrder);

export default router;