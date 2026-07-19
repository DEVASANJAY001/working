# DesiCircle — Complete Application Blueprint
## Every Page | Every Button | Every State | Every Connection

**Version:** 1.0 | **Date:** 2026-07-18 | **Total Screens:** 85+

---

# SECTION A: COMPLETE PAGE INVENTORY

## A.1 Onboarding Flow (6 Screens)
| # | Screen ID | Screen Name | Type | Next Screen |
|---|-----------|-------------|------|-------------|
| 1 | SPL_001 | Splash | Full Screen | GST_001 (auto 2.5s) |
| 2 | GST_001 | Get Started | Full Screen | PHN_001 |
| 3 | PHN_001 | Phone Input | Form | OTP_001 |
| 4 | OTP_001 | OTP Verification | Form | PRF_001 |
| 5 | PRF_001 | Profile Setup | Form | LNG_001 |
| 6 | LNG_001 | Language Select | Selection | INT_001 |
| 7 | INT_001 | Interest Select | Selection | HOM_001 |

## A.2 Authentication (5 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 8 | LOG_001 | Login | Form |
| 9 | REG_001 | Register | Form |
| 10 | FGP_001 | Forgot Password | Form |
| 11 | RST_001 | Reset Password | Form |
| 12 | VRF_001 | Email Verification | Status |

## A.3 Main App — Home Tab (8 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 13 | HOM_001 | Home Feed | List |
| 14 | HOM_002 | Local Feed | List |
| 15 | HOM_003 | Trending Feed | List |
| 16 | HOM_004 | Following Feed | List |
| 17 | PST_001 | Post Detail | Detail |
| 18 | CMT_001 | Comment Thread | Thread |
| 19 | SHR_001 | Share Sheet | Bottom Sheet |
| 20 | AWD_001 | Award Sheet | Bottom Sheet |

## A.4 Create Content (6 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 21 | CRE_001 | Create Post | Form |
| 22 | CRE_002 | Voice Recorder | Overlay |
| 23 | CRE_003 | Video Recorder | Camera |
| 24 | CRE_004 | Image Picker | Gallery |
| 25 | CRE_005 | Poll Creator | Form |
| 26 | CRE_006 | Drafts List | List |

## A.5 Communities (10 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 27 | COM_001 | Community List | List |
| 28 | COM_002 | Community Detail | Detail |
| 29 | COM_003 | Community About | Tab |
| 30 | COM_004 | Community Rules | Tab |
| 31 | COM_005 | Community Mods | Tab |
| 32 | COM_006 | Community Stats | Tab |
| 33 | COM_007 | Create Community | Form |
| 34 | COM_008 | Join Community | Action |
| 35 | COM_009 | Community Settings | Form |
| 36 | COM_010 | Community Members | List |

## A.6 Discover/Search (8 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 37 | DSC_001 | Discover Main | Dashboard |
| 38 | SRC_001 | Search Input | Form |
| 39 | SRC_002 | Search Results | List |
| 40 | SRC_003 | Trending Searches | List |
| 41 | TPC_001 | Topic Detail | Detail |
| 42 | USR_001 | User Search Results | List |
| 43 | USR_002 | User Profile Public | Detail |
| 44 | USR_003 | User Followers | List |

## A.7 Profile (12 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 45 | PRF_002 | My Profile | Detail |
| 46 | PRF_003 | Edit Profile | Form |
| 47 | PRF_004 | Change Password | Form |
| 48 | PRF_005 | Saved Posts | List |
| 49 | PRF_006 | My Posts | List |
| 50 | PRF_007 | My Comments | List |
| 51 | PRF_008 | My Awards | List |
| 52 | PRF_009 | Verification | Form |
| 53 | PRF_010 | Following List | List |
| 54 | PRF_011 | Followers List | List |
| 55 | PRF_012 | Blocked Users | List |
| 56 | PRF_013 | Account Settings | Form |

## A.8 Messages (6 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 57 | MSG_001 | Message Inbox | List |
| 58 | MSG_002 | Chat Detail | Chat |
| 59 | MSG_003 | New Message | Form |
| 60 | MSG_004 | Message Requests | List |
| 61 | MSG_005 | Group Chat | Chat |
| 62 | MSG_006 | Group Info | Detail |

## A.9 Notifications (4 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 63 | NOT_001 | Notification List | List |
| 64 | NOT_002 | Notification Settings | Form |
| 65 | NOT_003 | Mention List | List |
| 66 | NOT_004 | Activity Log | List |

