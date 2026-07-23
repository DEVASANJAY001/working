// Simulated DynamoDB storage helper for managing communities on Web

export const communityService = {
  async getCommunities() {
    try {
      const stored = localStorage.getItem('aws_dynamodb_communities');
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Default Mock Communities List (Matching mobile app data structure)
      const defaultComms = [
        {
          id: 'c1',
          name: 'Chennai Updates',
          handle: 'chennai_updates',
          category: 'News',
          members: 125000,
          online: 1200,
          joined: true,
          description: 'Your go-to community for all the latest news, alerts, events and important updates from Chennai.',
          createdDate: 'Jan 10, 2023',
          location: 'Chennai, Tamil Nadu, India',
          language: 'English',
          website: 'https://chennaiupdates.org',
          type: 'Public',
          tags: ['News', 'Local', 'Events', 'Alerts', 'Traffic'],
          rules: [
            { id: 1, title: 'Be Respectful', desc: 'Be kind and respectful to all members.' },
            { id: 2, title: 'No Spam or Self Promotion', desc: 'Don\'t post spam, ads or self-promotion.' },
            { id: 3, title: 'Stay on Topic', desc: 'Keep posts relevant to Chennai and nearby areas.' },
            { id: 4, title: 'No Fake News', desc: 'Don\'t share or promote misinformation.' },
            { id: 5, title: 'No Hate Speech', desc: 'Racism, hate speech or abusive content will not be tolerated.' },
            { id: 6, title: 'Follow Admin Instructions', desc: 'Respect the decisions made by moderators.' }
          ],
          mods: [
            { name: 'Arun Kumar', username: 'arunkumar', role: 'Admin', status: 'Online', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' },
            { name: 'Priya Natarajan', username: 'priyanatarajan', role: 'Mod', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
            { name: 'Vikram R', username: 'vikram_r', role: 'Mod', status: 'Online', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
            { name: 'Kavya S', username: 'kavya_s', role: 'Mod', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80' },
            { name: 'Senthil P', username: 'senthil_p', role: 'Mod', status: 'Online', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80' }
          ],
          stats: {
            members: '125K',
            online: '1.2K',
            posts: '8.4K',
            comments: '24K',
            growth: [10000, 25000, 50000, 75000, 100000, 125000],
            postTrends: [120, 200, 180, 250, 310, 280],
            heatmap: [
              [2, 3, 1, 5, 2, 4, 3],
              [1, 2, 0, 3, 1, 2, 2],
              [4, 5, 3, 8, 4, 6, 5]
            ]
          },
          posts: [
            { id: 'cp1', authorName: 'Arun Kumar', authorHandle: 'arunkumar', authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', text: 'Heavy rain alert in Chennai. Stay safe and avoid non-essential travel.', time: '2h', likes: 128, commentsCount: 24, pinned: true },
            { id: 'cp2', authorName: 'Vikram R', authorHandle: 'vikram_r', authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', text: 'Metro Phase 2 construction updates: New diversions announced in Vadapalani.', time: '5h', likes: 64, commentsCount: 12, pinned: false }
          ]
        },
        {
          id: 'c2',
          name: 'AI Developers India',
          handle: 'ai_devs_india',
          category: 'Technology',
          members: 89000,
          online: 600,
          joined: false,
          description: 'For developers building AI-powered future in India.',
          createdDate: 'Mar 15, 2024',
          location: 'Bangalore, Karnataka, India',
          language: 'English',
          website: 'https://aidevsindia.org',
          type: 'Public',
          tags: ['Tech', 'AI', 'Coding', 'ML', 'LLMs'],
          rules: [
            { id: 1, title: 'Keep it Technical', desc: 'Discuss AI/ML algorithms and tools.' }
          ],
          mods: [
            { name: 'Senthil P', username: 'senthil_p', role: 'Admin', status: 'Online', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80' }
          ],
          stats: { members: '89K', online: '600', posts: '4.2K', comments: '12K', growth: [5000, 20000, 45000, 89000], postTrends: [50, 120, 240, 310] },
          posts: []
        },
        {
          id: 'c3',
          name: 'Startups India',
          handle: 'startups_india',
          category: 'Business',
          members: 76000,
          online: 450,
          joined: false,
          description: 'Founders, builders and startup enthusiasts.',
          createdDate: 'Oct 05, 2022',
          location: 'Mumbai, Maharashtra, India',
          language: 'English',
          website: 'https://desi-startups.com',
          type: 'Public',
          tags: ['Business', 'Venture', 'Funding', 'Growth'],
          rules: [
            { id: 1, title: 'No Spam Pitching', desc: 'Avoid spamming startup pitches in comments.' }
          ],
          mods: [
            { name: 'Kavya S', username: 'kavya_s', role: 'Admin', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80' }
          ],
          stats: { members: '76K', online: '450', posts: '3.8K', comments: '9K', growth: [1000, 15000, 40000, 76000], postTrends: [30, 80, 150, 190] },
          posts: []
        }
      ];
      
      localStorage.setItem('aws_dynamodb_communities', JSON.stringify(defaultComms));
      return defaultComms;
    } catch (e) {
      console.error('Error reading mock communities:', e);
      return [];
    }
  },

  async saveCommunity(newComm) {
    try {
      const comms = await this.getCommunities();
      comms.push(newComm);
      localStorage.setItem('aws_dynamodb_communities', JSON.stringify(comms));
      return { success: true, list: comms };
    } catch (e) {
      return { success: false, error: e };
    }
  },

  async joinCommunity(commId) {
    try {
      const comms = await this.getCommunities();
      const updated = comms.map(c => {
        if (c.id === commId) {
          return { ...c, joined: true, members: c.members + 1 };
        }
        return c;
      });
      localStorage.setItem('aws_dynamodb_communities', JSON.stringify(updated));
      return { success: true, list: updated };
    } catch (e) {
      return { success: false, error: e };
    }
  },

  async leaveCommunity(commId) {
    try {
      const comms = await this.getCommunities();
      const updated = comms.map(c => {
        if (c.id === commId) {
          return { ...c, joined: false, members: Math.max(0, c.members - 1) };
        }
        return c;
      });
      localStorage.setItem('aws_dynamodb_communities', JSON.stringify(updated));
      return { success: true, list: updated };
    } catch (e) {
      return { success: false, error: e };
    }
  },

  async updateCommunitySettings(commId, updatedFields) {
    try {
      const comms = await this.getCommunities();
      const updated = comms.map(c => {
        if (c.id === commId) {
          return { ...c, ...updatedFields };
        }
        return c;
      });
      localStorage.setItem('aws_dynamodb_communities', JSON.stringify(updated));
      return { success: true, list: updated };
    } catch (e) {
      return { success: false, error: e };
    }
  }
};
