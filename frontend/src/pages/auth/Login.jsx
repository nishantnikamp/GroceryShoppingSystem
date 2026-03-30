import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Button, Input } from '../../components/ui';
import { PackageOpen, AlertCircle, ArrowRight, User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object().shape({
  name: yup.string().when('isRegistering', {
    is: true,
    then: (s) => s.required('Name is required'),
    otherwise: (s) => s.optional(),
  }),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['customer', 'admin']).default('customer'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    context: { isRegistering }
  });

  const onSubmit = async (data) => {
    try {
      let role;
      if (isRegistering) {
        role = await registerUser(data.name, data.email, data.password, selectedRole);
      } else {
        role = await login(data.email, data.password);
      }
      
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (error) {
      console.error('Auth error', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <GlassCard className="!p-8 shadow-floating">
          <div className="flex justify-center mb-6">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-gradient-to-tr from-primary-600 to-secondary-500 p-4 rounded-2xl shadow-lg"
            >
              {isRegistering ? <UserPlus size={40} className="text-white" /> : <PackageOpen size={40} className="text-white" />}
            </motion.div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 font-medium">
              {isRegistering ? 'Join the FreshDrop community' : 'Log in to your FreshDrop experience'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {isRegistering && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            {isRegistering && (
              <div className="pt-2">
                <label className="text-sm font-medium text-gray-700 ml-1 mb-2 block">Register as</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                      selectedRole === 'customer' 
                        ? 'bg-primary-100/80 text-primary-700 border-2 border-primary-400 shadow-sm' 
                        : 'bg-white/50 text-gray-500 border-2 border-transparent hover:bg-white/70'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                      selectedRole === 'admin' 
                        ? 'bg-secondary-100/80 text-secondary-700 border-2 border-secondary-400 shadow-sm' 
                        : 'bg-white/50 text-gray-500 border-2 border-transparent hover:bg-white/70'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2 mt-4 py-3 text-lg font-semibold">
              {isRegistering ? 'Sign Up' : 'Sign In'} {isRegistering ? <UserPlus size={20} /> : <ArrowRight size={20} />}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors group"
            >
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <span className="text-primary-600 font-bold group-hover:underline">
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </span>
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
