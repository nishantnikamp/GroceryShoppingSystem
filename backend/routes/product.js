import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

const productValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('price', 'Price must be a valid number').isNumeric(),
  body('category', 'Category is required').not().isEmpty(),
  body('stock', 'Stock must be an integer').isInt(),
];

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Admin routes
router.post('/', protect, admin, productValidation, createProduct);
router.put('/:id', protect, admin, productValidation, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
