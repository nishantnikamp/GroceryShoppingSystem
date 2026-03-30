import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`glass-effect rounded-3xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform active:scale-95 shadow-sm";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 hover:shadow-primary-500/30 hover:shadow-lg focus:ring-2 focus:ring-primary-400 focus:outline-none",
    secondary: "bg-white/60 text-primary-700 border border-primary-200 hover:bg-white hover:shadow-md focus:ring-2 focus:ring-primary-200 outline-none backdrop-blur-sm",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-400 hover:to-rose-400 hover:shadow-red-500/30 hover:shadow-lg focus:ring-2 focus:ring-red-400 outline-none",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100/50 hover:text-primary-600 outline-none",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({ label, error, type = 'text', className = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`w-full bg-white/40 border ${error ? 'border-red-400 focus:ring-red-200' : 'border-white/50 focus:border-primary-300 focus:ring-primary-200/50'} focus:bg-white/70 rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all shadow-sm focus:shadow-md focus:ring-2 placeholder-gray-400 text-gray-800`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {error && (
          <span className="absolute -bottom-5 left-1 text-xs text-red-500 font-medium whitespace-nowrap">
            {error}
          </span>
        )}
      </div>
    </div>
  );
});
Input.displayName = 'Input';
