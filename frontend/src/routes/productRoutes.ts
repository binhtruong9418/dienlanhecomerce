import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  updateProductStatus,
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);
router.get('/id/:id', getProductById);

// Admin routes
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.patch('/:id/status', protect, authorize('admin'), updateProductStatus);

export default router;