import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Produce', 'Bakery', 'Dairy', 'Pantry', 'Meat & Seafood'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    imageUrl: {
      type: String,
      default: '📦', // Defaulting to emoji for layout mocking, but should be a URL
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
