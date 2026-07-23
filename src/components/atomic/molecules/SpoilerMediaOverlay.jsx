import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '../atoms';

export default function SpoilerMediaOverlay({ image, hasSpoiler }) {
  const [showSpoiler, setShowSpoiler] = useState(!hasSpoiler);

  if (!image) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#2D2825] my-2 min-h-[380px] max-h-[560px] flex items-center justify-center shadow-md">
      {!showSpoiler ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
          <img
            src={image}
            alt="Spoiler background"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40"
          />
          <div className="absolute inset-0 bg-black/40" />

          <Button
            onClick={() => setShowSpoiler(true)}
            className="relative z-10 bg-black/80 hover:bg-black text-white border border-white/20 shadow-2xl"
          >
            <Eye className="w-4 h-4" />
            View spoiler
          </Button>
        </div>
      ) : (
        <img
          src={image}
          alt="Post content"
          className="w-full max-h-[560px] object-contain transition-transform duration-300"
        />
      )}
    </div>
  );
}
