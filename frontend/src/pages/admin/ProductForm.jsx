import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { GlassCard, Button, Input } from '../../components/ui';
import { PackagePlus, Save, ArrowLeft, Image as ImageIcon, AlignLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  category: yup.string().required('Category is required'),
  price: yup.number().positive().required('Price is required').typeError('Price must be a number'),
  stock: yup.number().integer().min(0).required('Stock is required').typeError('Stock must be an integer'),
  description: yup.string().required('Description is required'),
  imageUrl: yup.string().required('Image URL/Emoji is required'),
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const previewUrl = watch('imageUrl');

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      reset(res.data.data);
    } catch (error) {
      toast.error('Failed to load product details');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File too large (max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('imageUrl', reader.result);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEditing) {
        await api.put(`/products/${id}`, data);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', data);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 w-full">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="p-2 bg-white/50 hover:bg-white text-gray-500 hover:text-primary-600 rounded-xl transition-all shadow-sm group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 duration-300 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500 font-medium">
            {isEditing ? 'Update the details for this item.' : 'Enter details to add a new item to your catalog.'}
          </p>
        </div>
      </div>

      <GlassCard className="!p-8 shadow-floating border border-white/60">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              placeholder="e.g. Organic Avocados"
              {...register('name')}
              error={errors.name?.message}
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">Category</label>
              <div className="relative">
                <select
                  {...register('category')}
                  className={`w-full bg-white/40 border ${errors.category ? 'border-red-400 focus:ring-red-200' : 'border-white/50 focus:border-primary-300 focus:ring-primary-200/50'} focus:bg-white/70 rounded-xl px-4 py-3 text-sm outline-none transition-all shadow-sm focus:shadow-md focus:ring-2 text-gray-800 appearance-none`}
                >
                  <option value="">Select a category</option>
                  <option value="Produce">Produce</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Meat & Seafood">Meat & Seafood</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
                {errors.category && (
                  <span className="absolute -bottom-5 left-1 text-xs text-red-500 font-medium">
                    {errors.category?.message}
                  </span>
                )}
              </div>
            </div>

            <Input
              label="Price (₹)"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('price')}
              error={errors.price?.message}
            />

            <Input
              label="Stock Quantity"
              type="number"
              placeholder="100"
              {...register('stock')}
              error={errors.stock?.message}
            />
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Description</label>
            <div className="relative">
              <textarea
                {...register('description')}
                className={`w-full bg-white/40 border ${errors.description ? 'border-red-400 focus:ring-red-200' : 'border-white/50 focus:border-primary-300 focus:ring-primary-200/50'} focus:bg-white/70 rounded-xl px-4 py-3 text-sm outline-none transition-all shadow-sm focus:shadow-md focus:ring-2 placeholder-gray-400 text-gray-800 min-h-[100px]`}
                placeholder="Describe the product..."
              ></textarea>
              {errors.description && (
                <span className="absolute -bottom-5 left-1 text-xs text-red-500 font-medium">
                  {errors.description?.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 ml-1">Product Image</label>
              
              <div className="flex flex-col gap-4">
                {/* Preview Area */}
                <div className="h-48 w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group relative">
                  {previewUrl ? (
                    previewUrl.startsWith('http') || previewUrl.startsWith('data:image') ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-7xl">{previewUrl}</span>
                    )
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No image selected</p>
                    </div>
                  )}
                  
                  {previewUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <label className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-colors shadow-lg" title="Change Image">
                          <ImageIcon size={20} className="text-primary-600" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                       </label>
                       <button 
                          type="button"
                          onClick={() => {
                            setValue('imageUrl', '');
                            toast.success('Image cleared');
                          }}
                          className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-500 transition-colors shadow-lg" title="Clear Image">
                          <AlignLeft size={20} />
                       </button>
                    </div>
                  )}

                  {!previewUrl && (
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 cursor-pointer">
                       <label className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                          <ImageIcon size={20} className="text-primary-600" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                       </label>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-gray-500 font-medium px-1 italic">
                  * Upload a file (max 2MB) or provide a reference below.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {!previewUrl?.startsWith('data:image') ? (
                <>
                  <Input
                    label="Image Reference (Emoji or URL)"
                    placeholder="e.g. 🍎 or https://..."
                    {...register('imageUrl')}
                    error={errors.imageUrl?.message}
                  />
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    You can manually paste an image URL or a specific emoji above.
                  </p>
                </>
              ) : (
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex flex-col gap-2">
                  <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Image Source</span>
                  <p className="text-sm text-gray-600 font-medium italic">Direct file upload active</p>
                  <p className="text-[10px] text-gray-400">Clear the image preview to switch back to URL or Emoji mode.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-white/40">
            <Link to="/admin/products">
              <Button type="button" variant="ghost" className="font-bold" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" className="flex items-center gap-2 group px-6" disabled={loading}>
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : (isEditing ? <Save size={18} /> : <PackagePlus size={18} />)}
              <span className="font-bold">{isEditing ? 'Save Changes' : 'Create Product'}</span>
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default ProductForm;
