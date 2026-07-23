import React, { useState } from 'react';
import { 
  ChevronDown, Share2, Award, Plus, Camera, ExternalLink, Trophy, ArrowLeft,
  X, MessageSquare, ArrowBigUp, ArrowBigDown, ShieldAlert, ListFilter
} from 'lucide-react';
import { DashboardLayout, Button, Modal } from '../atomic';

export default function UserProfileScreen({ 
  currentUser, 
  onLogout, 
  onCreatePress, 
  onGoToAdmin, 
  onGoToFeed,
  onGoToSettings
}) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [showActiveInModal, setShowActiveInModal] = useState(false);
  const [showMobileProfileSummary, setShowMobileProfileSummary] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Dropdown states for Feed Filters
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [sortOption, setSortOption] = useState('New');
  const [viewOption, setViewOption] = useState('Card');

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser?.username);
  const emailNickname = currentUser?.email ? currentUser.email.split('@')[0] : '';
  const isNameUUID = /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(currentUser?.name);
  const displayUserName = (isNameUUID && emailNickname) ? emailNickname : (currentUser?.name || currentUser?.displayName || 'Devasanjay');
  const userHandle = (isUUID && emailNickname) ? emailNickname : (currentUser?.username || displayUserName.toLowerCase().replace(/\s+/g, '_'));
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
            <span 
              className="w-full h-full rounded-full text-white font-black text-3xl flex items-center justify-center animate-fade-in"
              style={{ backgroundImage: "url('/src/assets/image.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
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
          <p className="text-xs text-gray-400 font-medium">@{userHandle}</p>
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
            <p className="text-[10px] text-gray-455 font-medium">Contributions</p>
          </div>
          <div>
            <p className="text-sm font-black">2 y</p>
            <p className="text-[10px] text-gray-405 font-medium">Reddit Age</p>
          </div>
          <div>
            <div 
              onClick={() => setShowActiveInModal(true)}
              className="text-blue-600 flex items-center gap-0.5 cursor-pointer hover:underline text-xs font-bold mt-1"
            >
              <span>1</span>
              <span>Active in &gt;</span>
            </div>
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
            { title: 'Profile', desc: 'Customize your profile', tab: 'Profile' },
            { title: 'Curate your profile', desc: 'Manage what people see', tab: 'Profile' },
            { title: 'Avatar', desc: 'Style your avatar', tab: 'Profile' },
            { title: 'Mod Tools', desc: 'Moderate your profile', tab: 'Profile' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-800">{item.title}</p>
                <p className="text-[10px] text-gray-405 truncate">{item.desc}</p>
              </div>
              <button 
                onClick={() => onGoToSettings && onGoToSettings(item.tab)}
                className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full cursor-pointer"
              >
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
                className="flex items-center gap-2 p-2 bg-gray-55/10 rounded-xl hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-405" />
                <span>{link.platform}</span>
              </a>
            ))}
            <button 
              onClick={() => setShowAddSocialModal(true)}
              className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-650 hover:border-gray-550 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
        <div className="w-full space-y-6 pl-6 pr-4">
          {/* Header Back & Logo Banner with custom margins */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <button 
              onClick={onGoToFeed}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-4">
                <span 
                  className="w-16 h-16 rounded-full text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-md"
                  style={{ backgroundImage: "url('/src/assets/image.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {userInitial}
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{displayUserName}</h1>
                  <p className="text-sm text-gray-405 font-medium">@{userHandle}</p>
                </div>
              </div>
              
              {/* Account button for mobile sheet slide-in */}
              <button 
                onClick={() => setShowMobileProfileSummary(true)}
                className="xl:hidden px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-black hover:bg-gray-800 cursor-pointer shadow-sm border border-gray-900 hover:scale-95 transition-all"
              >
                Account
              </button>
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

          {/* Filtering Info Bar with custom Feed Options */}
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 py-1 relative">
            <div className="flex items-center gap-4">
              {/* Showing all content selector */}
              <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer">
                <span>Showing all content</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Feed Option Sort: Hot, New, Top */}
              <div className="relative">
                <button 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer text-gray-700"
                >
                  <span>{sortOption}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showSortDropdown && (
                  <div className="absolute left-0 mt-1.5 w-24 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-1 animate-slide-down-fade">
                    {['Hot', 'New', 'Top'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSortOption(opt); setShowSortDropdown(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold text-gray-750 hover:bg-gray-55/10 rounded-lg cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Option: Card, Compact */}
              <div className="relative">
                <button 
                  onClick={() => setShowViewDropdown(!showViewDropdown)}
                  className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer text-gray-750"
                >
                  <span>{viewOption}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showViewDropdown && (
                  <div className="absolute left-0 mt-1.5 w-28 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-1 animate-slide-down-fade">
                    {['Card', 'Compact'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setViewOption(opt); setShowViewDropdown(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold text-gray-750 hover:bg-gray-55/10 rounded-lg cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Slot based on active tab */}
          <div className="space-y-4">
            
            {/* Overview / Posts: Render high-fidelity Post from apps subreddit */}
            {(activeTab === 'Overview' || activeTab === 'Posts') && (
              <div className="space-y-4">
                
                {/* Create Post Banner row matching the screenshot */}
                <div className="flex items-center gap-2 pb-2">
                  <button 
                    onClick={onCreatePress}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-black rounded-full cursor-pointer border border-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Post</span>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full border border-gray-200 cursor-pointer">
                    <ListFilter className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Subreddit apps Mock Post Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-xs space-y-4 animate-fade-in">
                  
                  {/* Post Header info */}
                  <div className="flex items-center gap-2 text-xs text-gray-450">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center">A</span>
                    <span className="font-extrabold text-gray-900">apps</span>
                    <span>•</span>
                    <span>2 mo. ago</span>
                  </div>

                  {/* Post Title & Description */}
                  <div className="space-y-2">
                    <h2 className="text-base font-black text-gray-900 leading-snug">
                      Built a small Android app called Split for tracking shared expenses with friends and trips. Spent the last few months working on keeping it simple and lightweight. Still improving the UI and adding features. Would genuinely appreciate feedback from Android users on what makes an expense-sharing ap
                    </h2>
                    <p className="text-xs text-blue-600 hover:underline cursor-pointer">https://split.davns.com</p>
                  </div>

                  {/* Warning Warning alert bar */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-505 font-bold">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span>Sorry, this post has been removed by the moderators of apps.</span>
                  </div>

                  {/* Repost Actions button */}
                  <button 
                    onClick={onCreatePress}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Repost to another community</span>
                    <span>&gt;</span>
                  </button>

                  {/* Likes / Comments footer pills */}
                  <div className="flex items-center gap-3 pt-2 text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                      <ArrowBigUp className="w-4 h-4 text-orange-500" />
                      <span>1</span>
                      <ArrowBigDown className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200">
                      <MessageSquare className="w-4 h-4" />
                      <span>0</span>
                    </div>
                    <button className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 ml-auto">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                </div>

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
                <button 
                  onClick={() => onGoToSettings && onGoToSettings('Profile')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-black hover:bg-gray-800 cursor-pointer"
                >
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
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-xs text-gray-550">
                Looks like there is no activity in this section yet.
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      {/* ACTIVE IN MODAL OVERLAY */}
      {showActiveInModal && (
        <div className="fixed inset-0 bg-black/40 z-55 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800 text-sm">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">Active in</h3>
              <button 
                onClick={() => setShowActiveInModal(false)}
                className="p-1 hover:bg-gray-150 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="font-bold text-gray-700">Showing all content</span>
                <span>&gt;</span>
              </div>

              <p className="text-xs text-gray-450 font-semibold leading-relaxed">Some communities may be hidden due to their private status.</p>

              {/* Subreddit details row */}
              <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl bg-white shadow-xs">
                <span className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0">A</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-gray-900">apps</p>
                      <p className="text-[10px] text-gray-400 font-bold">116K members</p>
                    </div>
                    <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer">
                      Joined
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">The universal subreddit for anything application related.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
      
      {/* MOBILE PROFILE SUMMARY MODAL SHEET */}
      <Modal 
        isOpen={showMobileProfileSummary} 
        onClose={() => setShowMobileProfileSummary(false)} 
        title="Account Summary" 
        size="md"
      >
        <div className="text-gray-800 -mx-5 -my-5">
          {renderProfileSummaryCard()}
        </div>
      </Modal>
    </div>
  );
}
