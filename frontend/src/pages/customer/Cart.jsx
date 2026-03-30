import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '../../components/ui';
import { Trash, Plus, Minus, CreditCard, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCartItems(res.data.data.items || []);
    } catch (error) {
      toast.error('Failed to load cart');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await api.put('/cart/update', { productId, quantity: newQuantity });
      setCartItems(res.data.data.items);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      setCartItems(res.data.data.items);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          {cartItems.length} Items
        </span>
      </div>

      {cartItems.length === 0 ? (
        <GlassCard className="text-center py-16">
          <p className="text-gray-500 font-medium text-lg">Your cart is empty.</p>
          <Button variant="primary" className="mt-6" onClick={() => window.location.href = '/customer/dashboard'}>
            Go Shopping
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {cartItems.map((item) => (
                <GlassCard key={item.product?._id} className="flex items-center gap-4 !p-4 hover:shadow-md transition-shadow relative overflow-hidden group border border-white/60">
                  
                  {/* Image Placeholder */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-indigo-50 rounded-xl flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {item.product?.imageUrl?.startsWith('http') || item.product?.imageUrl?.startsWith('data:image') ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">{item.product?.imageUrl}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{item.product?.name}</h3>
                    <p className="text-primary-600 font-extrabold mt-1">₹{item.product?.price?.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                      className="text-gray-500 hover:text-primary-600 p-1 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                      className="text-gray-500 hover:text-primary-600 p-1 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeItem(item.product?._id)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash size={20} />
                  </button>
                </GlassCard>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <GlassCard className="!p-6 sticky top-28 border border-white/50">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-gray-900 font-bold">₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-gray-200/50 my-2"></div>
                
                <div className="flex justify-between text-lg items-end">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 text-2xl">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button variant="primary" className="w-full mt-8 py-4 text-lg font-bold flex items-center justify-center gap-2 group shadow-primary-500/25">
                 Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                <CreditCard size={14} /> Secure Checkout
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
