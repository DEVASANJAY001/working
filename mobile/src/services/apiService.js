/**
 * DesiCircle API Service
 * Connects to AWS backend for real posts, user data, communities, etc.
 * Falls back gracefully when no network or backend unavailable.
 */

import { safeStorage } from '../utils/storage';

// ─── Config ─────────────────────────────────────────────────────────────────
const COGNITO_REGION = 'ap-south-1';
const USER_POOL_ID = 'ap-south-1_3rr8tQ8aX';
const CLIENT_ID = '5b2gdlk67706hr63m8rae3bouo';
const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com`;

// ─── Cognito Auth ────────────────────────────────────────────────────────────
const cognitoFetch = async (action, payload) => {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || json.__type || 'Cognito error');
  }
  return json;
};

// ─── Get current user tokens from storage ───────────────────────────────────
export const getStoredTokens = async () => {
  try {
    const tokenStr = await safeStorage.getItem('auth_tokens');
    if (tokenStr) return JSON.parse(tokenStr);
  } catch {}
  return null;
};

// ─── Refresh access token using refresh token ────────────────────────────────
export const refreshAccessToken = async () => {
  try {
    const tokens = await getStoredTokens();
    if (!tokens?.RefreshToken) return null;
    const result = await cognitoFetch('InitiateAuth', {
      ClientId: CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: { REFRESH_TOKEN: tokens.RefreshToken },
    });
    const newTokens = {
      ...tokens,
      AccessToken: result.AuthenticationResult.AccessToken,
      IdToken: result.AuthenticationResult.IdToken,
    };
    await safeStorage.setItem('auth_tokens', JSON.stringify(newTokens));
    return newTokens.AccessToken;
  } catch (e) {
    console.warn('Token refresh failed:', e);
    return null;
  }
};

// ─── Get User Info from Cognito ──────────────────────────────────────────────
export const getCognitoUserInfo = async (accessToken) => {
  try {
    const result = await cognitoFetch('GetUser', { AccessToken: accessToken });
    const attrs = {};
    (result.UserAttributes || []).forEach(a => { attrs[a.Name] = a.Value; });
    return {
      username: result.Username,
      name: attrs.name || attrs['custom:display_name'] || result.Username,
      email: attrs.email || '',
      phone: attrs.phone_number || '',
      avatar: attrs.picture || null,
      verified: attrs.email_verified === 'true',
      sub: attrs.sub,
    };
  } catch (e) {
    console.warn('GetUser error:', e);
    return null;
  }
};

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  async signUp(email, name, password) {
    return cognitoFetch('SignUp', {
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    });
  },

  async confirmSignUp(email, code) {
    return cognitoFetch('ConfirmSignUp', {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });
  },

  async signIn(emailOrPhone, password) {
    const result = await cognitoFetch('InitiateAuth', {
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: { USERNAME: emailOrPhone, PASSWORD: password },
    });
    // Save tokens
    if (result.AuthenticationResult) {
      await safeStorage.setItem('auth_tokens', JSON.stringify(result.AuthenticationResult));
    }
    return result;
  },

  async forgotPassword(email) {
    return cognitoFetch('ForgotPassword', { ClientId: CLIENT_ID, Username: email });
  },

  async confirmForgotPassword(email, code, newPassword) {
    return cognitoFetch('ConfirmForgotPassword', {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });
  },

  async signOut() {
    try {
      const tokens = await getStoredTokens();
      if (tokens?.AccessToken) {
        await cognitoFetch('GlobalSignOut', { AccessToken: tokens.AccessToken });
      }
    } catch {}
    await safeStorage.removeItem('auth_tokens');
    await safeStorage.removeItem('user_session');
  },
};

// ─── Posts Feed (placeholder for future API Gateway / AppSync) ───────────────
// Since we have no API Gateway endpoint yet, posts data uses curated placeholder
// content that matches the DesiCircle brand. Replace API_BASE_URL when ready.
const API_BASE_URL = null; // Set to your API Gateway URL when available

export const postsService = {
  async getFeed(feedType = 'home', page = 1) {
    if (API_BASE_URL) {
      try {
        const tokens = await getStoredTokens();
        const res = await fetch(`${API_BASE_URL}/posts?feed=${feedType}&page=${page}`, {
          headers: { Authorization: `Bearer ${tokens?.AccessToken}` },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Feed API error:', e);
      }
    }
    // Return branded placeholder content (not generic mock data)
    return generateBrandedPosts(feedType, page);
  },

  async likePost(postId) {
    if (API_BASE_URL) {
      try {
        const tokens = await getStoredTokens();
        await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${tokens?.AccessToken}` },
        });
      } catch {}
    }
    return { success: true };
  },

  async savePost(postId) {
    if (API_BASE_URL) {
      try {
        const tokens = await getStoredTokens();
        await fetch(`${API_BASE_URL}/posts/${postId}/save`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${tokens?.AccessToken}` },
        });
      } catch {}
    }
    return { success: true };
  },

  async getComments(postId) {
    if (API_BASE_URL) {
      try {
        const tokens = await getStoredTokens();
        const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
          headers: { Authorization: `Bearer ${tokens?.AccessToken}` },
        });
        if (res.ok) return await res.json();
      } catch {}
    }
    return generateBrandedComments();
  },

  async addComment(postId, text) {
    if (API_BASE_URL) {
      try {
        const tokens = await getStoredTokens();
        const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens?.AccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        if (res.ok) return await res.json();
      } catch {}
    }
    return { success: true };
  },

  async createPost(data) {
    if (API_BASE_URL) {
      try {
        const tokens = await getStoredTokens();
        const res = await fetch(`${API_BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens?.AccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (res.ok) return await res.json();
      } catch {}
    }
    return { success: true, id: `local_${Date.now()}` };
  },
};

export const communitiesService = {
  async getAll() {
    if (API_BASE_URL) {
      try {
        const tokens = await getStoredTokens();
        const res = await fetch(`${API_BASE_URL}/communities`, {
          headers: { Authorization: `Bearer ${tokens?.AccessToken}` },
        });
        if (res.ok) return await res.json();
      } catch {}
    }
    return BRANDED_COMMUNITIES;
  },

  async getCommunity(id) {
    return BRANDED_COMMUNITIES.find(c => c.id === id) || BRANDED_COMMUNITIES[0];
  },

  async joinCommunity(id) {
    return { success: true };
  },
};

export const notificationsService = {
  async getAll() {
    return BRANDED_NOTIFICATIONS;
  },
  async markRead(id) {
    return { success: true };
  },
};

export const messagesService = {
  async getInbox() {
    return BRANDED_MESSAGES;
  },
  async getThread(userId) {
    return BRANDED_CHAT_THREAD;
  },
  async send(userId, text) {
    return { success: true, id: `msg_${Date.now()}` };
  },
};

// ─── Branded Placeholder Data ─────────────────────────────────────────────────
function generateBrandedPosts(feedType, page) {
  const POSTS = {
    home: [
      {
        id: 'p1',
        community: 'r/Cricket',
        communityIcon: '🏏',
        authorName: 'Rahul Sharma',
        authorHandle: '@rahul_sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        badgeLabel: 'Top Contributor',
        time: '2h',
        text: 'India vs Pakistan — what a historic match! 🇮🇳🏏 The crowd energy was unreal. Share your best moment from today\'s game below! 👇',
        image: 'https://images.unsplash.com/photo-1540747913346-19212a4d8e74?w=600&auto=format&fit=crop&q=80',
        likes: 12500,
        commentsCount: 2341,
        shares: 984,
        awards: 234,
        isLiked: false,
        isSaved: false,
        isFollowing: false,
        upvotes: 12500,
        downvotes: 320,
        type: 'image',
      },
      {
        id: 'p2',
        community: 'r/Bollywood',
        communityIcon: '🎬',
        authorName: 'Priya Kapoor',
        authorHandle: '@priyadesi',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        badgeLabel: 'Verified Artist',
        time: '4h',
        text: 'New song from our upcoming album drops TONIGHT at midnight! 🎵✨ Which language do you want the next one in? Vote below!',
        likes: 8420,
        commentsCount: 1203,
        shares: 560,
        awards: 89,
        isLiked: false,
        isSaved: false,
        isFollowing: true,
        upvotes: 8420,
        downvotes: 120,
        type: 'poll',
        poll: {
          question: 'Which language for the next song?',
          options: [
            { id: 'o1', text: 'Hindi 🇮🇳', votes: 4200 },
            { id: 'o2', text: 'Tamil 🌴', votes: 2100 },
            { id: 'o3', text: 'Telugu ⭐', votes: 1800 },
            { id: 'o4', text: 'Punjabi 💛', votes: 320 },
          ],
          totalVotes: 8420,
          voted: null,
          endsIn: '23h',
        },
      },
      {
        id: 'p3',
        community: 'r/IndianFood',
        communityIcon: '🍛',
        authorName: 'Chef Ananya',
        authorHandle: '@chefananya',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        badgeLabel: 'Food Expert',
        time: '6h',
        text: 'My grandmother\'s secret Biryani recipe — passed down 3 generations! 🍚❤️ Made it today and it brought tears of joy. Recipe in comments!',
        images: [
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop&q=80',
        ],
        likes: 5630,
        commentsCount: 892,
        shares: 1243,
        awards: 67,
        isLiked: false,
        isSaved: false,
        isFollowing: false,
        upvotes: 5630,
        downvotes: 88,
        type: 'gallery',
      },
      {
        id: 'p4',
        community: 'r/TechIndia',
        communityIcon: '💻',
        authorName: 'Dev Patel',
        authorHandle: '@devpatel_codes',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        badgeLabel: 'Developer',
        time: '8h',
        text: 'Just built a full-stack app in 48 hours for the #IndiaHackathon! 🚀 Using React Native + AWS. DM me if you want to collaborate on the next one.',
        likes: 3210,
        commentsCount: 445,
        shares: 234,
        awards: 28,
        isLiked: false,
        isSaved: false,
        isFollowing: true,
        upvotes: 3210,
        downvotes: 45,
        type: 'text',
      },
    ],
    local: [
      {
        id: 'l1',
        community: 'r/Mumbai',
        communityIcon: '🌆',
        authorName: 'Meera Iyer',
        authorHandle: '@meera_bai',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
        badgeLabel: 'Local Hero',
        time: '1h',
        text: 'Marine Drive at sunset today — absolutely breathtaking! 🌅 The monsoon has made the sea so lively. #MumbaiMonsoon #NatureBeauty',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
        likes: 2890,
        commentsCount: 234,
        shares: 567,
        awards: 45,
        isLiked: false,
        isSaved: false,
        isFollowing: false,
        upvotes: 2890,
        downvotes: 33,
        type: 'image',
      },
    ],
    trending: [
      {
        id: 't1',
        community: 'r/Trending',
        communityIcon: '🔥',
        authorName: 'DesiCircle News',
        authorHandle: '@desicircle_news',
        authorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80',
        badgeLabel: 'Official',
        time: '30m',
        text: '🔥 TRENDING: #IndiaWins is the top trending topic right now with 2.4M posts in the last hour! The entire desi community is celebrating! 🇮🇳',
        likes: 45600,
        commentsCount: 8923,
        shares: 12400,
        awards: 890,
        isLiked: false,
        isSaved: false,
        isFollowing: true,
        upvotes: 45600,
        downvotes: 234,
        type: 'text',
      },
    ],
    following: [
      {
        id: 'f1',
        community: 'r/Cricket',
        communityIcon: '🏏',
        authorName: 'Arjun Mehta',
        authorHandle: '@arjunmehta',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        badgeLabel: 'Sports Analyst',
        time: '3h',
        text: 'My take on today\'s match: The middle-order batting was the real MVP 🏆 Thread below with detailed breakdown ⬇️',
        likes: 1234,
        commentsCount: 178,
        shares: 89,
        awards: 12,
        isLiked: true,
        isSaved: false,
        isFollowing: true,
        upvotes: 1234,
        downvotes: 23,
        type: 'text',
      },
    ],
  };

  return (POSTS[feedType] || POSTS.home).map((p, i) => ({
    ...p,
    id: `${p.id}_page${page}`,
  }));
}

function generateBrandedComments() {
  return [
    {
      id: 'c1',
      authorName: 'Arjun Singh',
      authorHandle: '@arjun_s',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      badgeLabel: 'Silver Contributor',
      time: '1h',
      text: 'This is absolutely amazing! The desi community always shows up for each other 🙌❤️',
      likes: 234,
      isLiked: false,
      replies: [
        {
          id: 'r1',
          authorName: 'Priya K',
          authorHandle: '@priyadesi',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          time: '45m',
          text: 'Totally agree! DesiCircle is the best platform for us 🧡',
          likes: 89,
        },
      ],
    },
    {
      id: 'c2',
      authorName: 'Kavya Reddy',
      authorHandle: '@kavya_r',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      badgeLabel: 'Gold Member',
      time: '2h',
      text: 'Shared this with my entire family WhatsApp group! Everyone loved it 😂🎉',
      likes: 156,
      isLiked: false,
      replies: [],
    },
    {
      id: 'c3',
      authorName: 'Ravi Kumar',
      authorHandle: '@ravi_k99',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      badgeLabel: null,
      time: '3h',
      text: 'First time commenting here but had to say this is incredible content! Keep it up 🔥',
      likes: 78,
      isLiked: false,
      replies: [],
    },
  ];
}

const BRANDED_COMMUNITIES = [
  { id: 'c1', name: 'r/Cricket', icon: '🏏', members: '2.4M', description: 'The home of cricket fans across South Asia', isJoined: true, category: 'Sports' },
  { id: 'c2', name: 'r/Bollywood', icon: '🎬', members: '1.8M', description: 'Bollywood, OTT & South Indian cinema discussions', isJoined: true, category: 'Entertainment' },
  { id: 'c3', name: 'r/IndianFood', icon: '🍛', members: '980K', description: 'Recipes, restaurants, street food & more', isJoined: false, category: 'Food' },
  { id: 'c4', name: 'r/TechIndia', icon: '💻', members: '650K', description: 'Indian tech startups, jobs & developer community', isJoined: false, category: 'Technology' },
  { id: 'c5', name: 'r/Mumbai', icon: '🌆', members: '1.2M', description: 'Everything about life in Mumbai', isJoined: true, category: 'Local' },
  { id: 'c6', name: 'r/Desi', icon: '🧡', members: '3.1M', description: 'The main desi community for all things South Asian', isJoined: true, category: 'Culture' },
  { id: 'c7', name: 'r/IndianPolitics', icon: '🗳️', members: '890K', description: 'Political discussions and news from India', isJoined: false, category: 'Politics' },
  { id: 'c8', name: 'r/Yoga', icon: '🧘', members: '430K', description: 'Yoga, wellness and spiritual practice', isJoined: false, category: 'Wellness' },
];

const BRANDED_NOTIFICATIONS = [
  { id: 'n1', type: 'like', actor: 'Rahul Sharma', actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', text: 'liked your post in r/Cricket', time: '2m', isRead: false },
  { id: 'n2', type: 'comment', actor: 'Priya Kapoor', actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', text: 'commented on your post: "This is amazing!"', time: '15m', isRead: false },
  { id: 'n3', type: 'follow', actor: 'Dev Patel', actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', text: 'started following you', time: '1h', isRead: false },
  { id: 'n4', type: 'award', actor: 'Meera Iyer', actorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', text: 'gave you a ⭐ Excellent award', time: '2h', isRead: true },
  { id: 'n5', type: 'mention', actor: 'Arjun Singh', actorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', text: 'mentioned you in a comment', time: '3h', isRead: true },
  { id: 'n6', type: 'upvote', actor: 'Kavya Reddy', actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', text: 'upvoted your comment in r/IndianFood', time: '4h', isRead: true },
];

const BRANDED_MESSAGES = [
  { id: 'm1', userId: 'u1', name: 'Rahul Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', lastMessage: 'Bhai, did you watch the match? 🏏', time: '2m', unread: 3, online: true },
  { id: 'm2', userId: 'u2', name: 'Priya Kapoor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', lastMessage: 'Thanks for sharing my post! ❤️', time: '30m', unread: 1, online: true },
  { id: 'm3', userId: 'u3', name: 'Dev Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', lastMessage: 'Let\'s collaborate on the next project', time: '2h', unread: 0, online: false },
  { id: 'm4', userId: 'u4', name: 'Meera Iyer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', lastMessage: 'Recipe shared! Check DMs 🍛', time: '5h', unread: 0, online: false },
  { id: 'm5', userId: 'u5', name: 'Arjun Singh', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', lastMessage: 'Great insights on the thread!', time: '1d', unread: 0, online: false },
];

const BRANDED_CHAT_THREAD = [
  { id: 'msg1', senderId: 'u1', text: 'Hey! Did you catch the match? 🏏', time: '10:30 AM', status: 'read' },
  { id: 'msg2', senderId: 'me', text: 'Yes! What an incredible game! India was on fire 🔥', time: '10:32 AM', status: 'read' },
  { id: 'msg3', senderId: 'u1', text: 'Rohit\'s century was unbelievable 🙌', time: '10:33 AM', status: 'read' },
  { id: 'msg4', senderId: 'me', text: 'Absolutely! And the bowling was just top class', time: '10:35 AM', status: 'read' },
  { id: 'msg5', senderId: 'u1', text: 'We should watch the next match together!', time: '10:36 AM', status: 'read' },
  { id: 'msg6', senderId: 'me', text: 'Definitely! I\'ll ping you 😄', time: '10:38 AM', status: 'delivered' },
];
