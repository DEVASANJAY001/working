import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Search, 
  ChevronRight, 
  Plus, 
  X, 
  Megaphone, 
  Globe, 
  Eye, 
  Lock, 
  Shield, 
  Users, 
  BookOpen, 
  CheckCircle, 
  PlusCircle, 
  FileText, 
  BarChart2, 
  Settings, 
  Sliders, 
  TrendingUp, 
  AlertTriangle,
  Pin,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Calendar,
  Grid
} from 'lucide-react';
import { communityService } from '../../services/communityService';

const ALL_TOPICS = [
  { id: 'news', label: 'News & Politics', color: 'bg-red-50 text-red-500 border-red-200' },
  { id: 'anime', label: 'Anime & Manga', color: 'bg-pink-50 text-pink-500 border-pink-200' },
  { id: 'art', label: 'Art & Design', color: 'bg-purple-50 text-purple-500 border-purple-200' },
  { id: 'business', label: 'Business', color: 'bg-emerald-50 text-emerald-500 border-emerald-200' },
  { id: 'collectibles', label: 'Collectibles', color: 'bg-amber-50 text-amber-500 border-amber-200' },
  { id: 'education', label: 'Education', color: 'bg-blue-50 text-blue-500 border-blue-200' },
  { id: 'food', label: 'Food & Drink', color: 'bg-orange-50 text-orange-500 border-orange-200' },
  { id: 'games', label: 'Gaming', color: 'bg-violet-50 text-violet-500 border-violet-200' },
  { id: 'health', label: 'Health & Fitness', color: 'bg-rose-50 text-rose-500 border-rose-200' },
  { id: 'home', label: 'Home & Garden', color: 'bg-green-50 text-green-500 border-green-200' },
  { id: 'tech', label: 'Technology', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'travel', label: 'Travel', color: 'bg-teal-50 text-teal-500 border-teal-200' },
  { id: 'crypto', label: 'Crypto & Web3', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' }
];

export default function CommunityManagerScreen({ onBack, communityId }) {
  // Navigation flow state: 'creation_idea', 'ai_loading', 'creation_topics', 'creation_name', 'dashboard'
  const [currentView, setCurrentView] = useState(communityId ? 'dashboard' : 'creation_idea');
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(false);

  // Creation State
  const [communityIdea, setCommunityIdea] = useState('');
  const [communityType, setCommunityType] = useState('Public');
  const [is18Plus, setIs18Plus] = useState(false);
  const [aiSuggestedTopics, setAiSuggestedTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [nameStatus, setNameStatus] = useState(null); // 'checking', 'available', 'taken'

  // Dashboard Tabs: 'Feed', 'About/Rules', 'Moderators', 'Stats', 'Settings'
  const [activeTab, setActiveTab] = useState('Feed');

  // Dashboard Content State
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [rules, setRules] = useState([]);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [moderatorsList, setModeratorsList] = useState([]);
  const [newModName, setNewModName] = useState('');
  const [newModRole, setNewModRole] = useState('Mod');
  const [showAddModModal, setShowAddModModal] = useState(false);

  // Alert State
  const [alertMsg, setAlertMsg] = useState(null);

  // Load Community Details
  useEffect(() => {
    if (communityId) {
      loadCommunity(communityId);
    }
  }, [communityId]);

  const loadCommunity = async (id) => {
    setLoading(true);
    const list = await communityService.getCommunities();
    const found = list.find(c => c.id === id);
    if (found) {
      setCommunity(found);
      setPosts(found.posts || []);
      setRules(found.rules || []);
      setModeratorsList(found.mods || []);
      setCurrentView('dashboard');
    }
    setLoading(false);
  };

  // Name check logic
  useEffect(() => {
    if (!communityName) {
      setNameStatus(null);
      return;
    }
    const clean = communityName.toLowerCase().replace(/\s+/g, '');
    if (clean.length < 3) {
      setNameStatus('invalid');
      return;
    }
    setNameStatus('checking');
    const timer = setTimeout(() => {
      const takenNames = ['india', 'gaming', 'ipl', 'cricket', 'tech', 'chennai'];
      if (takenNames.includes(clean)) {
        setNameStatus('taken');
      } else {
        setNameStatus('available');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [communityName]);

  // AI suggestion trigger
  const runAISuggestions = () => {
    setCurrentView('ai_loading');
    setTimeout(() => {
      const idea = communityIdea.toLowerCase();
      const suggested = [];
      if (idea.includes('sport') || idea.includes('cricket') || idea.includes('football') || idea.includes('game') || idea.includes('ipl')) {
        suggested.push('sports', 'games');
      }
      if (idea.includes('tech') || idea.includes('code') || idea.includes('dev') || idea.includes('ai') || idea.includes('software')) {
        suggested.push('tech', 'business');
      }
      if (idea.includes('food') || idea.includes('eat') || idea.includes('recipe')) {
        suggested.push('food', 'health');
      }
      if (idea.includes('art') || idea.includes('design') || idea.includes('creative')) {
        suggested.push('art');
      }
      if (suggested.length === 0) {
        suggested.push('tech', 'education');
      }
      setAiSuggestedTopics(suggested);
      setSelectedTopics(suggested);
      setCurrentView('creation_topics');
    }, 2000);
  };

  // Finish Creation
  const handleCreateFinish = async () => {
    if (!communityName || nameStatus !== 'available') return;
    
    const newComm = {
      id: 'c_' + Date.now(),
      name: communityName,
      handle: communityName.toLowerCase().replace(/\s+/g, '_'),
      category: selectedTopics.length > 0 ? ALL_TOPICS.find(t => t.id === selectedTopics[0])?.label || 'General' : 'General',
      members: 1,
      online: 1,
      joined: true,
      description: communityIdea,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      location: 'India',
      language: 'English',
      type: communityType,
      tags: selectedTopics.map(id => ALL_TOPICS.find(t => t.id === id)?.label || ''),
      rules: [
        { id: 1, title: 'Be Respectful', desc: 'No harassment, hate speech, or personal attacks.' },
        { id: 2, title: 'No Spam', desc: 'Avoid repeated self-promotion or off-topic links.' }
      ],
      mods: [
        { name: 'Devasanjay', username: 'devasanjay', role: 'Admin', status: 'Online', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' }
      ],
      stats: {
        members: '1',
        online: '1',
        posts: '0',
        comments: '0',
        growth: [0, 1],
        postTrends: [0, 0]
      },
      posts: []
    };

    await communityService.saveCommunity(newComm);
    setCommunity(newComm);
    setPosts([]);
    setRules(newComm.rules);
    setModeratorsList(newComm.mods);
    setCurrentView('dashboard');
  };

  // Actions on dashboard
  const handleToggleJoin = async () => {
    if (!community) return;
    const isJoined = community.joined;
    let res;
    if (isJoined) {
      res = await communityService.leaveCommunity(community.id);
    } else {
      res = await communityService.joinCommunity(community.id);
    }
    if (res.success) {
      setCommunity(prev => ({
        ...prev,
        joined: !isJoined,
        members: isJoined ? Math.max(0, prev.members - 1) : prev.members + 1
      }));
    }
  };

  const handleAddPost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: 'p_' + Date.now(),
      authorName: 'Devasanjay',
      authorHandle: 'devasanjay',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
      text: newPostText,
      time: 'Just now',
      likes: 1,
      commentsCount: 0,
      pinned: false
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    communityService.updateCommunitySettings(community.id, { posts: updatedPosts });
    setNewPostText('');
  };

  const handleTogglePinPost = (postId) => {
    const updated = posts.map(p => p.id === postId ? { ...p, pinned: !p.pinned } : p);
    setPosts(updated);
    communityService.updateCommunitySettings(community.id, { posts: updated });
  };

  const handleAddRule = () => {
    if (!newRuleTitle.trim()) return;
    const newRule = {
      id: Date.now(),
      title: newRuleTitle,
      desc: newRuleDesc
    };
    const updated = [...rules, newRule];
    setRules(updated);
    communityService.updateCommunitySettings(community.id, { rules: updated });
    setNewRuleTitle('');
    setNewRuleDesc('');
    setShowAddRuleModal(false);
  };

  const handleDeleteRule = (ruleId) => {
    const updated = rules.filter(r => r.id !== ruleId);
    setRules(updated);
    communityService.updateCommunitySettings(community.id, { rules: updated });
  };

  const handleAddMod = () => {
    if (!newModName.trim()) return;
    const newMod = {
      name: newModName,
      username: newModName.toLowerCase().replace(/\s+/g, ''),
      role: newModRole,
      status: 'Offline',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
    };
    const updated = [...moderatorsList, newMod];
    setModeratorsList(updated);
    communityService.updateCommunitySettings(community.id, { mods: updated });
    setNewModName('');
    setShowAddModModal(false);
  };

  const handleRemoveMod = (username) => {
    if (username === 'devasanjay') {
      setAlertMsg("You cannot remove yourself as head moderator!");
      return;
    }
    const updated = moderatorsList.filter(m => m.username !== username);
    setModeratorsList(updated);
    communityService.updateCommunitySettings(community.id, { mods: updated });
  };

  const handleUpdateSettings = async (fields) => {
    const updated = { ...community, ...fields };
    setCommunity(updated);
    await communityService.updateCommunitySettings(community.id, fields);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen text-slate-800">
      
      {/* ─── CREATION FLOW: IDEA ─── */}
      {currentView === 'creation_idea' && (
        <div className="max-w-md mx-auto w-full px-6 py-12 flex flex-col h-screen justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-orange-500 w-1/3 rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">Start with your idea</h2>
              <p className="text-xs text-slate-500 font-medium">Tell us what this community is about. We'll help you choose a topic and name.</p>
            </div>

            <div className="relative bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all">
              <textarea
                className="w-full min-h-[140px] text-xs font-semibold placeholder-slate-400 focus:outline-none resize-none"
                placeholder="Describe your community vision..."
                maxLength={1000}
                value={communityIdea}
                onChange={e => setCommunityIdea(e.target.value)}
              />
              <span className="absolute bottom-3 right-4 text-[10px] text-slate-400 font-bold">{communityIdea.length}/1000</span>
            </div>

            <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-3.5 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-violet-700 font-semibold leading-relaxed">
                Example: "A supportive space for first-time developers in Chennai to showcase tech ideas, share bugs, and find collaborators."
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900">Community Type</span>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                    {communityType === 'Public' ? <Globe className="w-5 h-5" /> : communityType === 'Restricted' ? <Eye className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{communityType}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {communityType === 'Public' ? 'Anyone can view and post' : communityType === 'Restricted' ? 'Anyone can view, approved can post' : 'Only approved members can view'}
                    </p>
                  </div>
                </div>
                <select 
                  value={communityType} 
                  onChange={e => setCommunityType(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="Public">Public</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={runAISuggestions}
            disabled={!communityIdea.trim()}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white transition-all shadow-md mt-6 cursor-pointer flex items-center justify-center gap-2
              ${communityIdea.trim() ? 'bg-slate-950 hover:bg-slate-900 shadow-slate-900/10' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate suggestions</span>
          </button>
        </div>
      )}

      {/* ─── CREATION FLOW: AI LOADING ─── */}
      {currentView === 'ai_loading' && (
        <div className="flex-1 flex flex-col justify-center items-center p-6 h-screen bg-slate-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-950 via-slate-950 to-orange-950 opacity-80" />
          <div className="relative z-10 space-y-6 max-w-sm">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-orange-500 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black tracking-wide">Analyzing your idea...</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Our AI is finding the best topics and community structure for you</p>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-orange-500 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
            </div>
            <p className="text-[10px] text-slate-500 italic mt-6">Choosing topics based on: "{communityIdea.slice(0, 40)}..."</p>
          </div>
        </div>
      )}

      {/* ─── CREATION FLOW: TOPICS ─── */}
      {currentView === 'creation_topics' && (
        <div className="max-w-md mx-auto w-full px-6 py-12 flex flex-col h-screen justify-between">
          <div className="space-y-6 overflow-y-auto no-scrollbar pr-1">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('creation_idea')} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-orange-500 w-2/3 rounded-full" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">Choose topics</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">AI suggested {aiSuggestedTopics.length} topics. Add or remove as you like.</p>
            </div>

            {/* AI Suggested Pills */}
            <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>AI Suggested</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiSuggestedTopics.map(id => {
                  const t = ALL_TOPICS.find(x => x.id === id);
                  if (!t) return null;
                  return (
                    <span key={id} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${t.color}`}>
                      {t.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search topics..."
                value={topicSearch}
                onChange={e => setTopicSearch(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white bg-white"
              />
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
              {ALL_TOPICS.filter(t => t.label.toLowerCase().includes(topicSearch.toLowerCase())).map(topic => {
                const sel = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopics(prev => sel ? prev.filter(x => x !== topic.id) : [...prev, topic.id])}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition-all
                      ${sel ? `${topic.color} scale-[0.98]` : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <span className="text-xs font-bold truncate">{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('creation_name')}
            disabled={selectedTopics.length === 0}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white transition-all shadow-md mt-6 cursor-pointer
              ${selectedTopics.length > 0 ? 'bg-slate-950 hover:bg-slate-900 shadow-slate-900/10' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            Continue
          </button>
        </div>
      )}

      {/* ─── CREATION FLOW: NAME YOUR COMMUNITY ─── */}
      {currentView === 'creation_name' && (
        <div className="max-w-md mx-auto w-full px-6 py-12 flex flex-col h-screen justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('creation_topics')} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-orange-500 w-full rounded-full" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-slate-900">Name your community</h2>
              <p className="text-xs text-slate-500 font-medium">The best names are descriptive and memorable</p>
            </div>

            {/* Megaphone card preview */}
            <div className="bg-gradient-to-b from-orange-50 to-orange-100/50 border border-orange-200/70 rounded-2xl p-5 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-orange-200/30 rounded-full blur-xl -mr-4 -mt-4" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-slate-800 truncate">{communityName ? 'c/' + communityName : 'c/communityname'}</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">1 member • 1 contribution</p>
                </div>
              </div>
            </div>

            {/* Inline Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <span className="text-xs font-bold text-slate-400">c/</span>
                <input
                  type="text"
                  placeholder="communityname"
                  value={communityName}
                  autoFocus
                  onChange={e => {
                    const clean = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                    setCommunityName(clean);
                  }}
                  className="w-full focus:outline-none text-xs font-bold"
                />
              </div>

              {/* Status */}
              {communityName && (
                <div className="px-1 text-[10px] font-bold">
                  {nameStatus === 'checking' && <span className="text-slate-400">Checking availability...</span>}
                  {nameStatus === 'available' && <span className="text-emerald-500">✓ Community name is available</span>}
                  {nameStatus === 'taken' && <span className="text-red-500">✗ Name is already taken</span>}
                  {nameStatus === 'invalid' && <span className="text-amber-500">⚠ Use 3-20 characters (a-z, 0-9, _)</span>}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCreateFinish}
            disabled={!communityName || nameStatus !== 'available'}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white transition-all shadow-md mt-6 cursor-pointer
              ${communityName && nameStatus === 'available' ? 'bg-slate-950 hover:bg-slate-900 shadow-slate-900/10' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            Create Community
          </button>
        </div>
      )}

      {/* ─── MAIN COMMUNITY DASHBOARD ─── */}
      {currentView === 'dashboard' && community && (
        <div className="max-w-2xl mx-auto w-full bg-white min-h-screen flex flex-col shadow-xl border-x border-slate-100">
          
          {/* Header Banner */}
          <div className="relative bg-[#0F172A] pt-12 pb-6 px-6 text-white overflow-hidden rounded-b-3xl">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-purple-950/70" />

            <div className="relative z-10 flex items-center justify-between">
              <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 cursor-pointer transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={handleToggleJoin}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer
                    ${community.joined ? 'bg-white/20 border border-white/30 text-white hover:bg-white/30' : 'bg-violet-600 text-white hover:bg-violet-500'}`}
                >
                  {community.joined ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>

            {/* Avatar & Info */}
            <div className="relative z-10 mt-6 flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-orange-400 flex items-center justify-center text-white text-2xl font-black border-2 border-white shadow-lg">
                {community.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-black tracking-wide truncate">{community.name}</h2>
                <p className="text-xs text-slate-300 font-bold mt-1">c/{community.handle}</p>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-100 bg-white sticky top-0 z-20 px-6">
            {['Feed', 'About', 'Moderators', 'Stats', 'Settings'].map(tab => {
              const isAct = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 flex-1 text-center text-xs font-bold transition-all relative focus:outline-none cursor-pointer
                    ${isAct ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                  {isAct && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.75 bg-violet-600 rounded-t-full" />}
                </button>
              );
            })}
          </div>

          {/* Tab content area */}
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
            
            {/* TABS: FEED */}
            {activeTab === 'Feed' && (
              <div className="space-y-6">
                {/* Create post input */}
                {community.joined && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                    <textarea
                      placeholder="Share updates, links or photos with this community..."
                      value={newPostText}
                      onChange={e => setNewPostText(e.target.value)}
                      className="w-full min-h-[60px] bg-transparent text-xs font-semibold placeholder-slate-400 focus:outline-none resize-none"
                    />
                    <div className="flex justify-end pt-1">
                      <button 
                        onClick={handleAddPost}
                        disabled={!newPostText.trim()}
                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer
                          ${newPostText.trim() ? 'bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-500/10' : 'bg-slate-300 cursor-not-allowed'}`}
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                )}

                {/* Posts List */}
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-bold">No posts in this community yet.</p>
                      <p className="text-[10px] font-medium">Be the first to publish something!</p>
                    </div>
                  ) : (
                    posts.map(post => (
                      <div key={post.id} className={`bg-white border rounded-2xl p-4 shadow-sm space-y-3 relative transition-all
                        ${post.pinned ? 'border-violet-200 bg-violet-50/10' : 'border-slate-100'}`}>
                        
                        {post.pinned && (
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md absolute top-3 right-4">
                            <Pin className="w-3 h-3 rotate-45" />
                            <span>Pinned</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <img src={post.authorAvatar} alt="Author" className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-black text-slate-800">{post.authorName}</h4>
                              <span className="text-[10px] text-slate-400 font-semibold">• {post.time}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">@{post.authorHandle}</p>
                          </div>
                        </div>

                        <p className="text-xs font-medium text-slate-700 leading-relaxed">{post.text}</p>

                        <div className="flex gap-4 pt-2 border-t border-slate-50 text-slate-400 text-xs">
                          <button className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart className="w-4 h-4" /> <span className="text-[10px] font-bold">{post.likes}</span></button>
                          <button className="flex items-center gap-1 hover:text-violet-600 transition-colors"><MessageCircle className="w-4 h-4" /> <span className="text-[10px] font-bold">{post.commentsCount}</span></button>
                          
                          {/* Mod Actions */}
                          <div className="ml-auto flex items-center gap-2">
                            <button 
                              onClick={() => handleTogglePinPost(post.id)}
                              className="p-1 hover:bg-violet-50 rounded-lg text-slate-400 hover:text-violet-600"
                              title={post.pinned ? 'Unpin Post' : 'Pin Post'}
                            >
                              <Pin className={`w-3.5 h-3.5 ${post.pinned ? 'text-violet-600 rotate-45' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TABS: ABOUT & RULES */}
            {activeTab === 'About' && (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Description</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {community.description || 'No description provided.'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Created On</span>
                      <p className="text-xs font-black text-slate-700 mt-0.5">{community.createdDate || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Category</span>
                      <p className="text-xs font-black text-slate-700 mt-0.5">{community.category}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Location</span>
                      <p className="text-xs font-black text-slate-700 mt-0.5">{community.location || 'India'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Language</span>
                      <p className="text-xs font-black text-slate-700 mt-0.5">{community.language || 'English'}</p>
                    </div>
                  </div>
                </div>

                {/* Rules List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Rules ({rules.length})</span>
                    <button 
                      onClick={() => setShowAddRuleModal(true)}
                      className="flex items-center gap-1 text-[11px] text-violet-600 font-bold cursor-pointer hover:opacity-80"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Rule</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm">
                    {rules.map((rule, idx) => (
                      <div key={rule.id} className="p-4 flex gap-3 justify-between items-start">
                        <div className="flex-1 space-y-1">
                          <h4 className="text-xs font-black text-slate-800">{idx + 1}. {rule.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{rule.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TABS: MODERATORS */}
            {activeTab === 'Moderators' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Moderators ({moderatorsList.length})</span>
                  <button 
                    onClick={() => setShowAddModModal(true)}
                    className="flex items-center gap-1 text-[11px] text-violet-600 font-bold cursor-pointer hover:opacity-80"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite Mod</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm">
                  {moderatorsList.map(mod => (
                    <div key={mod.username} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={mod.avatar} alt={mod.name} className="w-9 h-9 rounded-full object-cover border border-slate-150" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-800">{mod.name}</h4>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-50 text-violet-600">{mod.role}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">@{mod.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${mod.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        {mod.username !== 'devasanjay' && (
                          <button 
                            onClick={() => handleRemoveMod(mod.username)}
                            className="text-[10px] text-red-500 hover:text-red-600 font-bold hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABS: STATS & INSIGHTS */}
            {activeTab === 'Stats' && (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Summary cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Subscribers</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{community.members}</h3>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded mt-2 inline-block">▲ +12% growth</span>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Online Now</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{community.online}</h3>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded mt-2 inline-block">Activity Peak</span>
                  </div>
                </div>

                {/* Simulated Chart: Subscriber Growth */}
                <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-violet-600" />
                      <span className="text-xs font-bold text-slate-800">Subscriber Growth Trend</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">Past Months</span>
                  </div>
                  <div className="h-32 flex items-end gap-2.5 pt-4">
                    {/* Simulated Growth Bars */}
                    {(community.stats?.growth || [10000, 25000, 50000, 100000, 125000]).map((val, idx) => {
                      const maxVal = Math.max(...(community.stats?.growth || [125000]));
                      const pct = Math.max(10, Math.round((val / maxVal) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                          <div className="w-full bg-violet-100 rounded-t-lg hover:bg-violet-600 transition-colors relative" style={{ height: `${pct}%` }}>
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">M{idx+1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Activity Heatmap */}
                <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-violet-600" />
                    <span className="text-xs font-bold text-slate-800">Weekly Engagement Heatmap</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 pt-2">
                    {/* Columns representing days */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <span key={day} className="text-[9px] font-bold text-slate-400 text-center mb-1">{day}</span>
                    ))}
                    
                    {/* Simulated Heatmap Blocks */}
                    {Array.from({ length: 21 }).map((_, idx) => {
                      const intensities = ['bg-violet-50', 'bg-violet-100', 'bg-violet-300', 'bg-violet-500', 'bg-violet-700'];
                      const heatIndex = (idx * 3 + 1) % 5;
                      return (
                        <div 
                          key={idx} 
                          className={`aspect-square rounded-md ${intensities[heatIndex]} hover:ring-2 hover:ring-offset-1 hover:ring-violet-600 cursor-pointer`}
                          title={`Engagement factor: ${heatIndex + 1}/5`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-2">
                    <span>Less Active</span>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 bg-violet-50 rounded" />
                      <div className="w-2.5 h-2.5 bg-violet-100 rounded" />
                      <div className="w-2.5 h-2.5 bg-violet-300 rounded" />
                      <div className="w-2.5 h-2.5 bg-violet-500 rounded" />
                      <div className="w-2.5 h-2.5 bg-violet-700 rounded" />
                    </div>
                    <span>Highly Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* TABS: SETTINGS */}
            {activeTab === 'Settings' && (
              <div className="space-y-6">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Community Settings</span>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Display Name</label>
                    <input 
                      type="text" 
                      value={community.name}
                      onChange={e => handleUpdateSettings({ name: e.target.value })}
                      className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Description</label>
                    <textarea 
                      value={community.description}
                      onChange={e => handleUpdateSettings({ description: e.target.value })}
                      className="w-full min-h-[80px] py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white bg-slate-50 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Location</label>
                      <input 
                        type="text" 
                        value={community.location || 'India'}
                        onChange={e => handleUpdateSettings({ location: e.target.value })}
                        className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Language</label>
                      <input 
                        type="text" 
                        value={community.language || 'English'}
                        onChange={e => handleUpdateSettings({ language: e.target.value })}
                        className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Visibility type</label>
                    <select 
                      value={community.type} 
                      onChange={e => handleUpdateSettings({ type: e.target.value })}
                      className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      <option value="Public">Public (Anyone can view & post)</option>
                      <option value="Restricted">Restricted (Anyone can view, mods post)</option>
                      <option value="Private">Private (Only mods can view & post)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ─── ADD RULE MODAL ─── */}
      {showAddRuleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900">Add Community Rule</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Rule Title (e.g. No Harassment)" 
                value={newRuleTitle}
                onChange={e => setNewRuleTitle(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500" 
              />
              <textarea 
                placeholder="Rule Description details..." 
                value={newRuleDesc}
                onChange={e => setNewRuleDesc(e.target.value)}
                className="w-full min-h-[80px] py-2.5 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" 
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowAddRuleModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddRule}
                disabled={!newRuleTitle.trim()}
                className="flex-1 py-2.5 bg-violet-600 text-white font-bold rounded-xl text-xs hover:bg-violet-700 cursor-pointer shadow-md"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD MODERATOR MODAL ─── */}
      {showAddModModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900">Invite Moderator</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Username (e.g. priya_n)" 
                value={newModName}
                onChange={e => setNewModName(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500" 
              />
              <select 
                value={newModRole}
                onChange={e => setNewModRole(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs focus:outline-none"
              >
                <option value="Mod">Moderator (Manage rules & settings)</option>
                <option value="Admin">Administrator (Full control)</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowAddModModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMod}
                disabled={!newModName.trim()}
                className="flex-1 py-2.5 bg-violet-600 text-white font-bold rounded-xl text-xs hover:bg-violet-700 cursor-pointer shadow-md"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ALERT MSG OVERLAY ─── */}
      {alertMsg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">{alertMsg}</h3>
            </div>
            <button 
              onClick={() => setAlertMsg(null)}
              className="w-full py-2.5 bg-slate-950 text-white font-bold rounded-xl text-xs hover:bg-slate-900 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
