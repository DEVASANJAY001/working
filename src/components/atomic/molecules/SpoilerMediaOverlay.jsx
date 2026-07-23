import React, { useState } from 'react';
import { Eye, ShieldAlert, EyeOff } from 'lucide-react';

export default function SpoilerMediaOverlay({ image, hasSpoiler }) {
  const [showSpoiler, setShowSpoiler] = useState(!hasSpoiler);

  if (!image) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-950 my-2 min-h-[380px] max-h-[560px] flex items-center justify-center shadow-lg group">
      {!showSpoiler ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center min-h-[380px] select-none">
          {/* Heavy Blurred Background Image */}
          <img
            src={image}
            alt="Spoiler background"
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-110 transition-all duration-700"
          />
          
          {/* Frosted Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 backdrop-blur-md" />

          {/* Spoiler Content Badge & Instructions */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-red-300 font-extrabold text-[11px] uppercase tracking-widest backdrop-blur-sm shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Spoiler Content</span>
            </div>

            <p className="text-xs text-gray-300 font-medium max-w-xs leading-relaxed">
              This post contains sensitive or unreleased media.
            </p>

            {/* Premium Glassmorphism Button */}
            <button
              onClick={() => setShowSpoiler(true)}
              className="mt-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-6 py-3 rounded-full border border-white/30 hover:border-white/60 shadow-2xl backdrop-blur-md transition-all duration-300 flex items-center gap-2.5 hover:scale-105 active:scale-95 cursor-pointer group/btn"
            >
              <Eye className="w-4 h-4 text-orange-400 group-hover/btn:scale-110 transition-transform" />
              <span>View Spoiler</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center group/revealed">
          <img
            src={image}
            alt="Post content"
            className="w-full max-h-[560px] object-contain transition-transform duration-300 animate-fade-in"
          />
          
          {/* Hide Spoiler floating button when revealed */}
          <button
            onClick={() => setShowSpoiler(false)}
            title="Hide spoiler"
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-all opacity-0 group-hover/revealed:opacity-100 flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <EyeOff className="w-3.5 h-3.5 text-gray-300" />
            <span>Hide</span>
          </button>
        </div>
      )}
    </div>
  );
}
