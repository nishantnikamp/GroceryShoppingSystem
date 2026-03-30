import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, UserCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative z-10 font-sans">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4">
        <div className="glass-effect rounded-2xl max-w-7xl mx-auto px-6 py-3 flex items-center justify-between transition-all duration-300">
          
          {/* Logo Area */}
          <Link to="/customer/dashboard" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-primary-600 to-secondary-500 p-2 rounded-xl text-white shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:-translate-y-1">
              <Package size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
              FreshDrop
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1 hidden md:block"></div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* User Display Area */}
            <div className="hidden md:flex items-center gap-3 bg-white/40 px-3 py-1.5 rounded-xl border border-white/50 shadow-inner">
               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-indigo-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase()}
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 leading-none">{user?.name}</span>
                  <span className="text-[10px] font-bold text-gray-500 leading-none uppercase tracking-tighter">{user?.role}</span>
               </div>
            </div>

            {/* Cart Icon */}
            <Link to="/customer/cart" className="relative p-2 rounded-full hover:bg-white/50 transition-colors">
              <ShoppingCart size={24} className={location.pathname === '/customer/cart' ? 'text-primary-600' : 'text-gray-700'} />
            </Link>

            {/* Profile Menu Placeholder */}
            <div className="h-8 w-[1px] bg-gray-300/50 mx-1"></div>
            
            <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/50 transition-colors">
              <UserCircle size={28} className="text-gray-700" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-white/50 rounded-full transition-all" title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default CustomerLayout;
