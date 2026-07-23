import React, { useState } from 'react';
import { Trash2, Settings, Bell, Film, Users, ShieldAlert, Award, MessageSquare, Flame } from 'lucide-react';
import { DashboardLayout } from '../atomic';

export default function NotificationsScreen({
  currentUser,
  onLogout,
  onCreatePress,
  onGoToAdmin,
  onGoToFeed,
  onViewProfile
}) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'movie',
      title: 'Seen Jana Nayagan yet? 🎬',
      desc: 'The reviews are pouring in! Check out what redditors think of the film & share your verdict 👇',
      time: '6m ago',
      unread: true,
      icon: <Film className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 2,
      type: 'community',
      title: 'Are you missing members?',
      desc: 'Inactivity means new visitors are passing by. Post to secure the next batch of r/hisnndijd members.',
      time: '36m ago',
      unread: true,
      icon: <span className="text-lg">✏️</span>
    },
    {
      id: 3,
      type: 'community',
      title: 'Protect your early success',
      desc: 'That initial buzz is fragile. Post and comment today to prevent r/cjppartyy from losing its current members.',
      time: '36m ago',
      unread: true,
      icon: <span className="text-lg">📢</span>
    },
    {
      id: 4,
      type: 'sub',
      title: 'Because you visited r/saveetha_chennai',
      desc: 'PLEASE HELP PPLL!!!',
      time: '2h ago',
      unread: false,
      icon: <span className="font-black text-xs text-white bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center">r/</span>
    },
    {
      id: 5,
      type: 'post',
      title: 'New post in r/cjppartyy',
      desc: 'its_kurmi_pvt posted: "Protest"',
      time: '3h ago',
      unread: false,
      icon: <span className="text-lg">📢</span>
    },
    {
      id: 6,
      type: 'streak',
      title: 'You’re rolling now!',
      desc: 'Getting started is the hardest part. Can you get to a 3-day streak?',
      time: '2d ago',
      unread: false,
      icon: <Flame className="w-5 h-5 text-amber-500" />
    },
    {
      id: 7,
      type: 'mod',
      title: 'u/reddit - Congrats! You’re officially a Reddit moderator',
      desc: 'Welcome to the mod club 😎 Whether you started a new community or joined an existing mod team, you l…',
      time: '3d ago',
      unread: false,
      icon: <span className="text-lg">😎</span>
    },
    {
      id: 8,
      type: 'survey',
      title: 'u/RedditResearch - Take part in Reddit research',
      desc: 'Take this quick survey and let us know about your experiences. Thanks for your time! -Reddit Resear…',
      time: '1mo ago',
      unread: false,
      icon: <span className="text-lg">📊</span>
    },
    {
      id: 9,
      type: 'survey',
      title: 'u/RedditResearch - Participate in Reddit Research',
      desc: 'Take this quick survey and let us know about your experiences! Thanks for your time! -Reddit Resear…',
      time: '1y ago',
      unread: false,
      icon: <span className="text-lg">📊</span>
    },
    {
      id: 10,
      type: 'survey',
      title: 'u/RedditResearch - (Reminder) Participate in Reddit Research',
      desc: 'Take this quick survey and let us know about your experiences! Thanks for your time! This will be t…',
      time: '1y ago',
      unread: false,
      icon: <span className="text-lg">📊</span>
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="h-screen w-screen bg-[#F6F7F8] text-gray-900 font-sans flex flex-col overflow-hidden">
      <DashboardLayout
        searchQuery=""
        setSearchQuery={() => {}}
        currentUser={currentUser}
        onCreatePress={onCreatePress}
        onGoToAdmin={onGoToAdmin}
        onLogout={onLogout}
        activeNav="Notifications"
        setActiveNav={onGoToFeed}
        recentPostsList={[]}
        onViewProfile={onViewProfile}
      >
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
            
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
              <button 
                onClick={handleMarkAllRead}
                className="hover:text-gray-800 transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={handleClearAll}
                title="Clear all"
                className="p-1.5 hover:bg-gray-150 hover:text-red-600 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                title="Settings"
                className="p-1.5 hover:bg-gray-150 hover:text-gray-800 rounded-full transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-xs">
              {notifications.map(notif => (
                <div 
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notif.unread ? 'bg-blue-50/20 border-l-4 border-blue-500 pl-3' : ''
                  }`}
                >
                  {/* Notification Icon */}
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 shadow-xs border border-gray-200">
                    {notif.icon}
                  </div>

                  {/* Text Contents */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-gray-900 ${notif.unread ? 'font-black' : 'font-bold'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {notif.desc}
                    </p>
                    <span className="text-[10px] text-gray-400 font-semibold mt-2 inline-block">
                      {notif.time}
                    </span>
                  </div>

                  {/* Unread dot indicator */}
                  {notif.unread && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 self-center flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl space-y-3">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Bell className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">All caught up!</p>
                <p className="text-xs text-gray-400 mt-1">You have no new notifications.</p>
              </div>
            </div>
          )}

          {/* Footer details */}
          <div className="text-[11px] text-gray-450 font-bold leading-relaxed pt-4 border-t border-gray-200 flex flex-wrap gap-x-3 gap-y-1 justify-center sm:justify-start">
            <span className="hover:underline cursor-pointer">Reddit Rules</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">User Agreement</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Accessibility</span>
            <span>•</span>
            <span className="text-gray-400">Reddit, Inc. © 2026. All rights reserved.</span>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
