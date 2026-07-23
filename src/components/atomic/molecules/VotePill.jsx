import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function VotePill({ likes, isLiked, isDisliked, onLike, onDislike }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full h-8 px-2 text-xs font-bold select-none">
      <button
        onClick={onLike}
        className={`p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${isLiked ? 'text-orange-600' : 'text-gray-500'}`}
      >
        <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
      </button>
      <span className={`px-2 ${isLiked ? 'text-orange-600' : isDisliked ? 'text-blue-600' : 'text-gray-800'}`}>
        {likes}
      </span>
      <button
        onClick={onDislike}
        className={`p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${isDisliked ? 'text-blue-600' : 'text-gray-500'}`}
      >
        <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
