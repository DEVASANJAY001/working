import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'default', 'new', 'spoiler', 'count', 'online'
  className = ''
}) {
  const base = 'inline-flex items-center justify-center font-extrabold text-[9px] uppercase tracking-wider rounded';

  const variants = {
    default: 'bg-gray-100 text-gray-700 px-2 py-0.5',
    new: 'bg-red-500 text-white px-1.5 py-0.5 rounded',
    spoiler: 'text-gray-800 font-extrabold text-xs flex items-center gap-1',
    count: 'bg-red-600 text-white w-4 h-4 rounded-full border-2 border-white text-[9px]',
    online: 'w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
