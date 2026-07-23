import React from 'react';
import Badge from './Badge';

export default function Avatar({
  src,
  initials = 'U',
  size = 'md', // 'sm', 'md', 'lg'
  isOnline = false,
  className = ''
}) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt="Avatar"
          className={`${sizes[size]} rounded-full object-cover shadow-xs`}
        />
      ) : (
        <div 
          className={`${sizes[size]} rounded-full text-white font-extrabold flex items-center justify-center shadow-xs select-none`}
          style={{ backgroundImage: "url('/src/assets/image.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {initials}
        </div>
      )}

      {isOnline && (
        <Badge variant="online" className="absolute bottom-0 right-0" />
      )}
    </div>
  );
}
