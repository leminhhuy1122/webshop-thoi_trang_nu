import React from 'react';

export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-4'
  };

  return (
    <div className={`border-black/20 border-t-black rounded-full animate-spin ${sizeClasses[size]} ${className}`}></div>
  );
}
