import React, { useState } from 'react';
import {
  MoreHorizontal, Flag, Eye, ArrowUp, ArrowDown, MessageCircle, Repeat, Share2
} from 'lucide-react';
import RedditVideoPlayer from './RedditVideoPlayer';

export default function SpoilerPostCard({
  post,
  onLike,
  onDislike,
  onReport,
  activeReportPostId,
  setActiveReportPostId
}) {
  const [showSpoiler, setShowSpoiler] = useState(!post.hasSpoiler);
  const [joined, setJoined] = useState(post.isJoined);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all mb-4 p-4 md:p-5 shadow-xs">
      {/* 1. Header */}
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
          <button
            onClick={() => setJoined(!joined)}
            className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              joined ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {joined ? 'Joined' : 'Join'}
          </button>

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

      {/* 2. Spoiler Tag & Title */}
      {post.hasSpoiler && (
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 mb-1">
          <span>◆</span>
          <span>SPOILER</span>
        </div>
      )}

      <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 leading-snug cursor-pointer hover:text-orange-600 transition-colors">
        {post.title}
      </h2>

      {/* 3. Media with Spoiler Overlay or Video */}
      {post.type === 'video' ? (
        <RedditVideoPlayer poster={post.videoPoster} subtitle={post.subtitle} videoUrl={post.videoUrl} />
      ) : post.image ? (
        <div className="relative rounded-2xl overflow-hidden bg-[#2D2825] my-2 min-h-[380px] max-h-[560px] flex items-center justify-center shadow-md">
          {!showSpoiler ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
              <img
                src={post.image}
                alt="Spoiler background"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40"
              />
              <div className="absolute inset-0 bg-black/40" />

              <button
                onClick={() => setShowSpoiler(true)}
                className="relative z-10 bg-black/80 hover:bg-black text-white text-xs font-extrabold px-5 py-2.5 rounded-full transition-all cursor-pointer border border-white/20 shadow-2xl flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View spoiler
              </button>
            </div>
          ) : (
            <img
              src={post.image}
              alt="Post content"
              className="w-full max-h-[560px] object-contain transition-transform duration-300"
            />
          )}
        </div>
      ) : post.bodyText ? (
        <p className="text-sm text-gray-700 leading-relaxed my-2">{post.bodyText}</p>
      ) : null}

      {/* 4. Action Pills */}
      <div className="flex items-center gap-2 flex-wrap mt-3 select-none">
        <div className="flex items-center bg-gray-100 rounded-full h-8 px-2 text-xs font-bold">
          <button
            onClick={() => onLike(post.id)}
            className={`p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${post.isLiked ? 'text-orange-600' : 'text-gray-500'}`}
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <span className={`px-2 ${post.isLiked ? 'text-orange-600' : post.isDisliked ? 'text-blue-600' : 'text-gray-800'}`}>
            {post.likes}
          </span>
          <button
            onClick={() => onDislike(post.id)}
            className={`p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${post.isDisliked ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <button className="flex items-center gap-1.5 h-8 px-3.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer">
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span>{post.commentsCount}</span>
        </button>

        <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer">
          <Repeat className="w-3.5 h-3.5 text-gray-500" />
        </button>

        <button className="flex items-center gap-1.5 h-8 px-3.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer">
          <Share2 className="w-3.5 h-3.5 text-gray-500" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
