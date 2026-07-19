

## 6. PAGE CONNECTIVITY MATRIX

### 6.1 Navigation Graph

```
SPL_001 (Splash)
    └──→ GST_001 (Get Started)
            ├──→ PHN_001 (Phone) → OTP_001 → PRF_001 → LNG_001 → INT_001 → HOM_001
            └──→ LOG_001 (Login) → HOM_001

HOM_001 (Home)
    ├──→ Header Icons
    │       ├──→ SRC_001 (Search)
    │       ├──→ NOT_001 (Notifications)
    │       ├──→ MSG_001 (Messages)
    │       └──→ PRF_002 (My Profile)
    ├──→ Tab Navigation
    │       ├──→ HOM_002 (Local)
    │       ├──→ HOM_003 (Trending)
    │       ├──→ HOM_004 (Following)
    │       └──→ HOM_005 (For You)
    ├──→ Post Cards
    │       ├──→ PST_001 (Post Detail)
    │       ├──→ COM_002 (Community)
    │       └──→ USR_002 (User Profile)
    ├──→ Bottom Nav
    │       ├──→ HOM_001 (Home - current)
    │       ├──→ DSC_001 (Discover)
    │       ├──→ CRE_001 (Create)
    │       ├──→ MSG_001 (Chat)
    │       └──→ PRF_002 (Profile)
    └──→ FAB (Create)
            └──→ CRE_001

CRE_001 (Create Post)
    ├──→ Header
    │       └──→ Cancel (back with confirm)
    │       └──→ Post (submit)
    ├──→ Community Selector
    │       └──→ COM_PICKER (Bottom Sheet)
    ├──→ Content Area
    │       ├──→ Voice Recording (CRE_002)
    │       ├──→ Video Recording (CRE_003)
    │       ├──→ Image Picker (CRE_004)
    │       ├──→ Poll Creator (CRE_005)
    │       └──→ Text Editor
    ├──→ Format Toolbar
    │       ├──→ Voice
    │       ├──→ Video
    │       ├──→ Photo
    │       ├──→ Text
    │       ├──→ Poll
    │       ├──→ Link
    │       ├──→ Emoji
    │       └──→ AI Assistant
    └──→ Advanced Options
            ├──→ NSFW Toggle
            ├──→ Announcement Toggle
            ├──→ Schedule Post
            └──→ Save Draft

PST_001 (Post Detail)
    ├──→ Header
    │       ├──→ Back
    │       ├──→ Community Name → COM_002
    │       ├──→ Search
    │       └──→ More Options (SHR_001)
    ├──→ Post Content (Full)
    ├──→ Actions
    │       ├──→ Vote
    │       ├──→ Comments (scroll to)
    │       ├──→ Share → SHR_001
    │       ├──→ Save
    │       └──→ Award → AWD_001
    ├──→ Comments Section
    │       ├──→ Sort Options
    │       └──→ Comment Thread (CMT_001)
    └──→ Comment Input
            ├──→ Text Input
            ├──→ Voice Comment
            └──→ Submit

COM_002 (Community Detail)
    ├──→ Header
    │       ├──→ Back
    │       ├──→ Search
    │       └──→ More
    ├──→ Banner + Info
    ├──→ Actions
    │       ├──→ Join/Joined
    │       ├──→ Notifications
    │       ├──→ Chat
    │       └──→ Awards
    ├──→ Tabs
    │       ├──→ Posts (Feed)
    │       ├──→ About (COM_003)
    │       ├──→ Rules (COM_004)
    │       └──→ Mods (COM_005)
    └──→ Post Feed

PRF_002 (My Profile)
    ├──→ Header
    │       ├──→ Back
    │       ├──→ More Options
    │       └──→ Edit Profile → PRF_003
    ├──→ Profile Info
    ├──→ Stats Row
    │       ├──→ Posts → PRF_006
    │       ├──→ Following → PRF_010
    │       ├──→ Followers → PRF_011
    │       └──→ Karma
    ├──→ Content Tabs
    │       ├──→ Posts
    │       ├──→ Comments → PRF_007
    │       └──→ Awards → PRF_008
    └──→ Post Grid/List

MSG_001 (Message Inbox)
    ├──→ Header
    │       └──→ New Message → MSG_003
    ├──→ Search
    ├──→ Requests Section → MSG_004
    └──→ Conversation List
            └──→ MSG_002 (Chat Detail)

MSG_002 (Chat Detail)
    ├──→ Header
    │       ├──→ Back
    │       ├──→ User/Group Info → MSG_006
    │       └──→ More Options
    ├──→ Message List
    │       ├──→ Text Messages
    │       ├──→ Voice Messages
    │       ├──→ Images
    │       └──→ System Messages
    └──→ Input Area
            ├──→ Text Input
            ├──→ Voice Message
            ├──→ Image
            ├──→ Emoji
            └──→ Send

WAL_001 (Wallet)
    ├──→ Header
    ├──→ Balance Display
    ├──→ Quick Actions
    │       ├──→ Add Money → WAL_002
    │       └──→ Withdraw → WAL_004
    ├──→ Quick Links
    │       ├──→ Buy Awards
    │       ├──→ Premium
    │       └──→ Stats
    ├──→ Transactions → WAL_003
    └──→ Creator Earnings → WAL_005

SET_001 (Settings)
    ├──→ Account → SET_002
    ├──→ Privacy → SET_003
    ├──→ Notifications → SET_004
    ├──→ Language → SET_005
    ├──→ Theme → SET_006
    ├──→ Data Saver → SET_007
    ├──→ Accessibility → SET_008
    ├──→ Security → SET_009
    ├──→ Help Center → SET_010
    ├──→ Contact Us → SET_011
    ├──→ About → SET_012
    ├──→ Terms → SET_013
    ├──→ Privacy Policy → SET_014
    └──→ Logout

MOD_001 (Mod Dashboard)
    ├──→ Stats Overview
    ├──→ Quick Actions
    │       ├──→ Report Queue → MOD_002
    │       ├──→ Mod Actions → MOD_003
    │       ├──→ AutoMod → MOD_004
    │       └──→ Ban List → MOD_005
    ├──→ Recent Activity → MOD_006
    └──→ Settings → MOD_007
```

