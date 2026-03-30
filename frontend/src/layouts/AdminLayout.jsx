import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackageSearch, 
  PlusCircle, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Products', href: '/admin/products', icon: PackageSearch },
    { name: 'Add Product', href: '/admin/add-product', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen relative z-10 flex font-sans">
      
      {/* Mobile Menu Button */}
      <div className="absolute top-4 left-4 z-50 lg:hidden">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="glass-effect p-2 rounded-xl text-primary-600 hover:text-primary-800 transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Floating Sidebar (Glassmorphism) */}
      <AnimatePresence>
        {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside 
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            className={`fixed lg:sticky top-6 left-6 h-[calc(100vh-48px)] w-64 glass-effect rounded-3xl p-6 flex flex-col justify-between shadow-floating z-40`}
          >
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-10 mt-2 px-2">
                <div className="bg-gradient-to-tr from-primary-600 to-primary-400 p-2 rounded-xl text-white shadow-lg">
                  <LayoutDashboard size={24} />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                  AdminDrop
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                        ${isActive 
                           ? 'bg-gradient-to-r from-primary-100/80 to-primary-50/50 text-primary-700 shadow-sm border border-primary-200/50' 
                           : 'text-gray-600 hover:bg-white/50 hover:text-primary-600'
                        }`}
                    >
                      <item.icon size={20} className={`${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'} transition-colors`} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 border-t border-gray-200/50 pt-4">
              <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-primary-50/50 rounded-xl border border-primary-100">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-gray-800 truncate">{user?.name}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Admin</span>
                </div>
              </div>

              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-white/50 hover:text-primary-600 transition-all">
                <Settings size={20} className="text-gray-400" />
                <span className="font-medium">Settings</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 hover:shadow-sm transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 px-8 py-10 lg:pl-12 lg:pr-10 w-full overflow-y-auto">
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.1 }}
           className="max-w-6xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>

    </div>
  );
};

export default AdminLayout;
