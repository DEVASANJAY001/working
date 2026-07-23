import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronRight, Check, X, ShieldAlert, 
  ExternalLink, LogOut, Bell, Eye, EyeOff, Globe, Trash2
} from 'lucide-react';
import { DashboardLayout, Button } from '../atomic';

export default function SettingsScreen({ 
  currentUser, 
  onLogout, 
  onCreatePress, 
  onGoToAdmin, 
  onGoToFeed,
  initialTab = 'Account'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [googleConnected, setGoogleConnected] = useState(true);
  const [appleConnected, setAppleConnected] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.name || 'Devasanjay');
  const [aboutBio, setAboutBio] = useState(currentUser?.bio || 'Exploring clean tech & innovative digital experiences! 🚀');
  const [allowFollow, setAllowFollow] = useState(true);
  const [nsfwFilter, setNsfwFilter] = useState(false);
  const [showFollowers, setShowFollowers] = useState(true);

  // Tabs list
  const tabsList = ['Account', 'Profile', 'Privacy', 'Preferences', 'Notifications', 'Email'];

  const renderAccountTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">General</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
            <div>
              <p className="font-bold text-gray-800">Email address</p>
              <p className="text-xs text-gray-500">{currentUser?.email || 'devasanjay14@gmail.com'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
            <div>
              <p className="font-bold text-gray-800">Gender</p>
              <p className="text-xs text-gray-500">{currentUser?.gender || 'Man'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
            <div>
              <p className="font-bold text-gray-800">Location customization</p>
              <p className="text-xs text-gray-505">Use approximate location (based on IP)</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Account authorization</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Google</p>
              <p className="text-xs text-gray-500">Connect to log in to Reddit with your Google account</p>
            </div>
            <button 
              onClick={() => setGoogleConnected(!googleConnected)}
              className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer"
            >
              {googleConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Apple</p>
              <p className="text-xs text-gray-500">Connect to log in to Reddit with your Apple account</p>
            </div>
            <button 
              onClick={() => setAppleConnected(!appleConnected)}
              className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer"
            >
              {appleConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Two-factor authentication</p>
            </div>
            <button 
              onClick={() => setTwoFactor(!twoFactor)}
              className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors focus:outline-none"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${twoFactor ? 'translate-x-5 bg-orange-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Apps</h3>
        <div className="space-y-3 text-xs font-bold text-blue-600">
          <p className="cursor-pointer hover:underline flex items-center gap-1">OAuth app settings <ExternalLink className="w-3.5 h-3.5" /></p>
          <p className="cursor-pointer hover:underline flex items-center gap-1">Developer Platform app settings <ExternalLink className="w-3.5 h-3.5" /></p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
        <button className="text-red-500 font-black hover:underline cursor-pointer flex items-center gap-1.5">
          <Trash2 className="w-4 h-4" /> Delete account
        </button>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customize your profile</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold text-gray-800">Display name</label>
            <p className="text-xs text-gray-500">Changing your display name won’t change your username</p>
            <input 
              type="text" 
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full max-w-md py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-none focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-800">About description</label>
            <textarea 
              value={aboutBio}
              onChange={e => setAboutBio(e.target.value)}
              rows={3}
              className="w-full max-w-md py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs resize-none focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Avatar</p>
              <p className="text-xs text-gray-500">Edit your avatar or upload an image</p>
            </div>
            <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Banner</p>
              <p className="text-xs text-gray-500">Upload a profile background image</p>
            </div>
            <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer">
              Update
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Curate your profile</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Posts, comments, and communities you’re active in</p>
              <p className="text-xs text-gray-500">Show all content on your profile page</p>
            </div>
            <button 
              onClick={() => setAllowFollow(!allowFollow)}
              className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors focus:outline-none"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${allowFollow ? 'translate-x-5 bg-orange-500' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Show your follower count</p>
            </div>
            <button 
              onClick={() => setShowFollowers(!showFollowers)}
              className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors focus:outline-none"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${showFollowers ? 'translate-x-5 bg-orange-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Social interactions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Allow people to follow you</p>
            </div>
            <button 
              onClick={() => setAllowFollow(!allowFollow)}
              className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors focus:outline-none"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${allowFollow ? 'translate-x-5 bg-orange-500' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Who can send you chat requests</p>
              <p className="text-xs text-gray-550">Everyone</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Discoverability</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-800">Show up in search results</p>
              <p className="text-xs text-gray-500">Allow search engines like Google to link to your profile</p>
            </div>
            <button className="relative w-11 h-6 bg-orange-55/20 rounded-full transition-colors focus:outline-none">
              <span className="absolute top-0.5 left-5 w-5 h-5 bg-orange-55 rounded-full transition-transform shadow-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-white text-gray-900 font-sans flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <DashboardLayout
        searchQuery=""
        setSearchQuery={() => {}}
        currentUser={currentUser}
        onCreatePress={onCreatePress}
        onGoToAdmin={onGoToAdmin}
        onLogout={onLogout}
        activeNav="Profile"
        setActiveNav={onGoToFeed}
        recentPostsList={[]}
      >
        <div className="w-full space-y-6 pl-6 pr-4 pb-12 overflow-y-auto max-h-[calc(100vh-6rem)] no-scrollbar">
          
          {/* Header Back & Page Title */}
          <div className="flex items-center gap-4 pb-2">
            <button 
              onClick={onGoToFeed}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          {/* Settings Sub-Tab Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-100 pb-2">
            {tabsList.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex-shrink-0 ${
                  activeTab === tab 
                    ? 'bg-gray-100 text-gray-900 font-black' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Rendering */}
          <div className="max-w-2xl">
            {activeTab === 'Account' && renderAccountTab()}
            {activeTab === 'Profile' && renderProfileTab()}
            {activeTab === 'Privacy' && renderPrivacyTab()}
            
            {/* Preferences/Notifications/Email Tab Fallbacks showing generic forms */}
            {!['Account', 'Profile', 'Privacy'].includes(activeTab) && (
              <div className="space-y-4 animate-fade-in text-gray-800 text-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{activeTab} Options</h3>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                  <p className="text-xs text-gray-500">Configure your customizable system {activeTab.toLowerCase()} settings and updates.</p>
                  <button className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-black cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </DashboardLayout>
    </div>
  );
}
