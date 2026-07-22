// Admin Data Store - Manages Super User Announcements, Ads, User Banning, and Post Moderation

const ADMIN_ANNOUNCEMENT_KEY = "portal_admin_announcement";
const ADMIN_ADS_KEY = "portal_admin_ads";
const ADMIN_BANNED_USERS_KEY = "portal_admin_banned_users";
const ADMIN_DELETED_POSTS_KEY = "portal_admin_deleted_posts";
const ADMIN_REPORTS_KEY = "portal_admin_reports";

// Initial default Super User Pinned Announcement
const DEFAULT_ANNOUNCEMENT = {
  id: "sp_announcement_1",
  title: "Welcome to the Official Inspire Community!",
  text: "Hello everyone! I am Aadithya, your Super User Admin. Welcome to our platform. Please keep discussions inspiring and respectful. Check out our community guidelines below!",
  authorName: "Aadithya (Super User)",
  authorHandle: "@aadithya_admin",
  authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  time: "Pinned Announcement",
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  isSuperUserPost: true,
  isPinned: true,
  likes: 1240,
  commentsCount: 88,
  shares: 310,
  createdAt: new Date().toISOString()
};

// Initial default Advertisements
const DEFAULT_ADS = [
  {
    id: "ad_1",
    title: "Boost Your Creative Workflow with Inspire Pro",
    sponsor: "Inspire Network",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
    targetUrl: "https://example.com/pro",
    active: true,
    clicks: 142,
    createdAt: new Date().toISOString()
  },
  {
    id: "ad_2",
    title: "Join the Global Tech & Green Innovation Summit",
    sponsor: "TechSummit 2026",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    targetUrl: "https://example.com/summit",
    active: true,
    clicks: 89,
    createdAt: new Date().toISOString()
  }
];

// Helper functions for localStorage
function getItem(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key, val) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Error writing to localStorage", e);
  }
}

export const adminStore = {
  // ── Pinned Announcement ──
  getAnnouncement() {
    return getItem(ADMIN_ANNOUNCEMENT_KEY, DEFAULT_ANNOUNCEMENT);
  },
  setAnnouncement(announcement) {
    const data = {
      ...DEFAULT_ANNOUNCEMENT,
      ...announcement,
      id: announcement.id || `sp_announcement_${Date.now()}`,
      isSuperUserPost: true,
      isPinned: true,
      updatedAt: new Date().toISOString()
    };
    setItem(ADMIN_ANNOUNCEMENT_KEY, data);
    return data;
  },
  deleteAnnouncement() {
    setItem(ADMIN_ANNOUNCEMENT_KEY, null);
  },

  // ── Advertisements ──
  getAds() {
    return getItem(ADMIN_ADS_KEY, DEFAULT_ADS);
  },
  addAd(adData) {
    const ads = this.getAds();
    const newAd = {
      id: `ad_${Date.now()}`,
      title: adData.title,
      sponsor: adData.sponsor || "Sponsored",
      image: adData.image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      targetUrl: adData.targetUrl || "#",
      active: true,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    ads.unshift(newAd);
    setItem(ADMIN_ADS_KEY, ads);
    return newAd;
  },
  toggleAdStatus(adId) {
    const ads = this.getAds().map(ad => 
      ad.id === adId ? { ...ad, active: !ad.active } : ad
    );
    setItem(ADMIN_ADS_KEY, ads);
    return ads;
  },
  deleteAd(adId) {
    const ads = this.getAds().filter(ad => ad.id !== adId);
    setItem(ADMIN_ADS_KEY, ads);
    return ads;
  },

  // ── Banned Users ──
  getBannedUsers() {
    return getItem(ADMIN_BANNED_USERS_KEY, []);
  },
  banUser(usernameOrEmail) {
    const banned = this.getBannedUsers();
    const normalized = (usernameOrEmail || "").toLowerCase().trim();
    if (!banned.includes(normalized)) {
      banned.push(normalized);
      setItem(ADMIN_BANNED_USERS_KEY, banned);
    }
    return banned;
  },
  unbanUser(usernameOrEmail) {
    const normalized = (usernameOrEmail || "").toLowerCase().trim();
    const banned = this.getBannedUsers().filter(u => u !== normalized);
    setItem(ADMIN_BANNED_USERS_KEY, banned);
    return banned;
  },
  isUserBanned(usernameOrEmail) {
    const normalized = (usernameOrEmail || "").toLowerCase().trim();
    return this.getBannedUsers().includes(normalized);
  },

  // ── Deleted Posts ──
  getDeletedPostIds() {
    return getItem(ADMIN_DELETED_POSTS_KEY, []);
  },
  deletePost(postId) {
    const deleted = this.getDeletedPostIds();
    if (!deleted.includes(postId)) {
      deleted.push(postId);
      setItem(ADMIN_DELETED_POSTS_KEY, deleted);
    }
    return deleted;
  },

  // ── Post Reports ──
  getReportedPosts() {
    const defaultReports = [
      {
        id: "post_reported_1",
        postId: "post_2",
        authorName: "Tech World",
        authorHandle: "techworldindia",
        text: "BREAKING: New AI model achieves 98% accuracy in solving real-world problems.",
        reportReason: "Spam / Misleading Information",
        reportsCount: 5,
        reportedAt: "10 mins ago"
      },
      {
        id: "post_reported_2",
        postId: "post_5",
        authorName: "Crypto Daily Alerts",
        authorHandle: "crypto_daily",
        text: "Guaranteed 500% profit in 24 hours! Click the link now to double your crypto investments instantly!",
        reportReason: "Scam / Phishing Link",
        reportsCount: 12,
        reportedAt: "1 hour ago"
      }
    ];
    return getItem(ADMIN_REPORTS_KEY, defaultReports);
  },
  reportPost(postId, postData, reason = "Inappropriate content") {
    const reports = this.getReportedPosts();
    const existingIndex = reports.findIndex(r => r.postId === postId);
    if (existingIndex >= 0) {
      reports[existingIndex].reportsCount += 1;
    } else {
      reports.push({
        id: `report_${Date.now()}`,
        postId: postId,
        authorName: postData.authorName || "User",
        authorHandle: postData.authorHandle || "@user",
        text: postData.text || "",
        reportReason: reason,
        reportsCount: 1,
        reportedAt: "Just now"
      });
    }
    setItem(ADMIN_REPORTS_KEY, reports);
    return reports;
  },
  dismissReport(reportId) {
    const reports = this.getReportedPosts().filter(r => r.id !== reportId);
    setItem(ADMIN_REPORTS_KEY, reports);
    return reports;
  }
};
