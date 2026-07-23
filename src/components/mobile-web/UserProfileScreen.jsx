import React, { useState } from 'react';
import { 
  ChevronDown, Share2, Award, Plus, Camera, ExternalLink, Trophy, ArrowLeft
} from 'lucide-react';
import { DashboardLayout, Button } from '../atomic';

export default function UserProfileScreen({ 
  currentUser, 
  onLogout, 
  onCreatePress, 
  onGoToAdmin, 
  onGoToFeed 
}) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const displayUserName = currentUser?.name || 'Devasanjay';
  const userHandle = currentUser?.username || 'Personal_Ability_537';
  const userInitial = displayUserName.charAt(0).toUpperCase();

  // Tabs list
  const tabsList = ['Overview', 'Posts', 'Comments', 'Saved', 'History', 'Hidden', 'Upvoted', 'Downvoted'];

  const handleAddSocial = (e) => {
    e.preventDefault();
    if (!newPlatform.trim() || !newUrl.trim()) return;
    setSocialLinks(prev => [...prev, { platform: newPlatform.trim(), url: newUrl.trim() }]);
    setNewPlatform('');
    setNewUrl('');
    setShowAddSocialModal(false);
  };

  // Render the Right Profile Details summary card
  const renderProfileSummaryCard = () => (
    <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs space-y-4">
      {/* Header Banner */}
      <div className="h-32 bg-black relative p-3 flex justify-end items-start">
        <button title="Change Banner" className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 cursor-pointer">
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Info Summary */}
      <div className="px-4 pb-4 space-y-4">
        {/* Avatar Overlap Container */}
        <div className="relative -mt-16 mb-2 flex items-end justify-between">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md relative">
            <span className="w-full h-full rounded-full bg-gradient-to-tr from-[#00FFFF] to-[#FF007F] text-white font-black text-3xl flex items-center justify-center">
              {userInitial}
            </span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 hover:bg-gray-50 text-xs font-bold text-gray-700 border border-gray-200 rounded-full cursor-pointer">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{displayUserName}</h2>
          <p className="text-xs text-gray-400 font-medium">u/{userHandle}</p>
          <p className="text-xs font-bold text-gray-400 mt-2">0 followers</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 text-xs font-bold text-gray-900">
          <div>
            <p className="text-sm font-black">1</p>
            <p className="text-[10px] text-gray-405 font-medium">Karma</p>
          </div>
          <div>
            <p className="text-sm font-black">0</p>
            <p className="text-[10px] text-gray-405 font-medium">Contributions</p>
          </div>
          <div>
            <p className="text-sm font-black">2 y</p>
            <p className="text-[10px] text-gray-405 font-medium">Reddit Age</p>
          </div>
          <div>
            <p className="text-blue-600 flex items-center gap-0.5 cursor-pointer hover:underline text-xs font-bold mt-1">
              <span>1</span>
              <span>Active in &gt;</span>
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-gray-500 uppercase tracking-wider">
            <span>ACHIEVEMENTS</span>
            <button className="text-blue-600 hover:underline cursor-pointer">View All</button>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <Trophy className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-800 truncate">Banana Beginner, New Share</p>
              <p className="text-[10px] text-gray-400">11 unlocked</p>
            </div>
          </div>
        </div>

        {/* Profile Settings Update Links */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-black text-gray-500 uppercase tracking-wider">SETTINGS</div>
          {[
            { title: 'Profile', desc: 'Customize your profile' },
            { title: 'Curate your profile', desc: 'Manage what people see' },
            { title: 'Avatar', desc: 'Style your avatar' },
            { title: 'Mod Tools', desc: 'Moderate your profile' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-800">{item.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{item.desc}</p>
              </div>
              <button className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full cursor-pointer">
                Update
              </button>
            </div>
          ))}
        </div>

        {/* Social Links List */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-black text-gray-500 uppercase tracking-wider">SOCIAL LINKS</div>
          <div className="space-y-2">
            {socialLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                <span>{link.platform}</span>
              </a>
            ))}
            <button 
              onClick={() => setShowAddSocialModal(true)}
              className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-650 hover:border-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Social Link</span>
            </button>
          </div>
        </div>

        {/* Moderating list */}
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-black text-gray-500 uppercase tracking-wider">MODERATING</div>
          {[
            { name: 'cjppartyy', members: '1 member' },
            { name: 'hisnndijd', members: '1 member' }
          ].map(mod => (
            <div key={mod.name} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-800">{mod.name}</p>
                <p className="text-[10px] text-gray-405">{mod.members}</p>
              </div>
              <button className="px-3.5 py-1 text-xs font-bold bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 cursor-pointer">
                Joined
              </button>
            </div>
          ))}
        </div>

        {/* Trophy Case */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-black text-gray-500 uppercase tracking-wider">TROPHY CASE</div>
          <div className="flex items-center gap-2.5">
            <Award className="w-7 h-7 text-[#FF4500]" />
            <div>
              <p className="text-xs font-bold text-gray-800">Two-Year Club</p>
            </div>
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
        rightColumnOverride={renderProfileSummaryCard()}
      >
        <div className="w-full space-y-6">
          {/* Header Back & Logo Banner with custom margins */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-150">
            <button 
              onClick={onGoToFeed}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div className="flex items-center gap-4">
              <span className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00FFFF] to-[#FF007F] text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-md">
                {userInitial}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{displayUserName}</h1>
                <p className="text-sm text-gray-400 font-medium">u/{userHandle}</p>
              </div>
            </div>
          </div>

          {/* Profile Navigation Tab Pills */}
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

          {/* Filtering Info Bar */}
          <div className="flex items-center justify-between text-xs font-bold text-gray-450 py-1">
            <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer">
              <span>Showing all content</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content Slot based on active tab */}
          <div className="space-y-4">
            {/* Overview / Posts */}
            {(activeTab === 'Overview' || activeTab === 'Posts') && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mx-auto text-violet-600">
                  <Plus className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Create your first post</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">Share your thoughts, videos, or questions with communities around the globe!</p>
                </div>
                <Button variant="default" size="sm" onClick={onCreatePress}>
                  Create Post
                </Button>
              </div>
            )}

            {/* Comments Tab Empty State */}
            {activeTab === 'Comments' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <span className="text-4xl">💬</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">You don't have any comments yet</h3>
                  <p className="text-xs text-gray-550 mt-1 max-w-sm mx-auto">Once you comment in a community, it'll show up here. If you'd rather hide your comments, update your settings.</p>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-black hover:bg-gray-800 cursor-pointer">
                  Update Settings
                </button>
              </div>
            )}

            {/* Saved Tab Empty State */}
            {activeTab === 'Saved' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <span className="text-4xl">🔖</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Looks like you haven't saved anything yet</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Posts you save will appear here for easy reference in the future.</p>
                </div>
              </div>
            )}

            {/* Other Tabs fallback */}
            {!['Overview', 'Posts', 'Comments', 'Saved'].includes(activeTab) && (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-xs text-gray-500">
                Looks like there is no activity in this section yet.
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      {/* ADD SOCIAL LINK MODAL */}
      {showAddSocialModal && (
        <div className="fixed inset-0 bg-black/40 z-55 flex items-center justify-center p-4">
          <form onSubmit={handleAddSocial} className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in text-gray-800">
            <div>
              <h3 className="text-base font-black text-gray-900">Add Social Link</h3>
              <p className="text-xs text-gray-500 mt-1">Add external handles or portfolio URLs to your profile card.</p>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Platform Name</label>
                <input
                  type="text"
                  placeholder="e.g. GitHub, LinkedIn, X"
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:bg-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="pill" className="flex-1" onClick={() => setShowAddSocialModal(false)}>Cancel</Button>
              <Button type="submit" variant="default" className="flex-1">Add Link</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