## A.10 Wallet & Monetization (6 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 67 | WAL_001 | Wallet Main | Dashboard |
| 68 | WAL_002 | Buy Coins | Form |
| 69 | WAL_003 | Transaction History | List |
| 70 | WAL_004 | Withdraw | Form |
| 71 | WAL_005 | Creator Earnings | Dashboard |
| 72 | WAL_006 | Subscription Tiers | Form |

## A.11 Settings (14 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 73 | SET_001 | Settings Main | Menu |
| 74 | SET_002 | Account Settings | Form |
| 75 | SET_003 | Privacy Settings | Form |
| 76 | SET_004 | Notification Settings | Form |
| 77 | SET_005 | Language Settings | Form |
| 78 | SET_006 | Theme Settings | Selection |
| 79 | SET_007 | Data Saver | Toggle |
| 80 | SET_008 | Accessibility | Form |
| 81 | SET_009 | Security | Form |
| 82 | SET_010 | Help Center | WebView |
| 83 | SET_011 | Contact Us | Form |
| 84 | SET_012 | About App | Info |
| 85 | SET_013 | Terms of Service | WebView |
| 86 | SET_014 | Privacy Policy | WebView |

## A.12 Moderation (8 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 87 | MOD_001 | Mod Dashboard | Dashboard |
| 88 | MOD_002 | Report Queue | List |
| 89 | MOD_003 | Mod Actions | Form |
| 90 | MOD_004 | AutoMod Config | Form |
| 91 | MOD_005 | Ban List | List |
| 92 | MOD_006 | Mod Log | List |
| 93 | MOD_007 | Community Settings | Form |
| 94 | MOD_008 | Invite Mod | Form |

## A.13 Creator Studio (6 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 95 | CRT_001 | Creator Dashboard | Dashboard |
| 96 | CRT_002 | Analytics | Charts |
| 97 | CRT_003 | Content Manager | List |
| 98 | CRT_004 | Monetization | Dashboard |
| 99 | CRT_005 | Brand Deals | List |
| 100 | CRT_006 | Scheduled Posts | List |

## A.14 Live Events (4 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 101 | LIV_001 | Live Room | Live |
| 102 | LIV_002 | Live Schedule | List |
| 103 | LIV_003 | Go Live | Setup |
| 104 | LIV_004 | Live Replay | Video |

## A.15 Error & Edge Cases (6 Screens)
| # | Screen ID | Screen Name | Type |
|---|-----------|-------------|------|
| 105 | ERR_001 | No Internet | Error |
| 106 | ERR_002 | Server Error | Error |
| 107 | ERR_003 | Empty State | Info |
| 108 | ERR_004 | Not Found | Error |
| 109 | ERR_005 | Rate Limited | Error |
| 110 | ERR_006 | Content Removed | Error |

---

# SECTION B: DETAILED WIREFRAMES — CRITICAL SCREENS

---

## B.1 SCREEN: HOM_001 — HOME FEED (PRIMARY SCREEN)

### Layout Structure
```
┌─────────────────────────────────────────┐ ← Safe Area Top (44px)
│ Status Bar                              │
├─────────────────────────────────────────┤ ← 56px
│ [🔍 Search...]              [🔔][💬][👤]│ ← App Header
├─────────────────────────────────────────┤ ← 48px
│ [📍Local][🔥Trending][⭐Following][🎯You]│ ← Tab Nav
├─────────────────────────────────────────┤
│                                         │
│         SCROLLABLE FEED AREA            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ POST CARD 1                     │    │
│  │ [Header][Content][Actions][Meta]│    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ POST CARD 2                     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ POST CARD 3                     │    │
│  └─────────────────────────────────┘    │
│                                         │
│              [LOADING...]               │
│                                         │
├─────────────────────────────────────────┤ ← 64px
│ [🏠Home][🔍Discover][+][💬Chat][👤Profile]│ ← Bottom Nav
├─────────────────────────────────────────┤ ← 34px
│ Home Indicator                          │
└─────────────────────────────────────────┘
```

