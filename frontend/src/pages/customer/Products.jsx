import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '../../components/ui';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Produce', 'Bakery', 'Dairy', 'Pantry', 'Meat & Seafood'];
  
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const categoryQuery = filter === 'All' ? '' : `?category=${filter}`;
      const res = await api.get(`/products${categoryQuery}`);
      setProducts(res.data.data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Filters */}
      <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-6 p-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Fresh Finds</h1>
          <p className="text-gray-500 font-medium">Discover premium groceries curated for you.</p>
        </div>
        
        <div className="flex gap-2 bg-white/40 p-1.5 rounded-2xl backdrop-blur-md overflow-x-auto w-full md:w-auto no-scrollbar shadow-inner border border-white/60">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === cat 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/30' 
                  : 'text-gray-600 hover:bg-white/60 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map(product => (
              <motion.div key={product._id} variants={item}>
                <GlassCard hoverEffect={true} className="flex flex-col h-full !p-5 group cursor-pointer border border-white/60 overflow-hidden relative">
                  
                  {/* Floating Heart Button */}
                  <button className="absolute top-4 right-4 z-10 p-2 bg-white/70 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm translate-y-2 group-hover:translate-y-0 duration-300">
                    <Heart size={18} />
                  </button>

                  {/* Product Image Placeholder */}
                  <div className="h-44 bg-gradient-to-br from-primary-100 to-secondary-50 rounded-2xl flex items-center justify-center overflow-hidden mb-5 shadow-inner transition-transform duration-500 group-hover:scale-[1.03]">
                    {product.imageUrl.startsWith('http') || product.imageUrl.startsWith('data:image') ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-7xl">{product.imageUrl}</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">{product.category}</p>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-gray-700">4.9</span>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-gray-900">
                        <span className="text-sm font-bold text-gray-500">₹</span>{product.price.toFixed(2)}
                      </span>
                      <Button onClick={() => addToCart(product._id)} variant="primary" className="!px-4 !py-2 !rounded-xl shadow-md group-hover:shadow-lg transition-all flex items-center gap-2 pr-5">
                         <ShoppingCart size={18} /> Add
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 font-medium">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
