import React from 'react';

export default function Button({
  children,
  variant = 'default', // 'default', 'black', 'outline', 'ghost', 'pill', 'ask'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none';

  const variants = {
    default: 'bg-gradient-to-r from-violet-600 to-orange-500 text-white hover:opacity-90 shadow-xs',
    black: 'bg-black text-white hover:bg-gray-800 rounded-full',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100 rounded-full',
    ghost: 'text-gray-700 hover:bg-gray-100 rounded-full',
    pill: 'bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full',
    ask: 'border border-orange-300 hover:bg-orange-50 text-orange-600 rounded-full font-extrabold',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1 h-7',
    md: 'text-xs px-3.5 py-1.5 h-8',
    lg: 'text-sm px-4 py-2 h-10',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
