import React from 'react';
import communityImage from '../../assets/get_started_community.png';

export default function GetStartedScreen({ onLogin, onRegister }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-white text-gray-900 animate-fade-in">
      {/* Left side: Banner on Desktop / Top side on Mobile */}
      <div className="md:w-1/2 bg-gradient-to-br from-violet-600 via-pink-500 to-orange-500 text-white flex flex-col items-center justify-center p-8 text-center select-none relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        
        {/* Flower / Clover Logo */}
        <div className="w-20 h-20 flex items-center justify-center mb-4 relative">
          <div className="w-14 h-14 relative flex items-center justify-center">
            <div className="absolute top-0 w-6 h-6 bg-white rounded-tl-2xl rounded-br-2xl -rotate-45" />
            <div className="absolute bottom-0 w-6 h-6 bg-white rounded-tl-2xl rounded-br-2xl rotate-[135deg]" />
            <div className="absolute left-0 w-6 h-6 bg-white rounded-tl-2xl rounded-br-2xl rotate-[225deg]" />
            <div className="absolute right-0 w-6 h-6 bg-white rounded-tl-2xl rounded-br-2xl rotate-45" />
            <div className="absolute w-2.5 h-2.5 border-2 border-violet-600 rounded-full" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-wider">Inspire</h1>
        <p className="text-gray-100 text-sm mt-2 tracking-wide max-w-xs leading-relaxed">
          Connect. Share. Inspire. Join, connect and stay updated with what matters to you.
        </p>
      </div>

      {/* Right side: Interactive Form Container */}
      <div className="md:w-1/2 flex flex-col justify-between py-12 px-6 md:px-16 lg:px-24">
        {/* Illustration Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={communityImage}
            alt="Community Needs"
            className="w-64 h-64 md:w-80 md:h-80 object-contain hover:scale-105 transition-transform duration-300"
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
          <p className="text-sm text-gray-505 mt-2.5 leading-relaxed">
            Simple, fast, and secure passwordless verification.
          </p>
        </div>

        {/* Buttons Area */}
        <div className="w-full flex flex-col items-center">
          <button
            onClick={onLogin}
            className="w-full max-w-md h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center shadow-md shadow-violet-500/20 mb-4 cursor-pointer"
          >
            Login
          </button>

          <button
            onClick={onRegister}
            className="w-full max-w-md h-13 rounded-full border-1.5 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-855 font-bold text-base active:scale-[0.98] transition-all flex items-center justify-center bg-white mb-6 cursor-pointer"
          >
            Create Account
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed max-w-xs">
            By continuing, you agree to our{' '}
            <span className="text-violet-600 underline cursor-pointer hover:text-violet-700">Privacy Policy</span> and{' '}
            <span className="text-violet-600 underline cursor-pointer hover:text-violet-700">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
