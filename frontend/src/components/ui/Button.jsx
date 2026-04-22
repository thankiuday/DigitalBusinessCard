import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-brand text-white shadow-glow hover:opacity-90',
  secondary: 'glass text-white hover:bg-white/10',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
  ghost: 'text-white/60 hover:text-white hover:bg-white/5',
  outline: 'border border-primary-500/50 text-primary-400 hover:bg-primary-500/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconRight,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        transition={{ duration: 0.15 }}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2 font-medium
          transition-all duration-200 cursor-pointer select-none
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variants[variant]} ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
