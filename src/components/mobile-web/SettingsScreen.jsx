import React, { useState } from 'react';
import { 
  ChevronRight, ExternalLink, Check, X, Shield, ArrowLeft,
  Smartphone, QrCode, Copy, Search,
  Trash2, Eye, EyeOff
} from 'lucide-react';
import { DashboardLayout, Button, Modal } from '../atomic';

export default function SettingsScreen({ 
  currentUser, 
  onLogout, 
  onCreatePress, 
  onGoToAdmin, 
  onGoToFeed,
  initialTab = 'Account'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // ── Profile / Privacy / Prefs state ──────────────────────────────
  const [displayName, setDisplayName] = useState(currentUser?.name || 'Devasanjay');
  const [aboutBio, setAboutBio] = useState(currentUser?.bio || '');
  const [allowFollow, setAllowFollow] = useState(true);
  const [nsfwFilter, setNsfwFilter] = useState(false);
  const [showFollowers, setShowFollowers] = useState(true);
  const [nsfwProfile, setNsfwProfile] = useState(false);
  const [showActiveCommunities, setShowActiveCommunities] = useState(true);
  const [showMatureContent, setShowMatureContent] = useState(true);
  const [blurMatureMedia, setBlurMatureMedia] = useState(true);
  const [showHomeRecommendations, setShowHomeRecommendations] = useState(true);
  const [autoplayMedia, setAutoplayMedia] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [openNewTab, setOpenNewTab] = useState(true);
  const [markdownEditor, setMarkdownEditor] = useState(false);
  const [oldRedditDefault, setOldRedditDefault] = useState(false);

  // ── Account tab state ─────────────────────────────────────────────
  const [googleConnected, setGoogleConnected] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Gender
  const [gender, setGender] = useState('Man');
  const [genderModal, setGenderModal] = useState(false);
  const [customGender, setCustomGender] = useState('');

  // Location
  const COUNTRIES = [
    'No location specified','Afghanistan','Åland Islands','Albania','Algeria','American Samoa',
    'Andorra','Angola','Anguilla','Antarctica','Antigua and Barbuda','Argentina','Armenia',
    'Aruba','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados',
    'Belarus','Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia and Herzegovina',
    'Botswana','Brazil','British Indian Ocean Territory','Brunei','Bulgaria','Burkina Faso',
    'Burundi','Cambodia','Cameroon','Canada','Cape Verde','Cayman Islands','Chad','Chile',
    'China','Christmas Island','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba',
    'Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador',
    'Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Falkland Islands',
    'Faroe Islands','Fiji','Finland','France','French Guiana','French Polynesia','Gabon',
    'Gambia','Georgia','Germany','Ghana','Gibraltar','Greece','Greenland','Grenada',
    'Guadeloupe','Guam','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras',
    'Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel',
    'Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait',
    'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein',
    'Lithuania','Luxembourg','Macau','Madagascar','Malawi','Malaysia','Maldives','Mali',
    'Malta','Marshall Islands','Martinique','Mauritania','Mauritius','Mexico','Micronesia',
    'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia',
    'Nauru','Nepal','Netherlands','New Caledonia','New Zealand','Nicaragua','Niger','Nigeria',
    'Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay',
    'Peru','Philippines','Poland','Portugal','Puerto Rico','Qatar','Romania','Russia','Rwanda',
    'Samoa','San Marino','Saudi Arabia','Senegal','Serbia','Sierra Leone','Singapore',
    'Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','Spain',
    'Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan',
    'Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia',
    'Turkey','Turkmenistan','Uganda','Ukraine','United Arab Emirates','United Kingdom',
    'United States','Uruguay','Uzbekistan','Vanuatu','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
  ];
  const [location, setLocation] = useState('Use approximate location (based on IP)');
  const [locationModal, setLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationMode, setLocationMode] = useState('ip'); // 'ip' | 'none' | 'country'

  // Email change modal flow
  const [emailModal, setEmailModal] = useState(false);
  // emailStep: 'info' | 'verify-current' | 'enter-new' | 'verify-new' | 'success'
  const [emailStep, setEmailStep] = useState('info');
  const [currentEmailOtp, setCurrentEmailOtp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmailOtp, setNewEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState('');
  const openEmailModal = () => { setEmailStep('info'); setEmailOtpSent(false); setCurrentEmailOtp(''); setNewEmail(''); setNewEmailOtp(''); setEmailOtpError(''); setEmailModal(true); };

  // Google modal
  const [googleModal, setGoogleModal] = useState(false);
  // googleModalType: 'connect' | 'disconnect'
  const [googleModalType, setGoogleModalType] = useState('connect');
  const [googlePickerAccount, setGooglePickerAccount] = useState(null);
  const GOOGLE_ACCOUNTS = [
    { id: 1, name: currentUser?.name || 'Devasanjay', email: currentUser?.email || 'devasanjay14@gmail.com', avatar: 'D' },
    { id: 2, name: 'Work Account', email: 'dev@workspace.com', avatar: 'W' },
  ];

  // 2FA modal
  const [tfaModal, setTfaModal] = useState(false);
  const [tfaStep, setTfaStep] = useState('setup'); // 'setup' | 'verify' | 'done'
  const [tfaCode, setTfaCode] = useState('');
  const FAKE_SECRET = 'JBSWY3DPEHPK3PXP';
  const BACKUP_CODES = ['4F2A-B31C', '8D7E-1A9F', '3C6B-D42E', '9E1A-F73B', '2B8D-C54A'];

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

  // ── EMAIL MODAL RENDERER ─────────────────────────────────────────
  const renderEmailModal = () => {
    const userEmail = currentUser?.email || 'devasanjay14@gmail.com';

    const handleSendCurrentOtp = () => {
      setEmailOtpSent(true);
      setEmailOtpError('');
      setEmailStep('verify-current');
    };
    const handleVerifyCurrentOtp = () => {
      if (currentEmailOtp.length < 4) { setEmailOtpError('Please enter the full OTP.'); return; }
      // Simulate OTP check — '1234' = valid
      if (currentEmailOtp === '1234') { setEmailOtpError(''); setEmailStep('enter-new'); }
      else { setEmailOtpError('Incorrect OTP. Please try again.'); }
    };
    const handleSendNewOtp = () => {
      if (!newEmail.includes('@')) { setEmailOtpError('Please enter a valid email.'); return; }
      setEmailOtpError('');
      setEmailStep('verify-new');
    };
    const handleVerifyNewOtp = () => {
      if (newEmailOtp.length < 4) { setEmailOtpError('Please enter the full OTP.'); return; }
      if (newEmailOtp === '1234') { setEmailOtpError(''); setEmailStep('success'); }
      else { setEmailOtpError('Incorrect OTP. Please try again.'); }
    };

    return (
      <Modal isOpen={emailModal} onClose={() => setEmailModal(false)}
        title={emailStep === 'success' ? '✅ Email Changed' : 'Change your email address'}
      >
        {emailStep === 'info' && (
          <div className="space-y-5">
            <p className="text-sm text-gray-600">To change your email address, we will send a verification OTP to <strong>{userEmail}</strong>. We'll walk you through it.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEmailModal(false)} className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleSendCurrentOtp} className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700">Continue</button>
            </div>
          </div>
        )}
        {emailStep === 'verify-current' && (
          <div className="space-y-5">
            <p className="text-sm text-gray-600">We sent a 4-digit OTP to <strong>{userEmail}</strong>. Enter it below to verify ownership.</p>
            <p className="text-xs text-orange-500 italic">(Demo: use OTP <strong>1234</strong>)</p>
            <input
              type="text" maxLength={6} value={currentEmailOtp}
              onChange={e => setCurrentEmailOtp(e.target.value.replace(/\D/g,''))}
              placeholder="Enter OTP"
              className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-sm text-center tracking-widest focus:outline-none focus:border-orange-400 bg-gray-50"
            />
            {emailOtpError && <p className="text-xs text-red-500">{emailOtpError}</p>}
            <div className="flex justify-end gap-3">
              <button onClick={() => setEmailModal(false)} className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleVerifyCurrentOtp} className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700">Verify</button>
            </div>
          </div>
        )}
        {emailStep === 'enter-new' && (
          <div className="space-y-5">
            <p className="text-sm text-gray-600">Enter your new email address. We'll send a verification OTP to confirm.</p>
            <input
              type="email" value={newEmail}
              onChange={e => { setNewEmail(e.target.value); setEmailOtpError(''); }}
              placeholder="New email address"
              className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
            />
            {emailOtpError && <p className="text-xs text-red-500">{emailOtpError}</p>}
            <div className="flex justify-end gap-3">
              <button onClick={() => setEmailModal(false)} className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleSendNewOtp} className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700">Send OTP</button>
            </div>
          </div>
        )}
        {emailStep === 'verify-new' && (
          <div className="space-y-5">
            <p className="text-sm text-gray-600">We sent a 4-digit OTP to <strong>{newEmail}</strong>. Enter it below to confirm the change.</p>
            <p className="text-xs text-orange-500 italic">(Demo: use OTP <strong>1234</strong>)</p>
            <input
              type="text" maxLength={6} value={newEmailOtp}
              onChange={e => setNewEmailOtp(e.target.value.replace(/\D/g,''))}
              placeholder="Enter OTP"
              className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-sm text-center tracking-widest focus:outline-none focus:border-orange-400 bg-gray-50"
            />
            {emailOtpError && <p className="text-xs text-red-500">{emailOtpError}</p>}
            <div className="flex justify-end gap-3">
              <button onClick={() => setEmailModal(false)} className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleVerifyNewOtp} className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700">Confirm</button>
            </div>
          </div>
        )}
        {emailStep === 'success' && (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-sm text-gray-700">Your email address has been updated to <strong>{newEmail}</strong>.</p>
            <button onClick={() => setEmailModal(false)} className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700">Done</button>
          </div>
        )}
      </Modal>
    );
  };

  // ── GENDER MODAL RENDERER ────────────────────────────────────────
  const renderGenderModal = () => {
    const options = ['Woman', 'Man', 'Non-binary', 'I prefer not to say'];
    return (
      <Modal isOpen={genderModal} onClose={() => setGenderModal(false)} title="Gender" size="sm">
        <div className="space-y-4">
          <p className="text-xs text-gray-500">This information may be used to improve your recommendations and ads.</p>
          <div className="space-y-2">
            {options.map(opt => (
              <button key={opt} onClick={() => setGender(opt)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  gender === opt ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  gender === opt ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {gender === opt && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                {opt}
              </button>
            ))}
            {/* I refer to myself as */}
            <div className={`rounded-xl border px-4 py-3 ${ gender === '__custom' ? 'border-orange-400 bg-orange-50' : 'border-gray-200' }`}>
              <button onClick={() => setGender('__custom')} className="flex items-center gap-3 w-full text-sm font-semibold text-gray-700 cursor-pointer">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  gender === '__custom' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {gender === '__custom' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                I refer to myself as...
              </button>
              {gender === '__custom' && (
                <input
                  autoFocus
                  type="text" value={customGender} onChange={e => setCustomGender(e.target.value)}
                  placeholder="Enter your identity"
                  className="mt-2 w-full py-1.5 px-3 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400 bg-white"
                />
              )}
            </div>
          </div>
          <button
            onClick={() => setGenderModal(false)}
            className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700"
          >
            Save
          </button>
        </div>
      </Modal>
    );
  };

  // ── LOCATION MODAL RENDERER ──────────────────────────────────────
  const renderLocationModal = () => {
    const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(locationSearch.toLowerCase()));
    return (
      <Modal isOpen={locationModal} onClose={() => setLocationModal(false)} title="Location customization" size="md">
        <div className="space-y-4">
          <p className="text-xs text-gray-500">Specify a location to customize your feeds. Reddit does not track your precise geolocation data.</p>
          {/* Mode selector */}
          <div className="space-y-2">
            {[{id:'ip', label:'Use approximate location (based on IP)'}, {id:'none', label:'No location specified'}].map(m => (
              <button key={m.id} onClick={() => { setLocationMode(m.id); setLocation(m.label); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  locationMode === m.id ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  locationMode === m.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {locationMode === m.id && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                {m.label}
              </button>
            ))}
          </div>
          {/* Country search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={locationSearch} onChange={e => setLocationSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-orange-400"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 no-scrollbar">
            {filtered.map(country => (
              <button key={country}
                onClick={() => { setLocation(country); setLocationMode('country'); }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  location === country && locationMode === 'country' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
          <button onClick={() => setLocationModal(false)} className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700">Save</button>
        </div>
      </Modal>
    );
  };

  // ── GOOGLE MODAL RENDERER ────────────────────────────────────────
  const renderGoogleModal = () => {
    if (googleModalType === 'connect') {
      return (
        <Modal isOpen={googleModal} onClose={() => setGoogleModal(false)} title="" size="sm">
          <div className="space-y-5">
            {/* Google-style header */}
            <div className="text-center space-y-1">
              <div className="flex justify-center mb-3">
                <svg width="40" height="40" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.6 0 6.8 1.2 9.3 3.6l6.9-6.9C36.1 2.4 30.4 0 24 0 14.7 0 6.7 5.4 2.9 13.3l8 6.2C12.8 13.1 17.9 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7C35.9 32 33.3 35 29.5 37l7.8 6.1C42.3 39 46.5 32.3 46.5 24.5z"/><path fill="#FBBC05" d="M10.9 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-8-6.2C1 16.4 0 20.1 0 24s1 7.6 2.9 10.8l8-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.8-6.1c-2.1 1.4-4.9 2.3-8.1 2.3-6.1 0-11.2-3.6-13.1-9l-8 6.2C6.7 42.6 14.7 48 24 48z"/></svg>
              </div>
              <h3 className="text-base font-black text-gray-900">Sign in with Google</h3>
              <p className="text-xs text-gray-500">Choose a Google account to link with Inspire</p>
            </div>
            {/* Account picker */}
            <div className="space-y-2">
              {GOOGLE_ACCOUNTS.map(acc => (
                <button key={acc.id}
                  onClick={() => setGooglePickerAccount(acc.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                    googlePickerAccount === acc.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-base flex-shrink-0">{acc.avatar}</div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{acc.name}</p>
                    <p className="text-xs text-gray-500">{acc.email}</p>
                  </div>
                  {googlePickerAccount === acc.id && <Check className="w-4 h-4 text-blue-500 ml-auto" />}
                </button>
              ))}
            </div>
            <button
              disabled={!googlePickerAccount}
              onClick={() => { setGoogleConnected(true); setGoogleModal(false); setGooglePickerAccount(null); }}
              className="w-full py-2.5 bg-[#4285F4] disabled:opacity-40 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Link Account
            </button>
          </div>
        </Modal>
      );
    }
    // disconnect
    return (
      <Modal isOpen={googleModal} onClose={() => setGoogleModal(false)} title="Disconnect Google account" size="sm">
        <div className="space-y-5">
          <p className="text-sm text-gray-600">To disconnect your Google account, you need to create an Inspire password first so you can still log in. We'll walk you through it.</p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-700">Steps:</p>
            <ol className="text-xs text-gray-500 space-y-1 list-decimal pl-4">
              <li>Create an account password via the email link we send</li>
              <li>Confirm the password</li>
              <li>Your Google account will be unlinked</li>
            </ol>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setGoogleModal(false)} className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button onClick={() => { setGoogleConnected(false); setGoogleModal(false); }} className="px-5 py-2 bg-red-500 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-red-600">Disconnect</button>
          </div>
        </div>
      </Modal>
    );
  };

  // ── 2FA MODAL RENDERER ───────────────────────────────────────────
  const renderTfaModal = () => (
    <Modal isOpen={tfaModal} onClose={() => { setTfaModal(false); setTfaStep('setup'); }} title="Two-Factor Authentication" size="md">
      {tfaStep === 'setup' && (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">Secure your account with Google Authenticator. Scan the QR code below with your authenticator app.</p>
          {/* Fake QR code placeholder */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-36 h-36 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
              <QrCode className="w-20 h-20 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">Can't scan? Enter this key manually:</p>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
              <code className="text-xs font-mono text-gray-700 tracking-widest">{FAKE_SECRET}</code>
              <button onClick={() => navigator.clipboard?.writeText(FAKE_SECRET)} className="cursor-pointer">
                <Copy className="w-3.5 h-3.5 text-gray-500 hover:text-gray-800" />
              </button>
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-xs font-bold text-orange-700 mb-2">Backup Codes (save these!):</p>
            <div className="grid grid-cols-2 gap-1">
              {BACKUP_CODES.map(c => <code key={c} className="text-xs font-mono bg-white rounded px-2 py-1 text-gray-700">{c}</code>)}
            </div>
          </div>
          <button onClick={() => setTfaStep('verify')} className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700">Next — Verify Code</button>
        </div>
      )}
      {tfaStep === 'verify' && (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">Enter the 6-digit code from your Google Authenticator app to complete setup.</p>
          <p className="text-xs text-orange-500 italic">(Demo: use code <strong>123456</strong>)</p>
          <input
            type="text" maxLength={6} value={tfaCode}
            onChange={e => setTfaCode(e.target.value.replace(/\D/g,''))}
            placeholder="000000"
            className="w-full py-3 px-4 border border-gray-200 rounded-xl text-lg font-mono text-center tracking-[0.5em] focus:outline-none focus:border-orange-400 bg-gray-50"
          />
          <div className="flex gap-3">
            <button onClick={() => setTfaStep('setup')} className="flex-1 py-2.5 border border-gray-300 rounded-full text-sm font-bold cursor-pointer hover:bg-gray-50">Back</button>
            <button onClick={() => { if(tfaCode === '123456'){ setTfaStep('done'); setTwoFactor(true); } }}
              className="flex-1 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700"
            >Verify</button>
          </div>
        </div>
      )}
      {tfaStep === 'done' && (
        <div className="text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7 text-green-600" />
          </div>
          <p className="text-sm font-bold text-gray-800">Two-factor authentication enabled!</p>
          <p className="text-xs text-gray-500">Your account is now protected with an extra layer of security.</p>
          <button onClick={() => { setTfaModal(false); setTfaStep('setup'); }} className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold cursor-pointer hover:bg-gray-700">Done</button>
        </div>
      )}
    </Modal>
  );

  const renderAccountTab = () => (
    <div className="space-y-6 animate-fade-in text-gray-800 text-sm">
      {/* ── Modals ─────────────────────────────────────────────── */}
      {renderEmailModal()}
      {renderGenderModal()}
      {renderLocationModal()}
      {renderGoogleModal()}
      {renderTfaModal()}

      {/* ── General ─────────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">General</h3>
        <div className="space-y-1">
          {/* Email */}
          <div
            onClick={openEmailModal}
            className="flex items-center justify-between pb-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors"
          >
            <div>
              <p className="font-bold text-gray-800">Email address</p>
              <p className="text-xs text-gray-500">{currentUser?.email || 'devasanjay14@gmail.com'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Gender */}
          <div
            onClick={() => setGenderModal(true)}
            className="flex items-center justify-between pb-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors"
          >
            <div>
              <p className="font-bold text-gray-800">Gender</p>
              <p className="text-xs text-gray-500">{gender === '__custom' ? customGender || 'Custom' : gender}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Location */}
          <div
            onClick={() => setLocationModal(true)}
            className="flex items-center justify-between border-b border-gray-50 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors"
          >
            <div>
              <p className="font-bold text-gray-800">Location customization</p>
              <p className="text-xs text-gray-500">{location}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ── Account Authorization ────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Account authorization</h3>
        <div className="space-y-1">
          {/* Google */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-50 p-3">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.6 0 6.8 1.2 9.3 3.6l6.9-6.9C36.1 2.4 30.4 0 24 0 14.7 0 6.7 5.4 2.9 13.3l8 6.2C12.8 13.1 17.9 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7C35.9 32 33.3 35 29.5 37l7.8 6.1C42.3 39 46.5 32.3 46.5 24.5z"/><path fill="#FBBC05" d="M10.9 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-8-6.2C1 16.4 0 20.1 0 24s1 7.6 2.9 10.8l8-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.8-6.1c-2.1 1.4-4.9 2.3-8.1 2.3-6.1 0-11.2-3.6-13.1-9l-8 6.2C6.7 42.6 14.7 48 24 48z"/></svg>
              <div>
                <p className="font-bold text-gray-800">Google</p>
                <p className="text-xs text-gray-500">{googleConnected ? 'Connected · ' + (currentUser?.email || 'devasanjay14@gmail.com') : 'Connect to log in with your Google account'}</p>
              </div>
            </div>
            <button
              onClick={() => { setGoogleModalType(googleConnected ? 'disconnect' : 'connect'); setGoogleModal(true); }}
              className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-black hover:bg-gray-50 cursor-pointer whitespace-nowrap"
            >
              {googleConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-50 p-3">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-bold text-gray-800">Two-factor authentication</p>
                <p className="text-xs text-gray-500">{twoFactor ? 'Active · Google Authenticator' : 'Add extra security with an authenticator app'}</p>
              </div>
            </div>
            <button
              onClick={() => { if (!twoFactor) { setTfaStep('setup'); setTfaModal(true); } else { setTwoFactor(false); } }}
              className={`px-4 py-1.5 rounded-full text-xs font-black cursor-pointer whitespace-nowrap border transition-colors ${
                twoFactor ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {twoFactor ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Developer Platform ────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Developer Platform app settings</h3>
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center mx-auto">
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-bold text-gray-700">You have not granted any Apps access to your account</p>
          <p className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">Learn about Developer Platform</p>
        </div>
      </div>

      {/* ── Reddit Premium ───────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Inspire Premium</h3>
        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
          <div>
            <p className="font-bold text-gray-800">Get premium</p>
            <p className="text-xs text-gray-500">Ad-free browsing, monthly coins, and premium avatar gear</p>
          </div>
          <button className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-black cursor-pointer">
            Explore
          </button>
        </div>
      </div>

      {/* ── Advanced ─────────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Advanced</h3>
        <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50">
          <div>
            <p className="font-bold text-red-500">Delete account</p>
            <p className="text-xs text-red-400">Permanently delete your account and all data</p>
          </div>
          <button className="px-4 py-1.5 border border-red-300 text-red-500 hover:bg-red-100 rounded-full text-xs font-black cursor-pointer">
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
