import express from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const cartItemValidation = [
  body('productId', 'Product ID is required').not().isEmpty(),
  body('quantity', 'Quantity must be a positive integer').optional().isInt({ min: 1 }),
];

const cartUpdateValidation = [
  body('productId', 'Product ID is required').not().isEmpty(),
  body('quantity', 'Quantity must be an integer').isInt(),
];

// All route operations require user to be authenticated
router.route('/')
  .get(protect, getCart);

router.post('/add', protect, cartItemValidation, addToCart);
router.put('/update', protect, cartUpdateValidation, updateCartItem);
router.delete('/remove/:productId', protect, removeCartItem);

export default router;
