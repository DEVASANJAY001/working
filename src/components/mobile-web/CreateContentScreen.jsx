import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  ChevronDown, 
  Image as ImageIcon, 
  Mic, 
  BarChart2, 
  Video, 
  FolderOpen, 
  Save, 
  ArrowLeft, 
  Trash2, 
  Check, 
  Plus, 
  Play, 
  Pause, 
  Camera, 
  RotateCw, 
  Zap, 
  Filter, 
  Calendar, 
  Smile, 
  MapPin 
} from 'lucide-react';

const galleryPhotos = [
  { id: 'p1', uri: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&auto=format&fit=crop&q=80' },
  { id: 'p2', uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80' },
  { id: 'p3', uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=80' },
  { id: 'p4', uri: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&auto=format&fit=crop&q=80' },
  { id: 'p5', uri: 'https://images.unsplash.com/photo-1472214222555-d404758b1c42?w=300&auto=format&fit=crop&q=80' },
  { id: 'p6', uri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&auto=format&fit=crop&q=80' },
  { id: 'p7', uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&auto=format&fit=crop&q=80' },
  { id: 'p8', uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: 'p9', uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80' },
];

export default function CreateContentScreen({ onBack, onPublish }) {
  const [currentView, setCurrentView] = useState('CreatePost'); // CreatePost, VoiceRecorder, VideoRecorder, ImagePicker, PollCreator, DraftsList
  
  // Post states
  const [postText, setPostText] = useState('');
  const [audience, setAudience] = useState('Public');
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [attachedMedia, setAttachedMedia] = useState([]);
  const [attachedVoice, setAttachedVoice] = useState(null);
  const [attachedPoll, setAttachedPoll] = useState(null);

  // Voice recorder states
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceWaveform, setVoiceWaveform] = useState([20, 40, 15, 30, 50, 25, 45, 10, 35, 60, 20, 15]);

  // Camera states
  const [cameraMode, setCameraMode] = useState('PHOTO');
  const [cameraFlash, setCameraFlash] = useState(false);
  const [cameraZoom, setCameraZoom] = useState('1x');
  const [cameraTimer, setCameraTimer] = useState(0);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  // Gallery states
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Poll creator states
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [pollDuration, setPollDuration] = useState('3 Days');
  const [hideResults, setHideResults] = useState(false);

  // Drafts states
  const [drafts, setDrafts] = useState([
    { id: 'd1', title: 'Road work on Anna Salai', text: 'Road renovation work is in progress. Plan your travel accordingly.', date: 'Updated 2m ago', type: 'Text' },
    { id: 'd2', title: 'Water Supply issue in Adyar', text: 'Water supply will be affected in Adyar, Besant Nagar.', date: 'Updated 1h ago', type: 'Text' },
    { id: 'd3', title: 'Chennai Rains 🌧️', text: 'Heavy rains expected this weekend. Stay safe.', date: 'Updated 3h ago', type: 'Text' },
  ]);

  useEffect(() => {
    let interval;
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
        setVoiceWaveform(prev => prev.map(() => Math.floor(Math.random() * 50) + 10));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  useEffect(() => {
    let interval;
    if (isRecordingVideo) {
      interval = setInterval(() => {
        setCameraTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecordingVideo]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!postText.trim() && attachedMedia.length === 0 && !attachedPoll && !attachedVoice) {
      alert('Cannot publish empty post.');
      return;
    }
    onPublish({
      text: postText,
      image: attachedMedia[0] || null,
      images: attachedMedia.length > 1 ? attachedMedia : null,
    });
  };

  const handleSaveDraft = () => {
    if (!postText.trim()) return;
    const newDraft = {
      id: `d_${Date.now()}`,
      title: postText.substring(0, 24) || 'Untitled Draft',
      text: postText,
      date: 'Just now',
      type: 'Text',
    };
    setDrafts([newDraft, ...drafts]);
    alert('Draft saved successfully!');
  };

  const selectPhoto = (uri) => {
    if (selectedPhotos.includes(uri)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== uri));
    } else {
      setSelectedPhotos([...selectedPhotos, uri]);
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleSavePoll = () => {
    if (!pollQuestion.trim()) {
      alert('Poll question is required.');
      return;
    }
    const activeOptions = pollOptions.filter(o => o.trim() !== '');
    if (activeOptions.length < 2) {
      alert('Poll must have at least 2 options.');
      return;
    }
    setAttachedPoll({
      question: pollQuestion,
      options: activeOptions,
      allowMultiple,
      duration: pollDuration,
    });
    setCurrentView('CreatePost');
  };

  return (
    <div className="flex-1 bg-white min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-gray-100 md:shadow-xl rounded-2xl overflow-hidden flex flex-col min-h-[550px] relative">
        
        {/* CRE_001 – Create Post Screen */}
        {currentView === 'CreatePost' && (
          <div className="flex-1 flex flex-col p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <button onClick={onBack} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="text-sm font-bold text-gray-900">Create Post</h3>
              <button onClick={handlePublish} className="bg-violet-600 text-white font-bold text-xs px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
                Post
              </button>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Devasanjay</h4>
                <div className="relative">
                  <button onClick={() => setShowAudienceMenu(!showAudienceMenu)} className="flex items-center gap-1 bg-gray-50 text-[10px] text-gray-500 font-semibold px-2 py-0.5 rounded-md mt-1 border border-gray-100 cursor-pointer">
                    <Globe className="w-3 h-3" />
                    <span>{audience}</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                  {showAudienceMenu && (
                    <div className="absolute left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 w-24 text-[10px]">
                      {['Public', 'Friends', 'Private'].map(aud => (
                        <button key={aud} onClick={() => { setAudience(aud); setShowAudienceMenu(false); }} className="w-full text-left py-1.5 px-3 hover:bg-gray-50 font-medium">
                          {aud}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Editor */}
            <textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={e => setPostText(e.target.value)}
              className="w-full flex-1 min-h-[120px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
            />

            {/* Tags row */}
            {(selectedTopic || selectedLocation || selectedFeeling) && (
              <div className="flex flex-wrap gap-1.5">
                {selectedTopic && <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">#{selectedTopic}</span>}
                {selectedLocation && <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">📍 {selectedLocation}</span>}
                {selectedFeeling && <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">😊 {selectedFeeling}</span>}
              </div>
            )}

            {/* Media previews */}
            {attachedMedia.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-1">
                {attachedMedia.map((uri, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={uri} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setAttachedMedia(attachedMedia.filter(m => m !== uri))} className="absolute top-1 right-1 bg-black/40 rounded-full p-0.5 text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Voice previews */}
            {attachedVoice && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-violet-600 font-semibold">
                  <Mic className="w-4 h-4" />
                  <span>Voice Note attached ({attachedVoice})</span>
                </div>
                <button onClick={() => setAttachedVoice(null)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}

            {/* Poll previews */}
            {attachedPoll && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-violet-600 font-semibold">
                  <BarChart2 className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-bold text-gray-800 truncate max-w-[200px]">{attachedPoll.question}</p>
                    <p className="text-[10px] text-gray-400 font-normal">{attachedPoll.options.length} options • {attachedPoll.duration}</p>
                  </div>
                </div>
                <button onClick={() => setAttachedPoll(null)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}

            {/* Meta shortcuts */}
            <div className="flex justify-between gap-1 text-[10px] text-gray-500 font-semibold border-t border-gray-50 pt-3">
              <button onClick={() => setSelectedTopic('ChennaiRains')} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-100 cursor-pointer"># Add Topic</button>
              <button onClick={() => setSelectedLocation('Adyar, Chennai')} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-100 cursor-pointer">📍 Add Location</button>
              <button onClick={() => setSelectedFeeling('Excited')} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-100 cursor-pointer">😊 Feeling</button>
            </div>

            {/* Attachments Grid */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-4">
              <button onClick={() => setCurrentView('ImagePicker')} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><ImageIcon className="w-4.5 h-4.5" /></div>
                <div><p className="text-xs font-bold text-gray-800">Photo/Video</p></div>
              </button>
              <button onClick={() => setCurrentView('VoiceRecorder')} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><Mic className="w-4.5 h-4.5" /></div>
                <div><p className="text-xs font-bold text-gray-800">Voice</p></div>
              </button>
              <button onClick={() => setCurrentView('PollCreator')} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><BarChart2 className="w-4.5 h-4.5" /></div>
                <div><p className="text-xs font-bold text-gray-800">Poll</p></div>
              </button>
              <button onClick={() => setCurrentView('VideoRecorder')} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center"><Video className="w-4.5 h-4.5" /></div>
                <div><p className="text-xs font-bold text-gray-800">Live</p></div>
              </button>
              <button onClick={() => setCurrentView('DraftsList')} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer text-left col-span-2">
                <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center"><FolderOpen className="w-4.5 h-4.5" /></div>
                <div><p className="text-xs font-bold text-gray-800 font-semibold">Saved Drafts & Notes</p></div>
              </button>
            </div>
          </div>
        )}

        {/* CRE_002 – Voice Recorder overlay */}
        {currentView === 'VoiceRecorder' && (
          <div className="flex-1 bg-slate-900 text-white flex flex-col p-5 justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button onClick={() => setCurrentView('CreatePost')} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="text-sm font-bold">Voice Recorder</h3>
              <div className="w-5" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center my-6 space-y-6">
              <p className="text-xs text-slate-400">{isVoiceRecording ? 'Recording...' : 'Tap below to record'}</p>
              <h2 className="text-4xl font-bold font-mono">{formatTimer(voiceSeconds)}</h2>

              {/* Waveform */}
              <div className="flex items-center gap-1.5 h-16 w-full justify-center">
                {voiceWaveform.map((val, idx) => (
                  <div key={idx} className="w-1.5 bg-violet-600 rounded-full transition-all duration-300" style={{ height: `${val * 1.2}px` }} />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="flex justify-around items-center">
                <button onClick={() => { setVoiceSeconds(0); setIsVoiceRecording(false); }} className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-red-500 cursor-pointer">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={() => setIsVoiceRecording(!isVoiceRecording)} className="p-5 rounded-full bg-violet-600 text-white hover:opacity-90 shadow-lg cursor-pointer">
                  {isVoiceRecording ? <Pause className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button onClick={() => { setIsVoiceRecording(false); setAttachedVoice(formatTimer(voiceSeconds)); setCurrentView('CreatePost'); }} className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-green-400 cursor-pointer">
                  <Check className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider font-bold">Slide up to cancel</p>
            </div>
          </div>
        )}

        {/* CRE_003 – Video/Camera capture */}
        {currentView === 'VideoRecorder' && (
          <div className="flex-1 bg-black text-white flex flex-col justify-between relative">
            <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80" alt="Camera preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">
              <button onClick={() => setCurrentView('CreatePost')} className="text-white hover:opacity-85"><X className="w-6 h-6" /></button>
              <span className="text-xs font-mono bg-red-600 px-3 py-1 rounded-full">{formatTimer(cameraTimer)}</span>
              <button onClick={() => setCameraFlash(!cameraFlash)} className="text-white hover:opacity-85">
                <Zap className={`w-5 h-5 ${cameraFlash ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </button>
            </div>

            {/* Right toolbar */}
            <div className="absolute right-4 top-20 flex flex-col gap-3 z-10">
              <button onClick={() => setCameraZoom(cameraZoom === '1x' ? '2x' : '1x')} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-xs font-bold">{cameraZoom}</button>
              <button className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"><Filter className="w-4 h-4" /></button>
            </div>

            {/* Bottom Controls */}
            <div className="z-10 bg-gradient-to-t from-black/60 to-transparent p-6 space-y-4">
              <div className="flex items-center justify-around">
                <div onClick={() => setCurrentView('ImagePicker')} className="w-10 h-10 rounded-lg overflow-hidden border border-white cursor-pointer">
                  <img src={galleryPhotos[0].uri} alt="Thumb" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={() => {
                    if (cameraMode === 'VIDEO') {
                      if (isRecordingVideo) {
                        setIsRecordingVideo(false);
                        setCameraTimer(0);
                        setAttachedMedia([galleryPhotos[2].uri]);
                        setCurrentView('CreatePost');
                      } else {
                        setIsRecordingVideo(true);
                      }
                    } else {
                      setAttachedMedia([galleryPhotos[1].uri]);
                      setCurrentView('CreatePost');
                    }
                  }} 
                  className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 cursor-pointer"
                >
                  <div className={`w-full h-full rounded-full transition-all ${cameraMode === 'VIDEO' ? 'bg-red-600' : 'bg-white'}`} />
                </button>
                <button className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"><RotateCw className="w-5 h-5" /></button>
              </div>

              {/* Modes */}
              <div className="flex justify-center gap-6 text-xs font-bold text-white/60">
                {['PHOTO', 'VIDEO'].map(m => (
                  <button key={m} onClick={() => setCameraMode(m)} className={`cursor-pointer ${cameraMode === m ? 'text-white border-b-2 border-white pb-0.5' : ''}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CRE_004 – Image Picker Gallery */}
        {currentView === 'ImagePicker' && (
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-150">
              <button onClick={() => setCurrentView('CreatePost')} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              <h3 className="text-sm font-bold text-gray-900">Gallery</h3>
              <button 
                onClick={() => {
                  if (selectedPhotos.length === 0) return;
                  setAttachedMedia(selectedPhotos);
                  setCurrentView('CreatePost');
                }} 
                className="bg-violet-600 text-white font-bold text-xs px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                Next
              </button>
            </div>

            {/* Gallery grids */}
            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-1 p-1">
              {galleryPhotos.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.uri);
                return (
                  <div 
                    key={photo.id} 
                    onClick={() => selectPhoto(photo.uri)} 
                    className="relative aspect-square cursor-pointer overflow-hidden border border-gray-50 group"
                  >
                    <img src={photo.uri} alt="Gallery" className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                        <Check className="w-3.5 h-3.5 text-violet-600 font-extrabold" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom thumbnail bar */}
            {selectedPhotos.length > 0 && (
              <div className="border-t border-gray-100 p-4 space-y-2">
                <p className="text-xs font-bold text-gray-800">Preview ({selectedPhotos.length})</p>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {selectedPhotos.map((uri, idx) => (
                    <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={uri} alt="Thumb" className="w-full h-full object-cover" />
                      <button onClick={() => selectPhoto(uri)} className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CRE_005 – Poll Creator */}
        {currentView === 'PollCreator' && (
          <div className="flex-1 flex flex-col p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <button onClick={() => setCurrentView('CreatePost')} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              <h3 className="text-sm font-bold text-gray-900">Create Poll</h3>
              <button onClick={handleSavePoll} className="bg-violet-600 text-white font-bold text-xs px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
                Save
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-2">
              <div className="space-y-1.5 text-left">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Enter your question</label>
                <input 
                  type="text" 
                  placeholder="e.g. What is the biggest issue in your area?"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white text-xs font-semibold"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Poll Options</label>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={e => {
                        const updated = [...pollOptions];
                        updated[idx] = e.target.value;
                        setPollOptions(updated);
                      }}
                      className="flex-1 py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white text-xs font-semibold"
                    />
                    {pollOptions.length > 2 && (
                      <button onClick={() => setPollOptions(pollOptions.filter((_, oIdx) => oIdx !== idx))} className="text-red-500 hover:text-red-650 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {pollOptions.length < 10 && (
                  <button onClick={handleAddPollOption} className="flex items-center gap-1.5 text-xs text-violet-650 font-bold py-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-xs font-bold text-gray-700">
                <span>Allow multiple answers</span>
                <input type="checkbox" checked={allowMultiple} onChange={e => setAllowMultiple(e.target.checked)} className="accent-violet-650 w-4 h-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-xs font-bold text-gray-700">
                <span>Hide results</span>
                <input type="checkbox" checked={hideResults} onChange={e => setHideResults(e.target.checked)} className="accent-violet-650 w-4 h-4 cursor-pointer" />
              </div>

              {/* Duration */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-xs font-bold text-gray-700">
                <span>Poll duration</span>
                <button onClick={() => setPollDuration(pollDuration === '3 Days' ? '7 Days' : '3 Days')} className="bg-gray-50 border border-gray-100 rounded-lg py-1 px-3 text-violet-600 cursor-pointer">
                  {pollDuration}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CRE_006 – Drafts List */}
        {currentView === 'DraftsList' && (
          <div className="flex-1 flex flex-col p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <button onClick={() => setCurrentView('CreatePost')} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
              <h3 className="text-sm font-bold text-gray-900">Saved Drafts</h3>
              <div className="w-5" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-1">
              {drafts.map(draft => (
                <div key={draft.id} className="border border-gray-150 rounded-xl p-3.5 bg-white shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-800">{draft.title}</h4>
                    <button onClick={() => setDrafts(drafts.filter(d => d.id !== draft.id))} className="text-red-500 hover:text-red-655 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal text-left">{draft.text}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-[10px] text-gray-400">
                    <span>{draft.date}</span>
                    <button onClick={() => { setPostText(draft.text); setCurrentView('CreatePost'); }} className="bg-violet-50 text-violet-600 font-bold px-2.5 py-1 rounded-md cursor-pointer hover:bg-violet-100">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
