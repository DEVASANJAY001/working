import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  ChevronRight, Award, Trophy, Settings, Users, 
  Plus, Shield, Sparkles, ArrowLeft, LogOut, X 
} from 'lucide-react';
import { Avatar } from '../atoms';

export default function MobileProfileDrawer({ 
  isOpen, 
  onClose, 
  currentUser, 
  onGoToSettings, // triggers settings page
  onLogout 
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240); // matches slide animation duration
  };

  if (!isOpen) return null;

  const displayUserName = currentUser?.displayName || currentUser?.name || 'Devasanjay';
  const userHandle = currentUser?.username || 'devasanjay14';
  const userInitial = displayUserName.charAt(0).toUpperCase();

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[600] bg-black/50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />

      {/* Drawer Body - Full height, slide from right */}
      <div 
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-[380px] bg-gray-50 z-[601] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isClosing ? 'animate-slide-left' : 'animate-slide-right'
        }`}
        style={{ animationDirection: isClosing ? 'reverse' : 'normal' }}
      >
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <span className="text-base font-black text-gray-900">Profile</span>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-safe space-y-4">
          
          {/* User Bio Card */}
          <div className="bg-white p-4 border-b border-gray-100 flex flex-col items-center text-center relative">
            <div className="relative mb-2">
              <Avatar src={currentUser?.profileImage} initials={userInitial} size="lg" isOnline={true} />
            </div>
            
            <h3 className="text-base font-black text-gray-900">{displayUserName}</h3>
            <p className="text-xs text-gray-500">@{userHandle}</p>

            {/* Account Settings Shortcut button */}
            <button 
              onClick={() => { handleClose(); onGoToSettings(); }}
              className="mt-3 px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              Account Settings
            </button>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2 w-full mt-4 pt-4 border-t border-gray-50 text-center">
              <div>
                <p className="text-xs font-black text-gray-900">0</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Followers</p>
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">1</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Karma</p>
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">0</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Contribs</p>
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">2 y</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Reddit Age</p>
              </div>
            </div>

            {/* Active in link */}
            <div className="w-full flex items-center justify-between mt-3 text-xs font-bold text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100">
              <span>Active in</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Achievements Accordion */}
          <div className="bg-white p-4 border-y border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Achievements</h4>
              <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-1.5 py-0.5 rounded">11 unlocked</span>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-xl border border-yellow-100 text-xs font-bold">
                🍌 Banana Beginner
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100 text-xs font-bold">
                🔗 New Share
              </div>
            </div>
            <p className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">View All</p>
          </div>

          {/* Settings Section */}
          <div className="bg-white border-y border-gray-100 divide-y divide-gray-50 text-xs font-bold text-gray-700">
            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
              <div>
                <p className="text-gray-900 font-extrabold">Profile</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Customize your profile</p>
              </div>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-[10px] font-black">Update</button>
            </div>
            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
              <div>
                <p className="text-gray-900 font-extrabold">Curate your profile</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Manage what people see</p>
              </div>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-[10px] font-black">Update</button>
            </div>
            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
              <div>
                <p className="text-gray-900 font-extrabold">Avatar</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Style your avatar</p>
              </div>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-[10px] font-black">Update</button>
            </div>
            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
              <div>
                <p className="text-gray-900 font-extrabold">Mod Tools</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Moderate your profile</p>
              </div>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-[10px] font-black">Update</button>
            </div>
            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
              <div>
                <p className="text-gray-900 font-extrabold">SOCIAL LINKS</p>
              </div>
              <button className="px-3 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-full text-[10px] font-black flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Link
              </button>
            </div>
          </div>

          {/* Moderating Section */}
          <div className="bg-white p-4 border-y border-gray-100 space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Moderating</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-gray-900">cjppartyy</p>
                  <p className="text-[10px] text-gray-400 font-semibold">1 member</p>
                </div>
                <span className="text-[10px] text-green-600 font-black bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Joined</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-gray-900">hfsnrndijd</p>
                  <p className="text-[10px] text-gray-400 font-semibold">1 member</p>
                </div>
                <span className="text-[10px] text-green-600 font-black bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Joined</span>
              </div>
            </div>
          </div>

          {/* Trophy Case Section */}
          <div className="bg-white p-4 border-y border-gray-100 space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Trophy Case</h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-lg shadow-sm border border-orange-100">🏆</div>
              <div>
                <p className="text-xs font-black text-gray-900">Two-Year Club</p>
              </div>
            </div>
          </div>

          {/* Log Out */}
          <div className="p-4 bg-white border-t border-gray-100">
            <button 
              onClick={() => { handleClose(); onLogout(); }}
              className="w-full py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-black hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>

        </div>
      </div>
    </>,
    document.body
  );
}
