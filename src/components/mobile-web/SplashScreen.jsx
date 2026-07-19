import React, { useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between py-12 px-6 h-full bg-gradient-to-br from-violet-600 via-pink-500 to-orange-500 text-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Flower / Clover Logo */}
        <div className="w-24 h-24 flex items-center justify-center mb-5 relative">
          <div className="w-16 h-16 relative flex items-center justify-center">
            <div className="absolute top-0 w-7 h-7 bg-white rounded-tl-2xl rounded-br-2xl -rotate-45" />
            <div className="absolute bottom-0 w-7 h-7 bg-white rounded-tl-2xl rounded-br-2xl rotate-[135deg]" />
            <div className="absolute left-0 w-7 h-7 bg-white rounded-tl-2xl rounded-br-2xl rotate-[225deg]" />
            <div className="absolute right-0 w-7 h-7 bg-white rounded-tl-2xl rounded-br-2xl rotate-45" />
            <div className="absolute w-3 h-3 border-2 border-violet-600 rounded-full" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-wider">Inspire</h1>
        <p className="text-gray-100 text-sm mt-2 tracking-wide">Connect. Share. Inspire.</p>
        
        <div className="mt-10">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      
      <span className="text-xs text-gray-200 opacity-85">Powered by DAWNS</span>
    </div>
  );
}
