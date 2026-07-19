import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';

const languagesList = [
  { id: 'en', name: 'English', subtitle: 'Default', initials: 'EN' },
  { id: 'ta', name: 'தமிழ்', subtitle: 'Tamil', initials: 'த' },
  { id: 'hi', name: 'हिन्दी', subtitle: 'Hindi', initials: 'हि' },
  { id: 'te', name: 'తెలుగు', subtitle: 'Telugu', initials: 'తె' },
  { id: 'kn', name: 'ಕನ್ನಡ', subtitle: 'Kannada', initials: 'ಕ' },
  { id: 'ml', name: 'മലയാളം', subtitle: 'Malayalam', initials: 'മ' },
];

export default function LanguageSelectionScreen({ onBack, onContinue }) {
  const [selectedId, setSelectedId] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = languagesList.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col justify-between py-12 px-6 md:px-16 lg:px-24 min-h-screen bg-white text-gray-900 animate-fade-in">
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Title */}
        <div className="mt-4 mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Choose your language</h2>
          <p className="text-sm text-gray-400 mt-1">Select your preferred language</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search language"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      {/* Languages List (Responsive Grid Layout) */}
      <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto pr-1 select-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
          {filteredLanguages.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer transition-all hover:bg-gray-50 hover:shadow-sm active:scale-[0.99]
                  ${isSelected ? 'bg-violet-50/50 border-violet-500' : 'bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                
                <div className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? 'border-violet-600' : 'border-gray-300'}`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="w-full max-w-5xl mx-auto flex-shrink-0 pt-8">
        <button
          onClick={onContinue}
          className="w-full max-w-md h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
