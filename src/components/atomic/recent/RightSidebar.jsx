import React from 'react';
import RecentPostItem from './RecentPostItem';

export default function RightSidebar({ recentPostsList, onClearRecents }) {
  return (
    <aside className="w-80 p-4 border-l border-gray-200 hidden xl:block sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">RECENT POSTS</h3>
        <button
          onClick={onClearRecents}
          className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Recent Posts List */}
      <div className="space-y-3">
        {recentPostsList && recentPostsList.map((item) => (
          <RecentPostItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </aside>
  );
}
