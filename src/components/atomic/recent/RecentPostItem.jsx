import React from 'react';

export default function RecentPostItem({ item, onClick }) {
  if (!item) return null;

  return (
    <div
      onClick={onClick}
      className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1 flex gap-2 justify-between"
    >
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold">
            {item.communityIcon || '🏎️'}
          </span>
          <span className="font-bold text-gray-800 truncate">{item.community}</span>
          <span className="text-gray-300 flex-shrink-0">•</span>
          <span className="flex-shrink-0">{item.time}</span>
        </div>
        <p className="text-xs font-bold text-gray-900 leading-snug hover:text-orange-600 transition-colors line-clamp-2">
          {item.title}
        </p>
        <p className="text-[10px] text-gray-400 font-medium">
          {item.upvotes} {item.comments ? `• ${item.comments}` : ''}
        </p>
      </div>

      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt="Thumbnail"
          className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0 shadow-xs"
        />
      )}
    </div>
  );
}
