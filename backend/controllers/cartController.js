import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      // Create an empty cart if one doesn't exist
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart w/ item
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity: quantity || 1 }],
      });
    } else {
      // Check if product exists in cart
      const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        cart.items[itemIndex].quantity += (quantity || 1);
      } else {
        // Product does not exist in cart, add new item
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }
    }

    const savedCart = await cart.save();
    const updatedCart = await savedCart.populate('items.product');

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is zero or less
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      
      const savedCart = await cart.save();
      const updatedCart = await savedCart.populate('items.product');
      res.status(200).json({ success: true, data: updatedCart });
    } else {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(p => p.product.toString() !== req.params.productId);
    
    const savedCart = await cart.save();
    const updatedCart = await savedCart.populate('items.product');

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
