import React from 'react';
import communityImage from '../../assets/get_started_community.png';
import bgImage from '../../assets/image.png';

export default function GetStartedScreen({ onLogin, onRegister }) {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white text-gray-900 animate-fade-in overflow-hidden">
      {/* Left side: Banner on Desktop / Top side on Mobile */}
      <div className="p-3 md:p-5 md:w-1/2 flex h-2/5 md:h-full">
        <div
          className="w-full text-white flex flex-col items-center justify-center p-4 md:p-8 text-center select-none relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Flower / Clover Logo */}
          <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mb-3 md:mb-5 relative z-10">
            <div className="w-12 h-12 md:w-18 md:h-18 relative flex items-center justify-center">
              <div className="absolute top-0 w-5 h-5 md:w-8 md:h-8 bg-white rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl -rotate-45" />
              <div className="absolute bottom-0 w-5 h-5 md:w-8 md:h-8 bg-white rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl rotate-[135deg]" />
              <div className="absolute left-0 w-5 h-5 md:w-8 md:h-8 bg-white rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl rotate-[225deg]" />
              <div className="absolute right-0 w-5 h-5 md:w-8 md:h-8 bg-white rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl rotate-45" />
              <div className="absolute w-2.5 h-2.5 md:w-3.5 md:h-3.5 border-2 md:border-3 border-violet-600 rounded-full" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-wider relative z-10 drop-shadow-md">Inspire</h1>
          <p className="text-gray-100 text-xs md:text-base mt-2 md:mt-3.5 tracking-wide max-w-sm leading-relaxed relative z-10 drop-shadow">
            Connect. Share. Inspire. Join, connect and stay updated with what matters to you.
          </p>
        </div>
      </div>

      {/* Right side: Interactive Form Container */}
      <div className="md:w-1/2 flex flex-col justify-between h-3/5 md:h-full py-4 md:py-8 lg:py-10 px-5 md:px-12 lg:px-20 overflow-y-auto no-scrollbar">
        {/* Illustration Area */}
        <div className="flex-1 flex items-center justify-center p-2 min-h-0">
          <img
            src={communityImage}
            alt="Community Needs"
            className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Text Area */}
        <div className="text-center my-3 md:my-4">
          <h2 className="text-lg md:text-2xl font-light text-gray-800">
            Everything your
          </h2>
          <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mt-0.5 md:mt-1">
            community needs.
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2 leading-relaxed">
            Simple, fast, and secure passwordless verification.
          </p>
        </div>

        {/* Buttons Area */}
        <div className="w-full flex flex-col items-center">
          <button
            onClick={onLogin}
            className="w-full max-w-md h-11 md:h-12 rounded-full text-white font-bold text-sm md:text-base bg-cover bg-center hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center shadow-md shadow-violet-500/20 mb-3 cursor-pointer overflow-hidden relative"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <span className="relative z-10">Login</span>
          </button>

          <button
            onClick={onRegister}
            className="w-full max-w-md h-11 md:h-12 rounded-full border-2 border-violet-600 hover:bg-violet-50 text-violet-700 font-bold text-sm md:text-base active:scale-[0.98] transition-all flex items-center justify-center bg-white mb-4 cursor-pointer"
          >
            Create Account
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed max-w-md">
            By continuing, you agree to our{' '}
            <span className="text-violet-600 underline cursor-pointer hover:text-violet-700">Privacy Policy</span> and{' '}
            <span className="text-violet-600 underline cursor-pointer hover:text-violet-700">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}

