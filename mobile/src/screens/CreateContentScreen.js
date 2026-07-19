import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Switch, 
  Dimensions, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

// Gallery photos mock data
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
  
  // CreatePost States
  const [postText, setPostText] = useState('');
  const [audience, setAudience] = useState('Public');
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [attachedMedia, setAttachedMedia] = useState([]); // List of photo URIs
  const [attachedVoice, setAttachedVoice] = useState(null); // Voice duration string
  const [attachedPoll, setAttachedPoll] = useState(null); // Poll object

  // Voice Recorder States
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceWaveform, setVoiceWaveform] = useState([20, 40, 15, 30, 50, 25, 45, 10, 35, 60, 20, 15]);

  // Video/Camera States
  const [cameraMode, setCameraMode] = useState('PHOTO'); // PHOTO, VIDEO
  const [cameraFlash, setCameraFlash] = useState('off');
  const [cameraZoom, setCameraZoom] = useState('1x');
  const [cameraTimer, setCameraTimer] = useState(0);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  // Gallery Picker States
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Poll Creator States
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [pollDuration, setPollDuration] = useState('3 Days');
  const [hideResults, setHideResults] = useState(false);

  // Drafts List States
  const [drafts, setDrafts] = useState([
    { id: 'd1', title: 'Road work on Anna Salai', text: 'Road renovation work is in progress. Plan your travel accordingly.', date: 'Updated 2m ago', type: 'Text' },
    { id: 'd2', title: 'Water Supply issue in Adyar', text: 'Water supply will be affected in Adyar, Besant Nagar.', date: 'Updated 1h ago', type: 'Text' },
    { id: 'd3', title: 'Chennai Rains 🌧️', text: 'Heavy rains expected this weekend. Stay safe.', date: 'Updated 3h ago', type: 'Text' },
  ]);

  // Voice Timer hook
  useEffect(() => {
    let interval;
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
        // Randomize waveform values slightly for live simulation
        setVoiceWaveform(prev => prev.map(() => Math.floor(Math.random() * 60) + 10));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  // Video Timer hook
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

  const handlePublish = () => {
    if (!postText.trim() && attachedMedia.length === 0 && !attachedPoll && !attachedVoice) {
      alert('Cannot publish empty post.');
      return;
    }
    // Create new post item
    const newPost = {
      id: `post_${Date.now()}`,
      authorName: 'Devasanjay',
      authorHandle: 'devasanjay',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: 'Just now',
      text: postText,
      image: attachedMedia[0] || null,
      images: attachedMedia.length > 1 ? attachedMedia : null,
      likes: 0,
      commentsCount: 0,
      shares: 0,
      awards: 0,
      isLiked: false,
      isFollowing: false,
    };
    onPublish(newPost);
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
    <View style={styles.container}>
      
      {/* CRE_001 – Create Post Screen */}
      {currentView === 'CreatePost' && (
        <View style={styles.subContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.headerAction}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Post</Text>
            <TouchableOpacity onPress={handlePublish} style={styles.postBtn}>
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* User Details */}
            <View style={styles.userSection}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }} 
                style={styles.userAvatar} 
              />
              <View style={styles.userMeta}>
                <Text style={styles.userName}>Devasanjay</Text>
                <TouchableOpacity style={styles.audienceSelector} onPress={() => setShowAudienceModal(true)}>
                  <Ionicons name="earth" size={12} color="#4B5563" />
                  <Text style={styles.audienceText}>{audience}</Text>
                  <Ionicons name="chevron-down" size={10} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Input Form */}
            <TextInput
              style={styles.textInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#9CA3AF"
              multiline
              value={postText}
              onChangeText={setPostText}
            />

            {/* Selected tags info */}
            {(selectedTopic || selectedLocation || selectedFeeling) && (
              <View style={styles.attachedMetaRow}>
                {selectedTopic && (
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>#{selectedTopic}</Text>
                  </View>
                )}
                {selectedLocation && (
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>📍 {selectedLocation}</Text>
                  </View>
                )}
                {selectedFeeling && (
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>😊 {selectedFeeling}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Attached media row preview */}
            {attachedMedia.length > 0 && (
              <View style={styles.mediaPreviewContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {attachedMedia.map((uri, idx) => (
                    <View key={idx} style={styles.mediaPreviewCard}>
                      <Image source={{ uri }} style={styles.mediaPreviewImg} />
                      <TouchableOpacity 
                        style={styles.removeMediaBtn}
                        onPress={() => setAttachedMedia(attachedMedia.filter(m => m !== uri))}
                      >
                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Attached voice preview */}
            {attachedVoice && (
              <View style={styles.voicePreviewCard}>
                <Ionicons name="volume-high" size={20} color="#7C3AED" />
                <Text style={styles.voicePreviewText}>Voice Note attached ({attachedVoice})</Text>
                <TouchableOpacity onPress={() => setAttachedVoice(null)}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}

            {/* Attached poll preview */}
            {attachedPoll && (
              <View style={styles.pollPreviewCard}>
                <Ionicons name="stats-chart" size={18} color="#7C3AED" />
                <View style={styles.pollPreviewMeta}>
                  <Text style={styles.pollPreviewQuestion} numberOfLines={1}>{attachedPoll.question}</Text>
                  <Text style={styles.pollPreviewCount}>{attachedPoll.options.length} options • {attachedPoll.duration}</Text>
                </View>
                <TouchableOpacity onPress={() => setAttachedPoll(null)}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}

            {/* Metadata tags toggles */}
            <View style={styles.tagsTogglesRow}>
              <TouchableOpacity style={styles.tagToggleBtn} onPress={() => setSelectedTopic('ChennaiRains')}>
                <Text style={styles.tagToggleText}># Add Topic</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tagToggleBtn} onPress={() => setSelectedLocation('Adyar, Chennai')}>
                <Text style={styles.tagToggleText}>📍 Add Location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tagToggleBtn} onPress={() => setSelectedFeeling('Excited')}>
                <Text style={styles.tagToggleText}>😊 Feeling</Text>
              </TouchableOpacity>
            </View>

            {/* Creation shortcuts Grid */}
            <View style={styles.creationGrid}>
              <TouchableOpacity style={styles.gridBtn} onPress={() => setCurrentView('ImagePicker')}>
                <View style={[styles.gridIconBg, { backgroundColor: '#3B82F615' }]}>
                  <Ionicons name="image-outline" size={22} color="#3B82F6" />
                </View>
                <Text style={styles.gridBtnLabel}>Photo/Video</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridBtn} onPress={() => setCurrentView('VoiceRecorder')}>
                <View style={[styles.gridIconBg, { backgroundColor: '#EF444415' }]}>
                  <Ionicons name="mic-outline" size={22} color="#EF4444" />
                </View>
                <Text style={styles.gridBtnLabel}>Voice</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridBtn} onPress={() => setCurrentView('PollCreator')}>
                <View style={[styles.gridIconBg, { backgroundColor: '#10B98115' }]}>
                  <Ionicons name="stats-chart-outline" size={22} color="#10B981" />
                </View>
                <Text style={styles.gridBtnLabel}>Poll</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridBtn} onPress={() => setCurrentView('VideoRecorder')}>
                <View style={[styles.gridIconBg, { backgroundColor: '#8B5CF615' }]}>
                  <Ionicons name="videocam-outline" size={22} color="#8B5CF6" />
                </View>
                <Text style={styles.gridBtnLabel}>Live</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridBtn} onPress={() => setCurrentView('DraftsList')}>
                <View style={[styles.gridIconBg, { backgroundColor: '#F59E0B15' }]}>
                  <Ionicons name="folder-open-outline" size={22} color="#F59E0B" />
                </View>
                <Text style={styles.gridBtnLabel}>Drafts</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridBtn} onPress={handleSaveDraft}>
                <View style={[styles.gridIconBg, { backgroundColor: '#6B728015' }]}>
                  <Ionicons name="save-outline" size={22} color="#6B7280" />
                </View>
                <Text style={styles.gridBtnLabel}>Save Draft</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Audience selection modal */}
          <Modal visible={showAudienceModal} transparent animationType="fade">
            <View style={styles.modalBg}>
              <View style={styles.audienceModalContent}>
                <Text style={styles.modalHeading}>Who can see this post?</Text>
                {['Public', 'Friends', 'Private'].map(aud => (
                  <TouchableOpacity 
                    key={aud} 
                    style={styles.audienceRow}
                    onPress={() => { setAudience(aud); setShowAudienceModal(false); }}
                  >
                    <Text style={styles.audienceRowText}>{aud}</Text>
                    {audience === aud && <Ionicons name="checkmark" size={18} color="#7C3AED" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </View>
      )}

      {/* CRE_002 – Voice Recorder Overlay */}
      {currentView === 'VoiceRecorder' && (
        <View style={[styles.subContainer, { backgroundColor: '#0F172A' }]}>
          {/* Header */}
          <View style={styles.darkHeader}>
            <TouchableOpacity onPress={() => setCurrentView('CreatePost')}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.darkHeaderTitle}>Voice Recorder</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.recorderBody}>
            <Text style={styles.recordStatusText}>
              {isVoiceRecording ? 'Recording...' : 'Tap to start'}
            </Text>
            <Text style={styles.recorderTimerText}>{formatTimer(voiceSeconds)}</Text>

            {/* Waveform Visualization */}
            <View style={styles.waveformContainer}>
              {voiceWaveform.map((val, idx) => (
                <View key={idx} style={[styles.waveformBar, { height: val }]} />
              ))}
            </View>

            <Text style={styles.tapTipText}>
              {isVoiceRecording ? 'Tap center mic to pause' : 'Tap mic button to record'}
            </Text>

            {/* Control buttons */}
            <View style={styles.recorderControls}>
              <TouchableOpacity 
                style={styles.recorderSideBtn}
                onPress={() => {
                  setVoiceSeconds(0);
                  setIsVoiceRecording(false);
                  alert('Recording deleted');
                }}
              >
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.micMainBtn}
                onPress={() => setIsVoiceRecording(!isVoiceRecording)}
              >
                <Ionicons name={isVoiceRecording ? "pause" : "mic"} size={32} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.recorderSideBtn}
                onPress={() => {
                  if (voiceSeconds === 0) {
                    alert('No recording to save.');
                    return;
                  }
                  setIsVoiceRecording(false);
                  setAttachedVoice(formatTimer(voiceSeconds));
                  setCurrentView('CreatePost');
                }}
              >
                <Ionicons name="checkmark" size={26} color="#10B981" />
              </TouchableOpacity>
            </View>

            <Text style={styles.slideCancelText}>Slide up to cancel</Text>
          </View>
        </View>
      )}

      {/* CRE_003 – Video / Photo Camera Recorder */}
      {currentView === 'VideoRecorder' && (
        <View style={styles.subContainer}>
          {/* Mock Camera Viewfinder */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80' }} 
            style={styles.cameraViewfinder} 
          />

          {/* Camera Overlay Elements */}
          <View style={styles.cameraHeaderOverlay}>
            <TouchableOpacity onPress={() => setCurrentView('CreatePost')}>
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.cameraTimerText}>{formatTimer(cameraTimer)}</Text>
            <TouchableOpacity onPress={() => setCameraFlash(cameraFlash === 'off' ? 'on' : 'off')}>
              <Ionicons name={cameraFlash === 'on' ? "flash" : "flash-off"} size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Right Controls */}
          <View style={styles.cameraRightControls}>
            <TouchableOpacity style={styles.cameraIconBtn} onPress={() => setCameraZoom(cameraZoom === '1x' ? '2x' : '1x')}>
              <Text style={styles.cameraZoomText}>{cameraZoom}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraIconBtn}>
              <Ionicons name="color-filter" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Bottom Bar Controls */}
          <View style={styles.cameraBottomControls}>
            {/* Gallery bubble */}
            <TouchableOpacity style={styles.galleryPreviewBubble} onPress={() => setCurrentView('ImagePicker')}>
              <Image source={{ uri: galleryPhotos[0].uri }} style={styles.galleryBubbleImg} />
            </TouchableOpacity>

            {/* Shutter btn */}
            <TouchableOpacity 
              style={styles.shutterContainer}
              onPress={() => {
                if (cameraMode === 'VIDEO') {
                  if (isRecordingVideo) {
                    setIsRecordingVideo(false);
                    setCameraTimer(0);
                    setAttachedMedia([galleryPhotos[2].uri]); // Attach mock recorded video preview
                    setCurrentView('CreatePost');
                  } else {
                    setIsRecordingVideo(true);
                  }
                } else {
                  setAttachedMedia([galleryPhotos[1].uri]); // Attach mock snapshot
                  setCurrentView('CreatePost');
                }
              }}
            >
              <View style={[styles.shutterInner, cameraMode === 'VIDEO' && { backgroundColor: '#EF4444', borderRadius: 4 }]}>
                {cameraMode === 'VIDEO' && isRecordingVideo && <View style={styles.shutterRecordingDot} />}
              </View>
            </TouchableOpacity>

            {/* Flip toggle */}
            <TouchableOpacity style={styles.flipCameraBtn}>
              <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Mode Selector */}
          <View style={styles.cameraModeRow}>
            {['PHOTO', 'VIDEO'].map(m => (
              <TouchableOpacity key={m} style={styles.cameraModeItem} onPress={() => setCameraMode(m)}>
                <Text style={[styles.cameraModeText, cameraMode === m && styles.cameraModeTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* CRE_004 – Image Gallery Picker */}
      {currentView === 'ImagePicker' && (
        <View style={styles.subContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentView('CreatePost')}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gallery</Text>
            <TouchableOpacity 
              onPress={() => {
                if (selectedPhotos.length === 0) {
                  alert('No photos selected.');
                  return;
                }
                setAttachedMedia(selectedPhotos);
                setCurrentView('CreatePost');
              }}
              style={styles.galleryNextBtn}
            >
              <Text style={styles.galleryNextText}>Next</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.galleryTabsRow}>
            {['Gallery', 'Albums', 'Recent'].map((t, idx) => (
              <TouchableOpacity key={idx} style={styles.galleryTab}>
                <Text style={[styles.galleryTabText, idx === 0 && styles.galleryTabTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Photos Grid */}
          <ScrollView style={styles.galleryScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.galleryPhotosGrid}>
              {galleryPhotos.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.uri);
                return (
                  <TouchableOpacity 
                    key={photo.id} 
                    style={styles.photoGridCell}
                    onPress={() => selectPhoto(photo.uri)}
                  >
                    <Image source={{ uri: photo.uri }} style={styles.gridCellImg} />
                    {isSelected && (
                      <View style={styles.selectionCheckBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#7C3AED" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom selection count panel */}
          {selectedPhotos.length > 0 && (
            <View style={styles.gallerySelectedPanel}>
              <Text style={styles.selectedCountText}>Selected ({selectedPhotos.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryThumbnailScroll}>
                {selectedPhotos.map((uri, idx) => (
                  <View key={idx} style={styles.selectedThumbnailContainer}>
                    <Image source={{ uri }} style={styles.selectedThumbnailImg} />
                    <TouchableOpacity style={styles.removeThumbnailBadge} onPress={() => selectPhoto(uri)}>
                      <Ionicons name="close" size={10} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* CRE_005 – Poll Creator Form */}
      {currentView === 'PollCreator' && (
        <View style={styles.subContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentView('CreatePost')}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Poll</Text>
            <TouchableOpacity onPress={handleSavePoll} style={styles.pollNextBtn}>
              <Text style={styles.pollNextText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Poll question input */}
            <View style={styles.pollInputSection}>
              <Text style={styles.pollInputLabel}>Enter your question</Text>
              <TextInput 
                style={styles.pollTextInput}
                placeholder="e.g. What is the biggest issue in your area?"
                placeholderTextColor="#9CA3AF"
                value={pollQuestion}
                onChangeText={setPollQuestion}
              />
            </View>

            {/* Poll options inputs */}
            <View style={styles.pollInputSection}>
              <Text style={styles.pollInputLabel}>Poll Options</Text>
              {pollOptions.map((opt, idx) => (
                <View key={idx} style={styles.optionInputRow}>
                  <TextInput
                    style={styles.optionTextInput}
                    placeholder={`Option ${idx + 1}`}
                    placeholderTextColor="#9CA3AF"
                    value={opt}
                    onChangeText={text => {
                      const updated = [...pollOptions];
                      updated[idx] = text;
                      setPollOptions(updated);
                    }}
                  />
                  {pollOptions.length > 2 && (
                    <TouchableOpacity 
                      onPress={() => setPollOptions(pollOptions.filter((_, oIdx) => oIdx !== idx))}
                      style={styles.deleteOptionBtn}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {pollOptions.length < 10 && (
                <TouchableOpacity style={styles.addOptionBtn} onPress={handleAddOption}>
                  <Ionicons name="add" size={16} color="#7C3AED" />
                  <Text style={styles.addOptionText}>Add Option</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Toggles */}
            <View style={styles.pollToggleRow}>
              <Text style={styles.pollToggleLabel}>Allow multiple answers</Text>
              <Switch value={allowMultiple} onValueChange={setAllowMultiple} trackColor={{ true: '#7C3AED' }} />
            </View>

            <View style={styles.pollToggleRow}>
              <Text style={styles.pollToggleLabel}>Hide results</Text>
              <Switch value={hideResults} onValueChange={setHideResults} trackColor={{ true: '#7C3AED' }} />
            </View>

            <View style={styles.pollDurationSelector}>
              <Text style={styles.pollToggleLabel}>Poll duration</Text>
              <TouchableOpacity style={styles.durationTrigger} onPress={() => setPollDuration(pollDuration === '3 Days' ? '7 Days' : '3 Days')}>
                <Text style={styles.durationValue}>{pollDuration}</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* CRE_006 – Drafts List */}
      {currentView === 'DraftsList' && (
        <View style={styles.subContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentView('CreatePost')}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Drafts</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Drafts List scroll */}
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.draftsCountText}>{drafts.length} Drafts available</Text>
            {drafts.map((draft) => (
              <View key={draft.id} style={styles.draftCard}>
                <View style={styles.draftCardHeader}>
                  <Text style={styles.draftCardTitle}>{draft.title}</Text>
                  <TouchableOpacity onPress={() => setDrafts(drafts.filter(d => d.id !== draft.id))}>
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.draftCardDesc}>{draft.text}</Text>
                <View style={styles.draftCardFooter}>
                  <Text style={styles.draftCardDate}>{draft.date}</Text>
                  <TouchableOpacity 
                    style={styles.useDraftBtn}
                    onPress={() => {
                      setPostText(draft.text);
                      setCurrentView('CreatePost');
                    }}
                  >
                    <Text style={styles.useDraftText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  subContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    height: 90,
    paddingTop: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  headerAction: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  postBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userMeta: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  audienceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  audienceText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  textInput: {
    fontSize: 15,
    color: '#1F2937',
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
    margin: 0,
  },
  attachedMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  metaBadge: {
    backgroundColor: '#7C3AED10',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
  },
  mediaPreviewContainer: {
    height: 100,
    marginVertical: 12,
  },
  mediaPreviewCard: {
    position: 'relative',
    marginRight: 10,
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mediaPreviewImg: {
    width: '100%',
    height: '100%',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  voicePreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },
  voicePreviewText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  pollPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },
  pollPreviewMeta: {
    flex: 1,
    marginLeft: 12,
  },
  pollPreviewQuestion: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  pollPreviewCount: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  tagsTogglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  tagToggleBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  tagToggleText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  creationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  gridBtn: {
    width: '48%',
    backgroundColor: '#FAFBFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  gridIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridBtnLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '700',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audienceModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '80%',
    padding: 20,
  },
  modalHeading: {
    fontSize: 14,
    fontWeight: '750',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  audienceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  audienceRowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  darkHeader: {
    flexDirection: 'row',
    height: 90,
    paddingTop: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  darkHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  recorderBody: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  recordStatusText: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 8,
  },
  recorderTimerText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginVertical: 40,
    width: '100%',
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#7C3AED',
    marginHorizontal: 3,
    borderRadius: 1.5,
  },
  tapTipText: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 30,
  },
  recorderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  recorderSideBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micMainBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideCancelText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 40,
  },
  cameraViewfinder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cameraHeaderOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    height: 100,
    alignItems: 'center',
  },
  cameraTimerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cameraRightControls: {
    position: 'absolute',
    right: 20,
    top: 150,
    spaceY: 16,
  },
  cameraIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraZoomText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cameraBottomControls: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  galleryPreviewBubble: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  galleryBubbleImg: {
    width: '100%',
    height: '100%',
  },
  shutterContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterRecordingDot: {
    width: 16,
    height: 16,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  flipCameraBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraModeRow: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  cameraModeItem: {
    marginHorizontal: 16,
  },
  cameraModeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
  },
  cameraModeTextActive: {
    color: '#FFFFFF',
  },
  galleryNextBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },
  galleryNextText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  galleryTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  galleryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  galleryTabText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  galleryTabTextActive: {
    color: '#7C3AED',
  },
  galleryScroll: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  galleryPhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  photoGridCell: {
    width: '33.3%',
    height: 120,
    padding: 2,
    position: 'relative',
  },
  gridCellImg: {
    width: '100%',
    height: '100%',
  },
  selectionCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  gallerySelectedPanel: {
    height: 120,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  galleryThumbnailScroll: {
    alignItems: 'center',
  },
  selectedThumbnailContainer: {
    position: 'relative',
    marginRight: 10,
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedThumbnailImg: {
    width: '100%',
    height: '100%',
  },
  removeThumbnailBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollNextBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pollNextText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pollInputSection: {
    marginBottom: 20,
  },
  pollInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  pollTextInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  optionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  deleteOptionBtn: {
    marginLeft: 10,
    padding: 4,
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addOptionText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '700',
    marginLeft: 6,
  },
  pollToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pollToggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  pollDurationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  durationTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  durationValue: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '700',
    marginRight: 6,
  },
  draftsCountText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  draftCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  draftCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  draftCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  draftCardDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 16,
  },
  draftCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  draftCardDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  useDraftBtn: {
    backgroundColor: '#7C3AED10',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  useDraftText: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
  },
});
