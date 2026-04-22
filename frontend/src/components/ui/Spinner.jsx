import React from 'react';

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };

const Spinner = ({ size = 'md', className = '' }) => (
  <div
    className={`
      ${sizes[size]} border-2 border-white/20 border-t-primary-500
      rounded-full animate-spin ${className}
    `}
  />
);

export const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-base">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="xl" />
      <p className="text-white/40 text-sm">Loading...</p>
    </div>
  </div>
);

export default Spinner;
