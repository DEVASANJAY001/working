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

  // Form states with realistic defaults
  const [googleConnected, setGoogleConnected] = useState(true);
  const [appleConnected, setAppleConnected] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.name || 'Devasanjay');
  const [aboutBio, setAboutBio] = useState(currentUser?.bio || '');
  const [allowFollow, setAllowFollow] = useState(true);
  const [nsfwFilter, setNsfwFilter] = useState(false);
  const [showFollowers, setShowFollowers] = useState(true);
  const [nsfwProfile, setNsfwProfile] = useState(false);
  const [showActiveCommunities, setShowActiveCommunities] = useState(true);

  // Preferences toggles
  const [showMatureContent, setShowMatureContent] = useState(true);
  const [blurMatureMedia, setBlurMatureMedia] = useState(true);
  const [showHomeRecommendations, setShowHomeRecommendations] = useState(true);
  const [autoplayMedia, setAutoplayMedia] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [openNewTab, setOpenNewTab] = useState(true);
  const [markdownEditor, setMarkdownEditor] = useState(false);
  const [oldRedditDefault, setOldRedditDefault] = useState(false);

  // Tabs list
  const tabsList = ['Account', 'Profile', 'Privacy', 'Preferences', 'Notifications', 'Email'];

  const renderFooter = () => (
    <div className="pt-8 mt-8 border-t border-gray-100 text-[10px] font-bold text-gray-400 space-y-2">
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <span className="cursor-pointer hover:underline">Reddit Rules</span>
        <span>•</span>
        <span className="cursor-pointer hover:underline">Privacy Policy</span>
        <span>•</span>
        <span className="cursor-pointer hover:underline">User Agreement</span>
        <span>•</span>
        <span className="cursor-pointer hover:underline">Accessibility</span>
      </div>
      <p>Reddit, Inc. © 2026. All rights reserved.</p>
    </div>
  );

  const renderToggle = (state, setState) => (
    <button 
      onClick={() => setState(!state)}
      className="relative w-11 h-6 bg-gray-25/20 border border-gray-200 rounded-full transition-colors focus:outline-none cursor-pointer"
      style={{ backgroundColor: state ? '#FF4500' : '' }}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white border border-gray-150 rounded-full transition-transform shadow-xs ${state ? 'translate-x-5' : ''}`} />
    </button>
  );

  const renderAccountTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">General</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
            <div>
              <p className="font-bold text-gray-800">Email address</p>
              <p className="text-xs text-gray-500">{currentUser?.email || 'devasanjay14@gmail.com'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
            <div>
              <p className="font-bold text-gray-800">Gender</p>
              <p className="text-xs text-gray-500">Man</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
            <div>
              <p className="font-bold text-gray-800">Location customization</p>
              <p className="text-xs text-gray-500">Use approximate location (based on IP)</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Account authorization</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Google</p>
              <p className="text-xs text-gray-505">Connect to log in to Reddit with your Google account</p>
            </div>
            <button 
              onClick={() => setGoogleConnected(!googleConnected)}
              className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer"
            >
              {googleConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Apple</p>
              <p className="text-xs text-gray-505">Connect to log in to Reddit with your Apple account</p>
            </div>
            <button 
              onClick={() => setAppleConnected(!appleConnected)}
              className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer"
            >
              {appleConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Two-factor authentication</p>
            </div>
            {renderToggle(twoFactor, setTwoFactor)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Apps</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">OAuth app settings</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Developer Platform app settings</p>
              <p className="text-xs text-gray-500">0 apps active</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
          <p className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">Learn about Developer Platform</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reddit Premium</h3>
        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
          <div>
            <p className="font-bold text-gray-800">Get premium</p>
            <p className="text-xs text-gray-505">Ad-free browsing, monthly coins, and premium avatar gear</p>
          </div>
          <button className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-black cursor-pointer">
            Explore
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Advanced</h3>
        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
          <div>
            <p className="font-bold text-red-500">Delete account</p>
            <p className="text-xs text-gray-500">Permanently delete your Reddit account data</p>
          </div>
          <button className="px-4 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-full text-xs font-black cursor-pointer">
            Delete
          </button>
        </div>
      </div>

      {renderFooter()}
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">General</h3>
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
              placeholder="Tell people about yourself..."
              rows={3}
              className="w-full max-w-md py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 text-xs resize-none focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Avatar</p>
              <p className="text-xs text-gray-500">Edit your avatar or upload an image</p>
            </div>
            <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Banner</p>
              <p className="text-xs text-gray-500">Upload a profile background image</p>
            </div>
            <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Social links</p>
              <p className="text-xs text-gray-505">Link external handles on your profile card</p>
            </div>
            <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Mark as mature (18+)</p>
              <p className="text-xs text-gray-500">Label your profile as Not Safe for Work (NSFW)</p>
            </div>
            {renderToggle(nsfwProfile, setNsfwProfile)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Curate your profile</h3>
        <p className="text-xs text-gray-505 mb-4 leading-relaxed">Profile curation only applies to your profile and your content stays visible in communities.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Content and activity</p>
              <p className="text-xs text-gray-505">Posts, comments, and communities you’re active in</p>
            </div>
            {renderToggle(showActiveCommunities, setShowActiveCommunities)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">NSFW</p>
              <p className="text-xs text-gray-500">Show all NSFW posts and comments</p>
            </div>
            {renderToggle(nsfwFilter, setNsfwFilter)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Followers</p>
              <p className="text-xs text-gray-505">Show your follower count</p>
            </div>
            {renderToggle(showFollowers, setShowFollowers)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Advanced</h3>
        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
          <div>
            <p className="font-bold text-gray-800">Profile moderation</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {renderFooter()}
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Social interactions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Allow people to follow you</p>
              <p className="text-xs text-gray-505">Let people follow you to see your profile posts in home feed</p>
            </div>
            {renderToggle(allowFollow, setAllowFollow)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Who can send you chat requests</p>
              <p className="text-xs text-gray-505">Everyone</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50 cursor-pointer">
            <div>
              <p className="font-bold text-gray-800">Blocked accounts</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Discoverability</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">List your profile on old.reddit.com/users</p>
              <p className="text-xs text-gray-505">Allow posts to your profile to appear in r/all</p>
            </div>
            {renderToggle(allowFollow, setAllowFollow)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Show up in search results</p>
              <p className="text-xs text-gray-505">Allow search engines like Google to link to your profile</p>
            </div>
            {renderToggle(googleConnected, setGoogleConnected)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Advertising</h3>
        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
          <div>
            <p className="font-bold text-gray-800">Personalize ads on Reddit based on information and activity from our partners</p>
            <p className="text-xs text-gray-500">Allow us to use partner information to show better ads</p>
          </div>
          {renderToggle(allowFollow, setAllowFollow)}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Advanced</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Third-party app authorizations</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Clear history</p>
              <p className="text-xs text-gray-505">Delete your post views history</p>
            </div>
            <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer">
              Clear
            </button>
          </div>
        </div>
      </div>

      {renderFooter()}
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Language</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Display language</p>
              <p className="text-xs text-gray-505">English (US)</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Content languages</p>
              <p className="text-xs text-gray-505">1 selected</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Content</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Show mature content (I'm over 18)</p>
              <p className="text-xs text-gray-505">See NSFW content in your feeds and search results</p>
            </div>
            {renderToggle(showMatureContent, setShowMatureContent)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Blur mature (18+) images and media</p>
            </div>
            {renderToggle(blurMatureMedia, setBlurMatureMedia)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Show recommendations in home feed</p>
            </div>
            {renderToggle(showHomeRecommendations, setShowHomeRecommendations)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Muted communities</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Accessibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Autoplay media</p>
            </div>
            {renderToggle(autoplayMedia, setAutoplayMedia)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Reduce Motion</p>
            </div>
            {renderToggle(reduceMotion, setReduceMotion)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Experience</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Display Mode</p>
              <p className="text-xs text-gray-500">Light</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Open posts in new tab</p>
            </div>
            {renderToggle(openNewTab, setOpenNewTab)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Default feed view</p>
              <p className="text-xs text-gray-500">Card</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Default to markdown editor</p>
            </div>
            {renderToggle(markdownEditor, setMarkdownEditor)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Keyboard shortcuts</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Default to old Reddit</p>
            </div>
            {renderToggle(oldRedditDefault, setOldRedditDefault)}
          </div>
        </div>
      </div>

      {renderFooter()}
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">General</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Community notifications</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Web push notifications</p>
            </div>
            {renderToggle(autoplayMedia, setAutoplayMedia)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Messages</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Chat messages</p>
              <p className="text-xs text-gray-500 font-bold text-orange-500">All on</p>
            </div>
            {renderToggle(autoplayMedia, setAutoplayMedia)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Chat requests</p>
              <p className="text-xs text-gray-550 font-bold text-orange-500">All on</p>
            </div>
            {renderToggle(autoplayMedia, setAutoplayMedia)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Mark all chat conversations as read</p>
            </div>
            <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer">
              Mark as read
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Activity</h3>
        <div className="space-y-4">
          {[
            'Mentions of u/username', 'Comments on your posts', 'Upvotes on your posts',
            'Upvotes on your comments', 'Replies to your comments', 'Activity on your comments',
            'New followers', 'Awards you receive', 'Posts you follow', 'Comments you follow',
            'Keyword alerts', 'Achievement updates', 'Streak reminders', 'Insights on your posts',
            'Draft post reminders', 'Saved post reminders', 'Suggested communities for your posts',
            'Game notifications'
          ].map(label => (
            <div key={label} className="flex items-center justify-between pb-3 border-b border-gray-50">
              <div>
                <p className="font-bold text-gray-800">{label}</p>
                <p className="text-xs text-gray-505 font-bold text-orange-500">All on</p>
              </div>
              {renderToggle(autoplayMedia, setAutoplayMedia)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Trending posts</p>
              <p className="text-xs text-gray-505 font-bold text-orange-500">All on</p>
            </div>
            {renderToggle(autoplayMedia, setAutoplayMedia)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Featured content</p>
              <p className="text-xs text-gray-505 font-bold text-orange-500">All on</p>
            </div>
            {renderToggle(autoplayMedia, setAutoplayMedia)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Breaking news</p>
              <p className="text-xs text-gray-505 font-bold text-gray-400">All off</p>
            </div>
            {renderToggle(reduceMotion, setReduceMotion)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Updates</h3>
        <div className="space-y-4">
          {['Reddit announcements', 'Cake day', 'Admin notifications'].map(label => (
            <div key={label} className="flex items-center justify-between pb-3 border-b border-gray-50">
              <div>
                <p className="font-bold text-gray-800">{label}</p>
                <p className="text-xs text-gray-505 font-bold text-orange-500">All on</p>
              </div>
              {renderToggle(autoplayMedia, setAutoplayMedia)}
            </div>
          ))}
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Disabled admin notifications</p>
              <p className="text-xs text-gray-500">0</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {renderFooter()}
    </div>
  );

  const renderEmailTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Messages</h3>
        <div className="space-y-4">
          {['Admin notifications', 'Chat requests'].map(label => (
            <div key={label} className="flex items-center justify-between pb-3 border-b border-gray-50">
              <div>
                <p className="font-bold text-gray-800">{label}</p>
              </div>
              {renderToggle(autoplayMedia, setAutoplayMedia)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Activity</h3>
        <div className="space-y-4">
          {[
            'New user welcome', 'Comments on your posts', 'Replies to your comments',
            'Upvotes on your posts', 'Upvotes on your comments', 'Username mentions', 'New followers'
          ].map(label => (
            <div key={label} className="flex items-center justify-between pb-3 border-b border-gray-50">
              <div>
                <p className="font-bold text-gray-800">{label}</p>
              </div>
              {renderToggle(autoplayMedia, setAutoplayMedia)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Newsletters</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Daily Digest</p>
            </div>
            {renderToggle(autoplayMedia, setAutoplayMedia)}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <p className="font-bold text-gray-800">Breaking news email</p>
            </div>
            {renderToggle(autoplayMedia, setAutoplayMedia)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Advanced</h3>
        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
          <div>
            <p className="font-bold text-gray-850">Unsubscribe from all emails</p>
          </div>
          {renderToggle(reduceMotion, setReduceMotion)}
        </div>
      </div>

      {renderFooter()}
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
        hideRightSidebar={true}
      >
        <div className="w-full space-y-6 pl-6 pr-4 pb-12 overflow-y-auto max-h-[calc(100vh-6rem)] no-scrollbar">
          
          {/* Header Back & Page Title */}
          <div className="flex items-center gap-4 pb-2">
            <button 
              onClick={onGoToFeed}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center border border-gray-200 animate-fade-in"
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
                    ? 'bg-gray-150 text-gray-900 font-black' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Rendering */}
          <div className="max-w-5xl">
            {activeTab === 'Account' && renderAccountTab()}
            {activeTab === 'Profile' && renderProfileTab()}
            {activeTab === 'Privacy' && renderPrivacyTab()}
            {activeTab === 'Preferences' && renderPreferencesTab()}
            {activeTab === 'Notifications' && renderNotificationsTab()}
            {activeTab === 'Email' && renderEmailTab()}
          </div>

        </div>
      </DashboardLayout>
    </div>
  );
}
