import React from 'react';
import { MessageCircle, Repeat, Share2 } from 'lucide-react';
import { SubredditHeader, VotePill, ActionPill, SpoilerMediaOverlay } from '../molecules';
import RedditVideoPlayer from './RedditVideoPlayer';

export default function SpoilerPostCard({
  post,
  onLike,
  onDislike,
  onReport,
  activeReportPostId,
  setActiveReportPostId
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all mb-4 p-4 md:p-5 shadow-xs">
      {/* Subreddit Header Molecule */}
      <SubredditHeader
        post={post}
        onReport={onReport}
        activeReportPostId={activeReportPostId}
        setActiveReportPostId={setActiveReportPostId}
      />

      {/* Spoiler Tag & Title */}
      {post.hasSpoiler && (
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 mb-1">
          <span>◆</span>
          <span>SPOILER</span>
        </div>
      )}

      <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 leading-snug cursor-pointer hover:text-orange-600 transition-colors">
        {post.title}
      </h2>

      {/* Media or Video */}
      {post.type === 'video' ? (
        <RedditVideoPlayer poster={post.videoPoster} subtitle={post.subtitle} videoUrl={post.videoUrl} />
      ) : post.image ? (
        <SpoilerMediaOverlay image={post.image} hasSpoiler={post.hasSpoiler} />
      ) : post.bodyText ? (
        <p className="text-sm text-gray-700 leading-relaxed my-2">{post.bodyText}</p>
      ) : null}

      {/* Action Pills Bar */}
      <div className="flex items-center gap-2 flex-wrap mt-3 select-none">
        <VotePill
          likes={post.likes}
          isLiked={post.isLiked}
          isDisliked={post.isDisliked}
          onLike={() => onLike(post.id)}
          onDislike={() => onDislike(post.id)}
        />

        <ActionPill icon={MessageCircle} label={post.commentsCount} />
        <ActionPill icon={Repeat} />
        <ActionPill icon={Share2} label="Share" />
      </div>
    </div>
  );
}
