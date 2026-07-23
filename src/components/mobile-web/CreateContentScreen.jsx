import React, { useState } from 'react';
import { X, Search, Image as ImageIcon, Link as LinkIcon, BarChart2, FileText, Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
import { DashboardLayout, Button, Avatar } from '../atomic';

export default function CreateContentScreen({ onBack, onPublish }) {
  const [activeTab, setActiveTab] = useState('Text'); // Text, Images & Video, Link, Poll
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form inputs
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [uploadedMedia, setUploadedMedia] = useState([]);

  // Drafts state
  const [drafts, setDrafts] = useState([]);

  const communities = [
    {
      id: 'profile',
      name: 'u/Personal_Ability_537',
      weekly: 'Your profile',
      desc: 'Post to your own profile feed',
      icon: '👤',
      type: 'profile'
    },
    {
      id: 'apps',
      name: 'r/apps',
      weekly: '878 weekly contributions',
      desc: 'The universal subreddit for anything application related.',
      icon: '📱',
      type: 'joined'
    },
    {
      id: 'hisnndijd',
      name: 'r/hisnndijd',
      weekly: '0 weekly contributions',
      desc: 'A community for developers to showcase their work, share ideas, and connect with others. Join us for demo parties and collaborative development.',
      icon: '✏️',
      type: 'joined'
    },
    {
      id: 'vitchennai',
      name: 'r/vitchennai',
      weekly: '2.3K weekly contributions',
      desc: 'Largest community online for Chennai VITians',
      icon: '🎓',
      type: 'visited'
    },
    {
      id: 'modnews',
      name: 'r/modnews',
      weekly: '57 weekly contributions',
      desc: 'An official community for announcements from Reddit, Inc. pertaining to moderation.',
      icon: '📰',
      type: 'joined'
    },
    {
      id: 'ipl',
      name: 'r/ipl',
      weekly: '1.1K weekly contributions',
      desc: 'A subreddit for fans of the Indian League.',
      icon: '🏏',
      type: 'joined'
    },
    {
      id: 'announcements',
      name: 'r/announcements',
      weekly: '0 weekly contributions',
      desc: 'Official announcements from Reddit, Inc.',
      icon: '📢',
      type: 'joined'
    },
    {
      id: 'ModSupport',
      name: 'r/ModSupport',
      weekly: '2.9K weekly contributions',
      desc: 'An official admin-moderated community to discuss mod topics.',
      icon: '🛡️',
      type: 'joined'
    },
    {
      id: 'androidapps',
      name: 'r/androidapps',
      weekly: '1.7K weekly contributions',
      desc: 'Talk about Android apps, recommendations and support.',
      icon: '🤖',
      type: 'joined'
    },
    {
      id: 'NewMods',
      name: 'r/NewMods',
      weekly: '1.4K weekly contributions',
      desc: 'New to modding on Reddit? Find support, earn trophies, & cheer one another on!',
      icon: '👑',
      type: 'joined'
    },
    {
      id: 'saveetha_chennai',
      name: 'r/saveetha_chennai',
      weekly: '23 weekly contributions',
      desc: 'A community for students, alumni, and faculty of Saveetha branches.',
      icon: '🏫',
      type: 'visited'
    },
    {
      id: 'AI_Agents',
      name: 'r/AI_Agents',
      weekly: '7K weekly contributions',
      desc: 'A place for discussion around the use of AI Agents and related tools.',
      icon: '🤖',
      type: 'visited'
    }
  ];

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!selectedCommunity) {
      alert('Please select a community first');
      return;
    }

    onPublish({
      id: `post_${Date.now()}`,
      community: selectedCommunity.name.replace(/^r\//, ''),
      communityIcon: selectedCommunity.icon,
      isVerified: false,
      authorName: 'devasanjay',
      time: 'Just now',
      title: title,
      bodyText: activeTab === 'Text' ? bodyText : activeTab === 'Link' ? linkUrl : '',
      image: activeTab === 'Images & Video' && uploadedMedia.length > 0 ? uploadedMedia[0] : null,
      likes: 1,
      commentsCount: 0,
      shares: 0,
      isLiked: true
    });
  };

  const handleSaveDraft = () => {
    if (!title.trim()) {
      alert('Enter a title to save a draft');
      return;
    }
    const newDraft = {
      id: `draft_${Date.now()}`,
      title,
      bodyText,
      tab: activeTab,
      community: selectedCommunity ? selectedCommunity.name : 'Draft'
    };
    setDrafts([...drafts, newDraft]);
    alert('Draft saved successfully!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setUploadedMedia([...uploadedMedia, fakeUrl]);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#DAE0E6] text-gray-900 font-sans flex flex-col overflow-hidden">
      <DashboardLayout
        searchQuery=""
        setSearchQuery={() => {}}
        currentUser={null}
        onCreatePress={() => {}}
        onGoToAdmin={() => {}}
        onLogout={() => {}}
        activeNav="Create"
        setActiveNav={onBack}
        recentPostsList={[]}
        hideRightSidebar={true}
      >
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6 text-left">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-gray-300 pb-3">
            <h1 className="text-lg font-bold text-gray-900">Create post</h1>
            <button 
              onClick={() => alert(`Drafts count: ${drafts.length}`)}
              className="text-xs font-bold text-blue-600 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Drafts <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full ml-1">{drafts.length}</span>
            </button>
          </div>

          {/* Select Community Button */}
          <div className="relative">
            <button 
              onClick={() => setShowCommunityPopup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-800 cursor-pointer transition-all shadow-xs"
            >
              <span>{selectedCommunity ? `${selectedCommunity.icon} ${selectedCommunity.name}` : 'Select Community'}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Post To / Select Community Popup */}
            {showCommunityPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up-fade">
                  {/* Popup Header */}
                  <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-white flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900">Post to</h3>
                    <button 
                      onClick={() => setShowCommunityPopup(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Search community input */}
                  <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 flex-shrink-0">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search communities" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold focus:outline-none placeholder-gray-400 text-gray-800"
                    />
                  </div>

                  {/* Communities List */}
                  <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
                    {filteredCommunities.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCommunity(c);
                          setShowCommunityPopup(false);
                        }}
                        className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                          {c.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-gray-900">{c.name}</p>
                          <p className="text-[10px] text-gray-405 font-bold mt-0.5">{c.weekly}</p>
                          {c.desc && <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{c.desc}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form and Tabs Card */}
          <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-xs">
            {/* Tabs bar */}
            <div className="flex border-b border-gray-200">
              {[
                { name: 'Text', icon: <FileText className="w-4 h-4" /> },
                { name: 'Images & Video', icon: <ImageIcon className="w-4 h-4" /> },
                { name: 'Link', icon: <LinkIcon className="w-4 h-4" /> },
                { name: 'Poll', icon: <BarChart2 className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-xs font-black border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.name 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50/80'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Form body */}
            <div className="p-4 space-y-4">
              {/* Title input */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Title*"
                  maxLength={300}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:border-gray-400 bg-gray-50/30"
                />
                <span className="absolute right-3 bottom-3 text-[10px] font-bold text-gray-400">
                  {title.length}/300
                </span>
              </div>

              {/* Tag placeholder row */}
              <div>
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full text-[10px] font-bold cursor-pointer transition-colors border border-gray-200">
                  + Add tags
                </button>
              </div>

              {/* Text Tab editor */}
              {activeTab === 'Text' && (
                <div className="space-y-3">
                  {/* Rich Text Editor formatting options mock bar */}
                  <div className="flex flex-wrap items-center gap-1 bg-gray-50 border border-gray-200 rounded-t-xl p-1.5 text-xs text-gray-500 font-bold select-none">
                    {['Bold', 'Italic', 'Strikethrough', 'Superscript', 'Heading', 'Link', 'Image', 'Video', 'Bullet List', 'Number List', 'Spoiler', 'Quote Block', 'Code', 'Code Block', 'Table'].map(tool => (
                      <span key={tool} className="px-2 py-1 hover:bg-gray-200 rounded cursor-pointer transition-colors text-[10px]">{tool}</span>
                    ))}
                    <span className="ml-auto text-[10px] text-blue-600 cursor-pointer hover:underline">Switch to Markdown</span>
                  </div>

                  <textarea
                    placeholder="Body text (optional)"
                    value={bodyText}
                    onChange={e => setBodyText(e.target.value)}
                    className="w-full min-h-[160px] p-4 border border-t-0 border-gray-200 rounded-b-xl text-xs font-semibold focus:outline-none resize-none focus:border-gray-300"
                  />
                </div>
              )}

              {/* Images & Video upload area */}
              {activeTab === 'Images & Video' && (
                <div className="border-2 border-dashed border-gray-250 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center space-y-3 relative">
                  <input 
                    type="file" 
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shadow-xs">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-700">Drag and Drop or upload media</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Upload files</p>
                  </div>
                </div>
              )}

              {/* Link tab */}
              {activeTab === 'Link' && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Link URL *</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white bg-gray-50/30"
                  />
                </div>
              )}

              {/* Poll tab */}
              {activeTab === 'Poll' && (
                <div className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Poll Question *</label>
                    <input 
                      type="text" 
                      placeholder="What is your question?"
                      value={pollQuestion}
                      onChange={e => setPollQuestion(e.target.value)}
                      className="w-full py-3 px-4 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white bg-gray-50/30"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Options</label>
                    {pollOptions.map((opt, idx) => (
                      <input 
                        key={idx}
                        type="text" 
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={e => {
                          const newOpts = [...pollOptions];
                          newOpts[idx] = e.target.value;
                          setPollOptions(newOpts);
                        }}
                        className="w-full py-2.5 px-4 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white bg-gray-50/30"
                      />
                    ))}
                    <button 
                      onClick={() => setPollOptions([...pollOptions, ''])}
                      className="text-xs font-black text-blue-600 hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons (Post, Save Draft) */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-150">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={handlePostSubmit}
                  variant="default"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
