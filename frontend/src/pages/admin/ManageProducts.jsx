import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard, Button } from '../../components/ui';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?search=${searchTerm}`);
      setProducts(res.data.data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             Inventory
          </h1>
          <p className="text-gray-500 font-medium">Manage your product catalog efficiently.</p>
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/40 border border-white/50 focus:bg-white/70 focus:border-primary-300 rounded-xl py-2 pl-10 pr-4 text-sm outline-none shadow-sm focus:shadow-md transition-all focus:ring-2 focus:ring-primary-200/50"
            />
          </div>
          <Link to="/admin/add-product">
            <Button variant="primary" className="flex items-center gap-2 h-full">
              <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
            </Button>
          </Link>
        </div>
      </div>

      <GlassCard className="!p-0 overflow-hidden border border-white/60">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-50/50 text-gray-600 text-sm tracking-wider uppercase border-b border-primary-100">
                  <th className="p-5 font-bold">Product Name</th>
                  <th className="p-5 font-bold">Category</th>
                  <th className="p-5 font-bold">Price</th>
                  <th className="p-5 font-bold">Stock</th>
                  <th className="p-5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <motion.tr 
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100/50 hover:bg-white/50 transition-colors group"
                  >
                    <td className="p-5 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          {product.imageUrl.startsWith('http') || product.imageUrl.startsWith('data:image') ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">{product.imageUrl}</span>
                          )}
                        </div>
                        {product.name}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-white/60 rounded-lg text-xs font-bold text-primary-600 shadow-sm border border-white">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-5 font-bold text-gray-700">₹{product.price.toFixed(2)}</td>
                    <td className="p-5">
                      <span className={`px-2 py-1 rounded-md text-sm font-bold ${product.stock > 50 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/admin/edit-product/${product._id}`} className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm">
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!loading && products.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-medium">
              No products found. Start by adding one.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default ManageProducts;
