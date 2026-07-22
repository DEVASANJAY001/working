import React from 'react';
import communityImage from '../../assets/get_started_community.png';
import bgImage from '../../assets/image.png';

export default function GetStartedScreen({ onLogin, onRegister }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-white text-gray-900 animate-fade-in">
      {/* Left side: Banner on Desktop / Top side on Mobile */}
      <div className="p-[20px] md:w-1/2 flex">
        <div
          className="w-full text-white flex flex-col items-center justify-center p-8 text-center select-none relative rounded-3xl overflow-hidden shadow-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Flower / Clover Logo */}
          <div className="w-28 h-28 flex items-center justify-center mb-6 relative z-10">
            <div className="w-20 h-20 relative flex items-center justify-center">
              <div className="absolute top-0 w-8.5 h-8.5 bg-white rounded-tl-3xl rounded-br-3xl -rotate-45" />
              <div className="absolute bottom-0 w-8.5 h-8.5 bg-white rounded-tl-3xl rounded-br-3xl rotate-[135deg]" />
              <div className="absolute left-0 w-8.5 h-8.5 bg-white rounded-tl-3xl rounded-br-3xl rotate-[225deg]" />
              <div className="absolute right-0 w-8.5 h-8.5 bg-white rounded-tl-3xl rounded-br-3xl rotate-45" />
              <div className="absolute w-3.5 h-3.5 border-3 border-violet-600 rounded-full" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-wider relative z-10 drop-shadow-md">Inspire</h1>
          <p className="text-gray-100 text-base md:text-lg mt-3.5 tracking-wide max-w-sm leading-relaxed relative z-10 drop-shadow">
            Connect. Share. Inspire. Join, connect and stay updated with what matters to you.
          </p>
        </div>
      </div>

      {/* Right side: Interactive Form Container */}
      <div className="md:w-1/2 flex flex-col justify-between py-12 px-6 md:px-16 lg:px-24">
        {/* Illustration Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={communityImage}
            alt="Community Needs"
            className="w-100 h-100 md:w-124 md:h-124 object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Text Area */}
        <div className="text-center my-6">
          <h2 className="text-2xl font-light text-gray-800">
            Everything your
          </h2>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
            community needs.
          </h2>
          <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">
            Simple, fast, and secure passwordless verification.
          </p>
        </div>

        {/* Buttons Area */}
        <div className="w-full flex flex-col items-center">
          <button
            onClick={onLogin}
            className="w-full max-w-md h-13 rounded-full text-white font-bold text-base bg-cover bg-center hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center shadow-md shadow-violet-500/20 mb-4 cursor-pointer overflow-hidden relative"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <span className="relative z-10">Login</span>
          </button>

          <button
            onClick={onRegister}
            className="w-full max-w-md h-13 rounded-full border-2 border-violet-600 hover:bg-violet-50 text-violet-700 font-bold text-base active:scale-[0.98] transition-all flex items-center justify-center bg-white mb-6 cursor-pointer"
          >
            Create Account
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed max-w-md whitespace-nowrap">
            By continuing, you agree to our{' '}
            <span className="text-violet-600 underline cursor-pointer hover:text-violet-700">Privacy Policy</span> and{' '}
            <span className="text-violet-600 underline cursor-pointer hover:text-violet-700">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
