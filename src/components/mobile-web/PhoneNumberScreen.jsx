import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import phoneInputImage from '../../assets/phone_input.png';

export default function PhoneNumberScreen({ onBack, onContinue }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');
    if (!phoneNumber) {
      setError('Please enter your phone number.');
      return;
    }
    onContinue();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white min-h-screen animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md flex flex-col justify-between h-full min-h-[500px]">
        {/* Header */}
        <div>
          <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-6">
          <img
            src={phoneInputImage}
            alt="Phone Input"
            className="w-40 h-40 object-contain mb-6"
          />

          <h2 className="text-2xl font-bold text-gray-900">Enter your phone number</h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-xs">
            We'll send you an OTP to verify
          </p>

          {/* Error Alert */}
          {error && (
            <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Phone Form */}
          <form onSubmit={handleContinue} className="w-full mt-8 space-y-4">
            <div className="flex items-center w-full h-13 px-4 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold text-gray-700 cursor-pointer">
              <span className="mr-2">🇮🇳</span>
              <span className="flex-1 text-left">India (+91)</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            <div className="w-full h-15 border border-gray-200 rounded-xl bg-gray-50 px-4 py-2 flex flex-col justify-center text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="98765 43210"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-transparent border-0 p-0 text-base font-semibold text-gray-900 focus:outline-none focus:ring-0 mt-0.5"
              />
            </div>

            <button
              type="submit"
              className="w-full h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 mt-6 cursor-pointer"
            >
              Continue
            </button>
          </form>

          <span className="text-xs text-gray-400 mt-6">Your number is safe with us</span>
        </div>
      </div>
    </div>
  );
}
