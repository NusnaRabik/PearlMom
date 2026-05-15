import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-[#ccfbf1] text-[#0f766e]'
  };
  return (
    <div ref={ref} className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant], className)} {...props} />
  );
});
Badge.displayName = 'Badge';
