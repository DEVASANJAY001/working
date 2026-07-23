import React from 'react';

export default function RightSidebar({ recentPostsList }) {
  return (
    <aside className="w-80 p-4 border-l border-gray-200 hidden xl:block sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">RECENT POSTS</h3>
        <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">Clear</button>
      </div>

      <div className="space-y-3">
        {recentPostsList.map((item) => (
          <div key={item.id} className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1 flex gap-2 justify-between">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold">{item.communityIcon}</span>
                <span className="font-bold text-gray-800">{item.community}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
              <p className="text-xs font-bold text-gray-900 leading-snug hover:text-orange-600 transition-colors line-clamp-2">
                {item.title}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                {item.upvotes} {item.comments ? `• ${item.comments}` : ''}
              </p>
            </div>

            {item.thumbnail && (
              <img src={item.thumbnail} alt="Thumbnail" className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0 shadow-xs" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
