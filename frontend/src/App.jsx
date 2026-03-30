import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Products from './pages/customer/Products';
import Cart from './pages/customer/Cart';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ProductForm from './pages/admin/ProductForm';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

const LoginRoute = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }
  return <Login />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        {/* Background Blobs for Global Anti-Gravity Aesthetic */}
        <div className="blob-1 blob-shape"></div>
        <div className="blob-2 blob-shape"></div>
        <div className="blob-3 blob-shape"></div>

        <div className="bg-gradient-app z-0 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginRoute />} />
            
            {/* Customer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<Navigate to="/customer/dashboard" replace />} />
                <Route path="dashboard" element={<Products />} />
                <Route path="cart" element={<Cart />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="add-product" element={<ProductForm />} />
                <Route path="edit-product/:id" element={<ProductForm />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
