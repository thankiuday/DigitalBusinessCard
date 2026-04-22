import React from 'react';

const variants = {
  primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
  accent: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  neutral: 'bg-white/10 text-white/70 border border-white/10',
};

const Badge = ({ children, variant = 'neutral', dot = false, className = '' }) => (
  <span
    className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant]} ${className}
    `}
  >
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-green-400' : variant === 'primary' ? 'bg-primary-400' : 'bg-current'} animate-pulse`} />
    )}
    {children}
  </span>
);

export default Badge;
