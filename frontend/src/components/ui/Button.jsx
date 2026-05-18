import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  const variants = {
    primary: 'bg-[#0f766e] text-white hover:bg-[#115e59]',
    secondary: 'bg-[#e0f2fe] text-[#0369a1] hover:bg-[#bae6fd]',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };
  return (
    <button
      ref={ref}
      className={cn('inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';