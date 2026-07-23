import React, { memo } from 'react';
import bgImage from '../../assets/image.png';

// Memoized Left Hero Banner: Background image container remains completely static; only inner text smoothly transitions
const LeftHeroBanner = memo(function LeftHeroBanner({
  title = "Inspire",
  subtitle = "Connect. Share. Inspire. Join, connect and stay updated with what matters to you."
}) {
  return (
    <div className="p-3 md:p-5 md:w-1/2 flex h-2/5 md:h-full flex-shrink-0">
      <div
        className="w-full text-white flex flex-col items-center justify-center p-4 md:p-8 text-center select-none relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Brand Flower / Clover Logo */}
        <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mb-3 md:mb-5 relative z-10">
          <div className="w-12 h-12 md:w-18 md:h-18 relative flex items-center justify-center">
            <div className="absolute top-0 w-5 h-5 md:w-8 md:h-8 bg-white rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl -rotate-45 shadow-sm" />
            <div className="absolute bottom-0 w-5 h-5 md:w-8 md:h-8 bg-white rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl rotate-[135deg] shadow-sm" />
            <div className="absolute left-0 w-5 h-5 md:w-8 md:h-8 bg-white rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl rotate-[225deg] shadow-sm" />
            <div className="absolute right-0 w-5 h-5 md:w-8 md:h-8 bg-white rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl rotate-45 shadow-sm" />
            <div className="absolute w-2.5 h-2.5 md:w-3.5 md:h-3.5 border-2 md:border-3 border-violet-600 rounded-full bg-white/10 backdrop-blur-[1px]" />
          </div>
        </div>

        {/* Inner Text Container: Smooth keyframe fade transition when title or subtitle updates */}
        <div key={title} className="relative z-10 flex flex-col items-center animate-slide-fade">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-wider drop-shadow-md">
            {title}
          </h1>
          <p className="text-gray-100 text-xs md:text-base mt-2 md:mt-3.5 tracking-wide max-w-sm leading-relaxed drop-shadow opacity-95">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
});

export default function AuthLayout({ children, heroTitle, heroSubtitle, screenKey }) {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white text-gray-900 animate-fade-in overflow-hidden">
      {/* Persistent Memoized Left Banner (Background image stays 100% static) */}
      <LeftHeroBanner title={heroTitle} subtitle={heroSubtitle} />

      {/* Dynamic Right Content Panel with smooth slide & fade animation */}
      <div className="flex-1 md:w-1/2 flex flex-col justify-between h-3/5 md:h-full py-4 md:py-8 lg:py-10 px-5 md:px-12 lg:px-20 overflow-y-auto no-scrollbar">
        <div key={screenKey || 'auth-screen'} className="w-full flex-1 flex flex-col justify-between animate-slide-fade">
          {children}
        </div>
      </div>
    </div>
  );
}
