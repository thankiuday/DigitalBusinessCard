import React from 'react';

const Input = React.forwardRef(
  (
    {
      label,
      error,
      hint,
      icon,
      iconRight,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-white/80">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              input-base
              ${icon ? 'pl-10' : ''}
              ${iconRight ? 'pr-10' : ''}
              ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}
              ${className}
            `}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef(
  ({ label, error, hint, className = '', containerClassName = '', rows = 3, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && <label className="text-sm font-medium text-white/80">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            input-base resize-none
            ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export default Input;
