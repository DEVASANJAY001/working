import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const interestsList = [
  { id: 'tech', label: 'Technology', icon: '💻', color: '#7C3AED' },
  { id: 'gov', label: 'Government', icon: '🏛️', color: '#3B82F6' },
  { id: 'ai', label: 'AI', icon: '🤖', color: '#EC4899' },
  { id: 'news', label: 'News', icon: '📰', color: '#EF4444' },
  { id: 'edu', label: 'Education', icon: '📚', color: '#10B981' },
  { id: 'health', label: 'Health', icon: '❤️', color: '#F43F5E' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: '#06B6D4' },
  { id: 'sports', label: 'Sports', icon: '⚽', color: '#F59E0B' },
  { id: 'finance', label: 'Finance', icon: '💵', color: '#8B5CF6' },
  { id: 'agri', label: 'Agriculture', icon: '🌱', color: '#10B981' },
  { id: 'business', label: 'Business', icon: '📈', color: '#3B82F6' },
  { id: 'ent', label: 'Entertainment', icon: '🎬', color: '#EC4899' },
];

export default function InterestSelectionScreen({ onBack, onFinish }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleInterest = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-12 px-6 md:px-16 lg:px-24 min-h-screen bg-white text-gray-900 animate-fade-in">
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Title */}
        <div className="mt-4 mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Choose your interests</h2>
          <p className="text-sm text-gray-400 mt-1">Select a few topics you are passionate about</p>
        </div>
      </div>

      {/* Grid List */}
      <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto pr-1 py-2 select-none">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {interestsList.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleInterest(item.id)}
                style={{
                  borderColor: isSelected ? item.color : '#E5E7EB',
                  background: isSelected ? `${item.color}ee` : '#FFFFFF',
                }}
                className={`h-28 rounded-2xl border-1.5 p-4 flex flex-col items-center justify-center relative cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                  ${isSelected ? 'text-white border-0 shadow-lg' : 'text-gray-800 bg-white'}`}
              >
                {isSelected ? (
                  <>
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-bold mt-2 text-center">{item.label}</span>
                    <CheckCircle2 className="w-4 h-4 text-white absolute top-2.5 right-2.5 animate-bounce-subtle" />
                  </>
                ) : (
                  <>
                    <div 
                      style={{ backgroundColor: `${item.color}15` }}
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    >
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <span className="text-xs font-bold text-center">{item.label}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Area */}
      <div className="w-full max-w-5xl mx-auto flex-shrink-0 pt-8 text-center flex flex-col items-center">
        <button
          onClick={onFinish}
          className="w-full max-w-md h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 mb-2 cursor-pointer"
        >
          Finish
        </button>
        <span className="text-[11px] text-gray-400">You can update later in settings</span>
      </div>
    </div>
  );
}
