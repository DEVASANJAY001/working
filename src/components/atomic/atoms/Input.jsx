import React from 'react';

export default function Input({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 font-normal ${className}`}
      {...props}
    />
  );
}
