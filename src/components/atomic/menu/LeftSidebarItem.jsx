import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function LeftSidebarItem({
  label,
  icon: Icon,
  imageIcon,
  active,
  onClick,
  starred: initialStarred = false,
  hasStarAction = false
}) {
  const [starred, setStarred] = useState(initialStarred);

  return (
    <div className="group/item flex items-center justify-between w-full rounded-2xl hover:bg-gray-50 transition-colors">
      <button
        onClick={onClick}
        className={`flex-1 flex items-center gap-3.5 px-4 py-2 text-sm font-bold transition-colors cursor-pointer text-left ${
          active ? 'bg-gray-100 text-gray-900 rounded-2xl' : 'text-gray-700'
        }`}
      >
        {Icon && <Icon className="w-5 h-5 text-gray-700 flex-shrink-0" />}
        {imageIcon && (
          <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            {imageIcon}
          </span>
        )}
        <span className="truncate">{label}</span>
      </button>

      {hasStarAction && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setStarred(!starred);
          }}
          className="p-2 opacity-0 group-hover/item:opacity-100 hover:text-orange-500 transition-all cursor-pointer text-gray-400"
        >
          <Star className={`w-3.5 h-3.5 ${starred ? 'fill-orange-500 text-orange-500' : ''}`} />
        </button>
      )}
    </div>
  );
}
