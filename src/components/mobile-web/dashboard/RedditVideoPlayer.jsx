import React, { useState } from 'react';
import { RotateCcw, Settings, Maximize2, Volume2, VolumeX } from 'lucide-react';

export default function RedditVideoPlayer({ poster, subtitle, videoUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden group shadow-lg my-3 w-full flex flex-col items-center justify-center min-h-[380px] max-h-[560px]">
      {/* Meme Subtitle Header inside video frame */}
      <div className="absolute top-4 inset-x-4 z-20 text-center">
        <span className="bg-black/80 text-white font-black text-sm md:text-base px-4 py-2 rounded-xl border border-white/10 shadow-2xl inline-block max-w-md uppercase tracking-wide leading-tight">
          {subtitle || "How E block students be moving to reach AB1 at crisp 8am"}
        </span>
      </div>

      {/* Video / Poster Content */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden py-12">
        <img
          src={poster || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80"}
          alt="Video preview"
          className="max-h-[460px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-orange-600 transition-all cursor-pointer backdrop-blur-sm shadow-2xl"
          >
            {isPlaying ? (
              <span className="text-xl font-bold">❚❚</span>
            ) : (
              <span className="text-2xl font-bold ml-1">▶</span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Video Controls Overlay */}
      <div className="w-full bg-black/90 px-4 py-2.5 flex items-center justify-between text-white text-xs font-mono z-20 border-t border-white/10">
        <button className="text-gray-300 hover:text-white transition-colors cursor-pointer">
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-4 h-1.5 bg-gray-800 rounded-full overflow-hidden relative cursor-pointer">
          <div className="w-3/4 h-full bg-white rounded-full" />
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-gray-300">
          <span>0:06 / 0:06</span>
          <span className="px-1.5 py-0.5 border border-gray-600 rounded text-[10px] font-bold text-gray-200">CC</span>
          <button className="hover:text-white transition-colors cursor-pointer"><Settings className="w-4 h-4" /></button>
          <button className="hover:text-white transition-colors cursor-pointer"><Maximize2 className="w-4 h-4" /></button>
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors cursor-pointer">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
