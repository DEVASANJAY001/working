import React, { useState } from 'react';
import { MoreHorizontal, Flag } from 'lucide-react';
import { Button } from '../atoms';

export default function SubredditHeader({
  post,
  onReport,
  activeReportPostId,
  setActiveReportPostId
}) {
  const [joined, setJoined] = useState(post.isJoined);

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold border border-gray-200">
          {post.communityIcon || '🏎️'}
        </div>
        <span className="font-extrabold text-gray-900 hover:underline cursor-pointer">
          {post.community}
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-400 font-normal">{post.time}</span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-400 font-normal truncate max-w-xs">{post.recommendationReason}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={joined ? 'pill' : 'black'}
          size="sm"
          onClick={() => setJoined(!joined)}
        >
          {joined ? 'Joined' : 'Join'}
        </Button>

        <div className="relative">
          <button
            onClick={() => setActiveReportPostId(activeReportPostId === post.id ? null : post.id)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {activeReportPostId === post.id && (
            <div className="absolute right-0 top-7 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-1">
              <button
                onClick={() => onReport(post)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" /> Report Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