### 6.2 Complete State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION STATE MAP                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AUTH STATES:                                                                │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐                   │
│  │ Logged  │───→│  Guest  │───→│  Auth   │───→│  Active │                   │
│  │  Out    │←───│         │←───│ Pending │←───│  User   │                   │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘                   │
│       ↑                            ↓              ↓                          │
│       └────────────────────────────┴──────────────┘                          │
│                                                                              │
│  USER STATES:                                                                │
│  • Unverified ──→ Verified                                                   │
│  • New User ──→ Active ──→ Power User ──→ Creator ──→ Influencer            │
│  • Free ──→ Premium                                                          │
│                                                                              │
│  CONTENT STATES:                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐                   │
│  │  Draft  │───→│ Pending │───→│  Live   │───→│ Archived│                   │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘                   │
│       ↓              ↓              ↓              ↓                         │
│    [Saved]       [Queued]      [Reported]    [Deleted]                       │
│                                                                              │
│  POST STATES:                                                                │
│  • Creating → Publishing → Published                                         │
│  • Published → Editing → Edited                                              │
│  • Published → Deleting → Deleted                                            │
│  • Published → Reporting → Under Review → Restored/Removed                   │
│  • Published → Archiving → Archived                                          │
│                                                                              │
│  NOTIFICATION STATES:                                                        │
│  • Unread → Read → Archived                                                  │
│                                                                              │
│  MESSAGE STATES:                                                             │
│  • Sending → Sent → Delivered → Read                                         │
│  • Sending → Failed → Retry                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. DETAILED INTERACTION SPECIFICATIONS

### 7.1 Gesture Reference

| Gesture | Context | Action |
|---------|---------|--------|
| Tap | Post Card | Navigate to Post Detail |
| Double Tap | Post Image | Zoom / Like |
| Long Press | Post Card | Peek preview |
| Swipe Left | Post Card | More options |
| Swipe Right | Post Card | Quick upvote |
| Pull Down | Feed | Refresh |
| Pull Up | Feed | Load more |
| Pinch | Image | Zoom |
| Pan | Image | Pan when zoomed |
| Tap | Comment | Reply |
| Swipe Left | Comment | Vote/Report |
| Long Press | Comment | Copy text |

