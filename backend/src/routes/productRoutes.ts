import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  searchProducts,
  getProductFilters,
} from '../controllers/productController';
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from '../controllers/product-admin-handlers';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes — specific paths before /:slug wildcard
router.get('/filters', getProductFilters);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/id/:id', getProductById);
router.get('/', getProducts);
router.get('/:id/related', getRelatedProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.patch('/:id/status', protect, authorize('admin'), updateProductStatus);

export default router;