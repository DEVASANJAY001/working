import React from 'react';

export default function ActionPill({ icon: Icon, label, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 h-8 px-3.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label && <span>{label}</span>}
    </button>
  );
}