### B.1.1 APP HEADER — Component Detail
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────────────────────────┐  ┌─┐┌─┐┌──┐ │
│  │ 🔍 Search communities..│  │🔔││💬││👤│ │
│  │    (flex: 1)           │  │  ││  ││  │ │
│  └────────────────────────┘  └─┘└─┘└──┘ │
│                                         │
│  SEARCH BAR:                            │
│  - Height: 40px                         │
│  - Background: #F5F5F5                  │
│  - Border-radius: 20px                  │
│  - Padding: 0 16px                      │
│  - Icon: Search (20px, #999)            │
│  - Placeholder: "Search..."             │
│  - Tap: Navigate to SRC_001             │
│  - Voice search icon on right           │
│                                         │
│  NOTIFICATION ICON (🔔):                │
│  - Size: 24px                           │
│  - Badge: Red circle (8px) if unread    │
│  - Badge count if > 1                   │
│  - Tap: Navigate to NOT_001             │
│                                         │
│  MESSAGES ICON (💬):                    │
│  - Size: 24px                           │
│  - Badge: Red circle with count         │
│  - Tap: Navigate to MSG_001             │
│                                         │
│  PROFILE AVATAR (👤):                   │
│  - Size: 32px                           │
│  - Border-radius: 50%                   │
│  - Border: 2px solid #FF6B00 (if verified)
│  - Tap: Navigate to PRF_002             │
│                                         │
└─────────────────────────────────────────┘
```

### B.1.2 TAB NAVIGATION — Component Detail
```
┌─────────────────────────────────────────┐
│                                         │
│  [📍 Local]  [🔥 Trending]  [⭐ Following]  [🎯 For You]
│                                         │
│  STRUCTURE:                             │
│  - Horizontal scroll container          │
│  - Tab width: auto (content-based)      │
│  - Gap between tabs: 24px               │
│  - Padding: 0 16px                      │
│                                         │
│  ACTIVE TAB (e.g., "For You"):          │
│  - Font: 16px Bold                      │
│  - Color: #FF6B00 (brand)               │
│  - Underline: 3px, #FF6B00, width=100%  │
│  - Animation: Slide 200ms               │
│                                         │
│  INACTIVE TAB:                          │
│  - Font: 16px Regular                   │
│  - Color: #666666                       │
│  - No underline                         │
│                                         │
│  TAB BEHAVIOR:                          │
│  - Tap: Switch tab, refresh feed        │
│  - Swipe left/right: Switch tab         │
│  - Double-tap: Scroll to top            │
│  - Haptic: Light impact on switch       │
│                                         │
│  TAB DEFINITIONS:                       │
│  📍 Local: GPS-based communities        │
│  🔥 Trending: Platform-wide popular     │
│  ⭐ Following: Subscribed communities   │
│  🎯 For You: ML-personalized feed       │
│                                         │
└─────────────────────────────────────────┘
```

### B.1.3 POST CARD — Component Detail (Voice Post)
```
┌─────────────────────────────────────────┐
│ POST HEADER (56px)                      │
│ ┌────┐  🏏 r/Cricket          [⋯]      │
│ │Icon│  👤 @virat_18 • 2h               │
│ │40px│  🏆 Top Contributor               │
│ └────┘                                  │
├─────────────────────────────────────────┤
│ POST CONTENT                            │
│                                         │
│ India beat Pakistan! 🎉🇮🇳              │
│ What a match!                           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🎙️ VOICE NOTE (0:45)               │ │
│ │                                     │ │
│ │ ▶️  ████████░░░░░░░░░░░░  0:23     │ │
│ │                                     │ │
│ │ [📝 Show Transcript]               │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [📸 Image 1/3] [← swipe →]             │
│                                         │
├─────────────────────────────────────────┤
│ POST ACTIONS (48px)                     │
│ [▲ 12.5K ▼] [💬 2.3K] [↗️] [🔖] [🏆]  │
├─────────────────────────────────────────┤
│ POST META (32px)                        │
│ 45% upvoted • 234 awards • 2h ago      │
└─────────────────────────────────────────┘
```

**POST HEADER BREAKDOWN:**
```
Community Icon:
- Size: 40x40px
- Border-radius: 8px
- Tap: Navigate to COM_002 (Community Detail)

Community Name:
- Font: 16px Bold
- Color: #1A1A1A
- Tap: Navigate to COM_002

Author Line:
- Username: 14px Regular, #666
- Time: 14px Regular, #999
- Badge: Optional pill, 12px

More Button (⋯):
- Size: 24px
- Tap: Open bottom sheet
  Options: Share, Save, Report, Hide, Block User, Copy Link
```

**VOICE PLAYER BREAKDOWN:**
```
Container:
- Background: #F5F5F5
- Border-radius: 12px
- Padding: 16px

Play Button:
- Size: 48px circle
- Background: #FF6B00
- Icon: Play/Pause (white, 24px)
- Tap: Toggle play/pause

Waveform:
- Height: 40px
- Bars: 40 bars, animated
- Played: #FF6B00
- Unplayed: #DDD

Progress:
- Draggable seek bar
- Current time / Total time

Transcript Toggle:
- "Show Transcript" / "Hide Transcript"
- Expandable section below
```

**POST ACTIONS BREAKDOWN:**
```
Upvote/Downvote:
- ▲ Upvote button
  - Default: #666
  - Active: #FF6B00 (orange)
  - Tap: Toggle upvote
- Count: Net score (upvotes - downvotes)
- ▼ Downvote button
  - Default: #666
  - Active: #2196F3 (blue)
  - Tap: Toggle downvote

Comment:
- 💬 Icon + count
- Tap: Navigate to PST_001

Share:
- ↗️ Icon
- Tap: Open SHR_001 (Share Sheet)

Save:
- 🔖 Icon
- Outline: Not saved
- Filled: Saved
- Tap: Toggle save
- Long-press: Save to collection

Award:
- 🏆 Icon
- Tap: Open AWD_001 (Award Sheet)
```

### B.1.4 BOTTOM NAVIGATION — Component Detail
```
┌─────────────────────────────────────────┐
│                                         │
│  [🏠]      [🔍]      [+]      [💬]      [👤]
│  Home    Discover   Create    Chat    Profile
│                                         │
│  STRUCTURE:                             │
│  - Height: 64px                         │
│  - Background: #FFFFFF                  │
│  - Border-top: 1px #E0E0E0              │
│  - 5 items, evenly distributed          │
│                                         │
│  HOME (🏠):                             │
│  - Active: Filled icon, #FF6B00, Bold label
│  - Inactive: Outline icon, #666, Regular label
│  - Tap: Navigate to HOM_001             │
│  - Double-tap: Scroll to top            │
│                                         │
│  DISCOVER (🔍):                         │
│  - Same states as Home                  │
│  - Tap: Navigate to DSC_001             │
│                                         │
│  CREATE (+):                            │
│  - Special elevated button              │
│  - Size: 56px circle                    │
│  - Background: #FF6B00                  │
│  - Icon: Plus (white, 24px)             │
│  - Shadow: 0 4px 8px rgba(255,107,0,0.3)
│  - Tap: Navigate to CRE_001             │
│  - Position: Slightly elevated (-8px)   │
│                                         │
│  CHAT (💬):                             │
│  - Same states as Home                  │
│  - Badge: Message count                 │
│  - Tap: Navigate to MSG_001             │
│                                         │
│  PROFILE (👤):                          │
│  - Same states as Home                  │
│  - Uses avatar image instead of icon    │
│  - Tap: Navigate to PRF_002             │
│                                         │
└─────────────────────────────────────────┘
```

### B.1.5 FLOATING ACTION BUTTON (FAB)
```
┌─────────────────────────────────────────┐
│                                         │
│                    [+]                  │
│                   FAB                   │
│                  56px                   │
│                                         │
│  POSITION:                              │
│  - Right: 16px from edge                │
│  - Bottom: 80px (above bottom nav)      │
│                                         │
│  STYLE:                                 │
│  - Size: 56px circle                    │
│  - Background: #FF6B00                  │
│  - Icon: Plus (white, 24px)             │
│  - Shadow: 0 4px 12px rgba(0,0,0,0.15)  │
│                                         │
│  ANIMATIONS:                            │
│  - Scroll down: Scale to 0 + fade out   │
│  - Scroll up: Scale to 1 + fade in      │
│  - Duration: 200ms                      │
│                                         │
│  TAP: Navigate to CRE_001               │
│                                         │
│  LONG-PRESS: Quick action menu          │
│  ┌─────────────────────────┐            │
│  │ 🎙️ Voice Note           │            │
│  │ 📹 Video                │            │
│  │ 📝 Text Post            │            │
│  │ 📊 Poll                 │            │
│  └─────────────────────────┘            │
│                                         │
└─────────────────────────────────────────┘
```

---

## B.2 SCREEN: CRE_001 — CREATE POST

### Layout Structure
```
┌─────────────────────────────────────────┐
│ ⬅️ Cancel    Create Post      [📤 Post] │
├─────────────────────────────────────────┤
│ Post to: [🏏 r/Cricket ▼]              │
├─────────────────────────────────────────┤
│                                         │
│  Title (optional)                       │
│  [________________________________]     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │   🎙️ HOLD TO RECORD VOICE      │    │
│  │                                 │    │
│  │      [Microphone Icon]          │    │
│  │         100px circle            │    │
│  │                                 │    │
│  │   Tap and hold to record        │    │
│  │   Release to stop               │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│ [🎙️][📹][📸][📝][📊][🔗][😊][🤖]       │
├─────────────────────────────────────────┤
│ Add to post: [📍] [🏷️] [🔗]            │
├─────────────────────────────────────────┤
│ Advanced: [🔞] [📢] [⏰] [💾]          │
└─────────────────────────────────────────┘
```

### B.2.1 HEADER
```
┌─────────────────────────────────────────┐
│                                         │
│  ⬅️ Cancel         Create Post    [📤]  │
│                                         │
│  LEFT — Cancel:                         │
│  - Icon: Back arrow                     │
│  - Label: "Cancel"                      │
│  - Tap: Show discard confirmation       │
│    "Discard post?" [Keep] [Discard]     │
│                                         │
│  CENTER — Title:                        │
│  - "Create Post"                        │
│  - Subtitle: Character count (if text)  │
│                                         │
│  RIGHT — Post Button:                   │
│  - Label: "Post"                        │
│  - Disabled: 50% opacity, gray          │
│  - Enabled: Full opacity, #FF6B00       │
│  - Loading: Spinner replaces text       │
│  - Tap: Submit post                     │
│                                         │
└─────────────────────────────────────────┘
```

### B.2.2 COMMUNITY SELECTOR
```
┌─────────────────────────────────────────┐
│                                         │
│  Post to:                               │
│  ┌─────────────────────────────────┐    │
│  │ 🏏 r/Cricket           [▼]      │    │
│  │ 2.4M members                    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  - Background: #F5F5F5                  │
│  - Border-radius: 12px                  │
│  - Padding: 12px 16px                   │
│  - Tap: Open community picker           │
│                                         │
│  COMMUNITY PICKER (Bottom Sheet):       │
│  ┌─────────────────────────────────┐    │
│  │ ─── Drag handle                 │    │
│  │ 🔍 Search communities...        │    │
│  │                                 │    │
│  │ RECENT                          │    │
│  │ 🏏 r/Cricket                    │    │
│  │ 🎭 r/Bollywood                  │    │
│  │                                 │    │
│  │ YOUR COMMUNITIES                │    │
│  │ 🏏 r/Cricket      ⭐ Subscribed │    │
│  │ 🎭 r/Bollywood    ⭐ Subscribed │    │
│  │ 📍 r/Mumbai       ⭐ Subscribed │    │
│  │                                 │    │
│  │ [➕ Create New Community]       │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### B.2.3 VOICE RECORDING INTERFACE
```
┌─────────────────────────────────────────┐
│ IDLE STATE:                             │
│                                         │
│      ┌─────────────────────┐            │
│      │                     │            │
│      │    🎙️               │            │
│      │   [Mic Icon]        │            │
│      │    100px            │            │
│      │                     │            │
│      │  HOLD TO RECORD     │            │
│      │                     │            │
│      └─────────────────────┘            │
│                                         │
│  - Circle: #FF6B00, pulsing animation   │
│  - Hold: Start recording                │
│  - Release: Stop recording              │
│                                         │
├─────────────────────────────────────────┤
│ RECORDING STATE:                        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ● REC  0:23                    │    │
│  │                                 │    │
│  │  [Animated waveform bars]       │    │
│  │                                 │    │
│  │  [⏹️ Stop]  [⏸️ Pause]          │    │
│  │                                 │    │
│  │  Slide to cancel ←              │    │
│  └─────────────────────────────────┘    │
│                                         │
│  - Red recording indicator              │
│  - Timer: MM:SS                         │
│  - Waveform: Real-time visualization    │
│  - Stop: Save recording                 │
│  - Pause: Pause recording               │
│  - Slide left: Cancel recording         │
│                                         │
├─────────────────────────────────────────┤
│ COMPLETED RECORDING:                    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ▶️  ████████████████████  0:45  │    │
│  │                                 │    │
│  │ [🎵] [⏪] [▶️] [⏩] [🗑️]       │    │
│  │                                 │    │
│  │ [📝 Auto-transcribe]            │    │
│  │ [✏️ Edit Recording]             │    │
│  └─────────────────────────────────┘    │
│                                         │
│  - Playback controls                    │
│  - Trim/edit options                    │
│  - Transcription generation             │
│                                         │
└─────────────────────────────────────────┘
```

### B.2.4 FORMAT TOOLBAR
```
┌─────────────────────────────────────────┐
│                                         │
│  [🎙️] [📹] [📸] [📝] [📊] [🔗] [😊] [🤖]
│  Voice Video Photo Text Poll Link Emoji AI
│                                         │
│  TOOLBAR ITEMS:                         │
│                                         │
│  🎙️ Voice (Default):                    │
│  - Active: Filled background            │
│  - Shows voice recording UI             │
│                                         │
│  📹 Video:                              │
│  - Tap: Open camera for video           │
│  - Options: Record or Gallery           │
│                                         │
│  📸 Photo:                              │
│  - Tap: Open image picker               │
│  - Multi-select: Up to 10 images        │
│                                         │
│  📝 Text:                               │
│  - Tap: Show text input area            │
│  - Formatting toolbar appears           │
│                                         │
│  📊 Poll:                               │
│  - Tap: Add poll widget                 │
│  - 2-4 options                          │
│  - Duration setting                     │
│                                         │
│  🔗 Link:                               │
│  - Tap: URL input dialog                │
│  - Auto-generates preview               │
│                                         │
│  😊 Emoji:                              │
│  - Tap: Emoji picker bottom sheet       │
│  - Recently used                        │
│  - Category tabs                        │
│                                         │
│  🤖 AI Assistant:                       │
│  - Tap: AI options menu                 │
│  - Improve writing                      │
│  - Fix grammar                          │
│  - Make shorter/longer                  │
│  - Change tone                          │
│                                         │
└─────────────────────────────────────────┘
```

---

## B.3 SCREEN: PST_001 — POST DETAIL

### Layout Structure
```
┌─────────────────────────────────────────┐
│ ⬅️ 🏏 r/Cricket              [🔍] [⋯]   │
├─────────────────────────────────────────┤
│                                         │
│  [FULL POST CONTENT — Expanded]         │
│                                         │
│  - All text shown (no truncation)       │
│  - All images visible                   │
│  - Full metadata                        │
│                                         │
├─────────────────────────────────────────┤
│  [❤️ 12.5K] [💬 2.3K] [↗️] [🔖] [🏆]   │
├─────────────────────────────────────────┤
│  💬 2,345 Comments    SORT: [🔥 Best ▼] │
├─────────────────────────────────────────┤
│                                         │
│  [COMMENT THREAD — Nested]              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 👤 @rahul_92 • 3h               │    │
│  │ Best match ever! 🏏🔥           │    │
│  │ [❤️ 234] [💬 Reply] [↗️] [🏆]   │    │
│  │                                 │    │
│  │   ┌─────────────────────────┐   │    │
│  │   │ 👤 @virat_18 (OP) • 2h  │   │    │
│  │   │ Agree! That six was 🔥  │   │    │
│  │   │ [❤️ 89] [💬 Reply]      │   │    │
│  │   └─────────────────────────┘   │    │
│  │                                 │    │
│  │   [+ 12 more replies]           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [More comments...]                     │
│                                         │
├─────────────────────────────────────────┤
│  [💬 Add a comment...    ] [🎙️] [➤]    │
└─────────────────────────────────────────┘
```

### B.3.1 COMMENT COMPONENT
```
┌─────────────────────────────────────────┐
│ COMMENT LEVEL 1 (No indent)             │
│ ┌─────────────────────────────────────┐ │
│ │ 👤 @rahul_92              3h        │ │
│ │ 🏆 Silver Contributor               │ │
│ │                                     │ │
│ │ Best match ever! 🏏🔥               │ │
│ │ Totally agree with your point.      │ │
│ │                                     │ │
│ │ [❤️ 234] [💬 Reply] [↗️] [🏆]       │ │
│ │                                     │ │
│ │ [+ 12 replies]                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ COMMENT LEVEL 2 (Indent + thread line)  │
│   ┌────────────────────────────────