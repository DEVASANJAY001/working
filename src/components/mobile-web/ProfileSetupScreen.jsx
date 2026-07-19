import React, { useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown, Camera } from 'lucide-react';

export default function ProfileSetupScreen({ onBack, onContinue }) {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');
    if (!fullName) {
      setError('Full Name is required.');
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

          {/* Title */}
          <div className="mt-4 mb-2">
            <h2 className="text-2xl font-extrabold text-gray-900">Let's set up your profile</h2>
            <p className="text-sm text-gray-400 mt-1">This helps others recognize you</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex flex-col items-center my-6">
            <div className="w-26 h-26 rounded-full border-3 border-gray-100 overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-purple-500 to-orange-500 p-0.5">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center relative">
                <span className="text-white text-4xl font-extrabold">U</span>
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-black/80 rounded-full border border-white flex items-center justify-center text-white cursor-pointer hover:bg-black">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-505 font-bold mt-2 cursor-pointer hover:text-gray-700">Upload Photo</span>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleContinue} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Date of Birth</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm pr-10"
                />
                <Calendar className="w-5 h-5 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Gender (Optional)</label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm appearance-none cursor-pointer pr-10"
                >
                  <option value="">Select your gender</option>
                  {genderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bio (Optional)</label>
                <span className="text-[10px] text-gray-405">{bio.length}/150</span>
              </div>
              <textarea
                placeholder="Tell us about yourself"
                rows={3}
                maxLength={150}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 mt-6 cursor-pointer"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
