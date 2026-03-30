import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '₹45,231.89', change: '+20.1%', icon: DollarSign, color: 'text-green-500' },
  { name: 'Active Orders', value: '356', change: '+12.5%', icon: Package, color: 'text-primary-500' },
  { name: 'Total Customers', value: '1,204', change: '+5.4%', icon: Users, color: 'text-indigo-500' },
  { name: 'Growth Rate', value: '24.5%', change: '+1.2%', icon: TrendingUp, color: 'text-purple-500' },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-12 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hoverEffect className="!p-6 relative overflow-hidden group border border-white/60">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/60 rounded-xl group-hover:bg-white/80 transition-colors shadow-sm">
                  <stat.icon size={24} className={stat.color} />
                </div>
                <span className={`text-sm font-bold bg-white/50 px-2 py-1 rounded-lg shadow-sm border border-white/80 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              
              <h3 className="text-gray-500 font-semibold mb-1">{stat.name}</h3>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
              
              {/* Decorative background circle */}
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.color.replace('text', 'bg').replace('500', '100')} opacity-20 group-hover:scale-150 transition-transform duration-500 blur-xl`} />
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 !p-6 border border-white/60 h-96 flex items-center justify-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">[ Revenue Chart Placeholder ]</p>
        </GlassCard>
        
        <GlassCard className="!p-6 border border-white/60">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package size={20} className="text-primary-500" /> Recent Orders
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-xl hover:bg-white/60 transition-colors cursor-pointer border border-white/50 shadow-sm">
                <div>
                  <p className="font-bold text-gray-800">Order #{1000 + i}</p>
                  <p className="text-xs font-semibold text-gray-500">2 mins ago</p>
                </div>
                <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-500">
                  ₹{(Math.random() * 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
