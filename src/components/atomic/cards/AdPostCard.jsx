import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function AdPostCard({ ad }) {
  if (!ad) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all mb-4 p-4 md:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black border border-emerald-200">
            Ad
          </div>
          <span className="font-extrabold text-gray-900">
            {ad.sponsor || 'sponsor'}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-400 font-bold">Promoted</span>
        </div>

        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <h3 className="text-sm md:text-base font-bold text-gray-900 leading-relaxed mb-3">
        {ad.title}
      </h3>

      {ad.image && (
        <div className="rounded-xl overflow-hidden max-h-[420px] flex items-center justify-center border border-gray-100">
          <img src={ad.image} alt="Sponsored content" className="w-full object-cover" />
        </div>
      )}
    </div>
  );
}
