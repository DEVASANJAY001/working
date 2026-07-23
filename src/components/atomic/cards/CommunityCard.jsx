import React from 'react';

export default function CommunityCard({ name = 'cjppartyy', visitors = 1, contributions = 1 }) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300">
      {/* Custom Banner with Speech Bubble Illustration SVG */}
      <div className="h-20 bg-gray-100 relative overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full object-cover opacity-60">
          <defs>
            <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          {/* Bubbles */}
          <rect x="20" y="15" width="90" height="45" rx="20" fill="url(#bubbleGrad)" />
          <path d="M100 60 L105 70 L90 60 Z" fill="url(#bubbleGrad)" />

          <rect x="130" y="25" width="80" height="40" rx="20" fill="url(#bubbleGrad)" />
          <path d="M140 65 L135 75 L150 65 Z" fill="url(#bubbleGrad)" />

          <circle cx="240" cy="35" r="22" fill="url(#bubbleGrad)" />
          <path d="M235 55 L228 65 L245 53 Z" fill="url(#bubbleGrad)" />

          <rect x="280" y="15" width="100" height="50" rx="25" fill="url(#bubbleGrad)" />
          <path d="M360 65 L368 75 L352 65 Z" fill="url(#bubbleGrad)" />
        </svg>
      </div>

      {/* Card Info Overlay */}
      <div className="px-4 pb-4 relative -mt-6">
        <div className="flex items-end gap-3">
          {/* Circular Megaphone Avatar */}
          <div className="w-14 h-14 rounded-full bg-cyan-50 border-4 border-white shadow flex items-center justify-center text-2xl flex-shrink-0">
            📢
          </div>
          <div className="pb-1 min-w-0">
            <h4 className="text-sm font-black text-gray-800 truncate">r/{name}</h4>
            <p className="text-[10px] text-gray-400 font-bold">
              {visitors} visitor{visitors !== 1 && 's'} and {contributions} contribution{contributions !== 1 && 's'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