### 7.2 Haptic Feedback

| Trigger | Pattern | Intensity |
|---------|---------|-----------|
| Upvote | Short pulse | Light |
| Downvote | Short pulse | Light |
| Award | Double pulse | Medium |
| Post Submit | Success | Medium |
| Error | Error | Heavy |
| Voice Record Start | Start | Light |
| Voice Record Stop | Stop | Light |
| Pull to Refresh | Trigger | Light |
| Long Press | Trigger | Light |

### 7.3 Keyboard Shortcuts (iPad/Desktop)

| Key | Action |
|-----|--------|
| ⌘/Ctrl + N | New Post |
| ⌘/Ctrl + K | Search |
| ⌘/Ctrl + / | Shortcuts Help |
| Esc | Close Modal/Go Back |
| J | Next Post |
| K | Previous Post |
| U | Upvote |
| D | Downvote |
| C | Comment |
| S | Save |
| R | Refresh |

---

## 8. ACCESSIBILITY REQUIREMENTS

### 8.1 Screen Reader Support

- All interactive elements must have descriptive labels
- Images must have alt text
- Custom gestures must have accessibility alternatives
- Dynamic content updates must announce changes
- Focus management for modals and overlays

### 8.2 Visual Accessibility

- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- Focus indicators visible on all interactive elements
- Support for dynamic text sizing
- Reduce motion support

### 8.3 Motor Accessibility

- Minimum touch target: 44x44 points
- Support for switch control
- VoiceOver navigation support
- Shake to undo support where applicable

---

## 9. PERFORMANCE REQUIREMENTS

### 9.1 Load Times

| Screen | Target | Maximum |
|--------|--------|---------|
| Splash to Home | 2.5s | 4s |
| Feed First Paint | 1s | 2s |
| Feed Interactive | 2s | 3s |
| Post Detail | 500ms | 1s |
| Profile | 800ms | 1.5s |
| Search Results | 500ms | 1s |

### 9.2 Animation Performance

- Target: 60fps for all animations
- Use transform and opacity for animations
- Avoid layout thrashing
- Lazy load images below the fold

### 9.3 Memory Management

- Image cache: 100MB limit
- Video cache: 200MB limit
- Clear cache on memory warning
- Paginated loading for feeds

---

## 10. ERROR HANDLING

### 10.1 Error Screens

| Screen | Trigger | Recovery |
|--------|---------|----------|
| ERR_001 | No network | Retry button, auto-retry |
| ERR_002 | 5xx error | Retry button, contact support |
| ERR_003 | Empty results | Suggestions, create action |
| ERR_004 | 404 | Back button, search |
| ERR_005 | Rate limit | Countdown, explanation |
| ERR_006 | Content removed | Explanation, browse more |

### 10.2 Toast/Notification Messages

| Type | Duration | Action |
|------|----------|--------|
| Success | 3s | Auto-dismiss, undo option |
| Error | 5s | Manual dismiss, retry option |
| Info | 4s | Auto-dismiss |
| Warning | 5s | Manual dismiss |

---

## APPENDIX A: SCREEN ID REFERENCE

### A.1 Naming Convention

```
[XXX]_[NNN]
 │      │
 │      └── Sequential number (001-999)
 └── Category code (3 letters)

Category Codes:
- SPL: Splash/Onboarding
- GST: Get Started
- PHN: Phone
- OTP: OTP Verification
- PRF: Profile
- LNG: Language
- INT: Interests
- LOG: Login
- REG: Register
- FGP: Forgot Password
- RST: Reset
- VRF: Verification
- HOM: Home
- PST: Post
- CMT: Comment
- SHR: Share
- AWD: Award
- CRE: Create
- COM: Community
- DSC: Discover
- SRC: Search
- TPC: Topic
- USR: User
- MSG: Message
- NOT: Notification
- WAL: Wallet
- SET: Settings
- MOD: Moderation
- LIV: Live
- ERR: Error
- CRT: Creator
```

---

**END OF SPECIFICATION**

*This document contains the complete wireframe and interaction specification for DesiCircle. All screens, components, states, and flows are documented for implementation reference.*
