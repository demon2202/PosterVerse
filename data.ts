
import { Poster, User, Notification, Thread } from './types';

// Realistic Users with UUID-style IDs
export const MOCK_USERS: User[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    username: 'alex_rivera',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Visual Alchemist. Creating worlds one pixel at a time.',
    followers: 12500,
    following: 450,
    isTrending: true,
  },
  {
    id: 'c920c7b3-c4e9-4b2a-8f5c-9c3d2f1b8a9d',
    username: 'sarah_chen',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Form follows malfunction. Brutalist enthusiast.',
    followers: 8200,
    following: 200,
    isTrending: true,
  },
  {
    id: '5a3d9e8f-2b1c-4d6a-9e0f-8c7b6a5d4e3f',
    username: 'mike_ross',
    name: 'Mike Ross',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
    bio: 'Chasing the perfect gradient.',
    followers: 3400,
    following: 800,
  },
  {
    id: '8b2a1c0d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
    username: 'jess_pearson',
    name: 'Jessica Pearson',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: 'Typography is the voice of design.',
    followers: 56000,
    following: 12,
    isTrending: true,
  },
  {
    id: '3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f',
    username: 'harvey_specter',
    name: 'Harvey Specter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Abstract minimalism. Less is more.',
    followers: 900,
    following: 150,
  },
  {
    id: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d',
    username: 'louis_litt',
    name: 'Louis Litt',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop',
    bio: 'Mudding & Designing.',
    followers: 4500,
    following: 300,
  },
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    username: 'marcus_stone',
    name: 'Marcus Stone',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    bio: 'Digital sculptor. 3D & VR.',
    followers: 2100,
    following: 150,
  },
  {
    id: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b',
    username: 'elena_fisher',
    name: 'Elena Fisher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    bio: 'Capturing light in motion.',
    followers: 8900,
    following: 400,
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    username: 'david_kim',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400&h=400&fit=crop',
    bio: 'UI/UX & Generative Art.',
    followers: 5500,
    following: 220,
  },
   {
    id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    username: 'zara_x',
    name: 'Zara X',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    bio: 'Cyberpunk aesthetic only.',
    followers: 33000,
    following: 10,
    isTrending: true,
  },
  {
    id: 'b8e92f1a-5c6d-4e3f-2a1b-0c9d8e7f6a5b',
    username: 'kai_zen',
    name: 'Kai Zen',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop',
    bio: 'Minimalist. Nature inspired.',
    followers: 1200,
    following: 50,
  },
  {
    id: 'f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
    username: 'lucy_sky',
    name: 'Lucy Sky',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    bio: 'Dreamscape photographer.',
    followers: 9800,
    following: 300,
    isTrending: true,
  }
];

const TAGS = ['typography', '3d', 'minimal', 'grunge', 'abstract', 'swiss', 'cyberpunk', 'retro', 'bauhaus', 'surreal'];
const COLORS = [['#FF5733', '#33FF57', '#3357FF'], ['#000000', '#FFFFFF', '#FF0000'], ['#FF00FF', '#00FFFF', '#FFFF00'], ['#1a1a1a', '#4a4a4a', '#8b5cf6']];

export const MOCK_POSTERS: Poster[] = Array.from({ length: 45 }).map((_, i) => {
  const user = MOCK_USERS[i % MOCK_USERS.length];
  // Deterministic random for consistent hydration
  const seed = (i * 12345) % 1000; 
  return {
    id: `poster-${i}-${seed}-uuid`,
    title: `Poster Layout ${i + 1}`,
    description: 'Exploration of form, color and negative space. Created using Blender and Photoshop. AI-enhanced workflow.',
    imageUrl: `https://picsum.photos/seed/${seed}/800/1000`,
    creatorId: user.id,
    creator: user,
    likes: Math.floor(Math.random() * 5000) + 100,
    tags: [TAGS[i % TAGS.length], TAGS[(i + 1) % TAGS.length]],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    colors: COLORS[i % COLORS.length],
    license: i % 3 === 0 ? 'commercial' : 'personal',
  };
});

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like', text: 'liked your "Swiss Style" poster', userId: MOCK_USERS[1].username, userAvatar: MOCK_USERS[1].avatar, read: false, time: '2m ago' },
  { id: 'n2', type: 'follow', text: 'started following you', userId: MOCK_USERS[2].username, userAvatar: MOCK_USERS[2].avatar, read: false, time: '1h ago' },
  { id: 'n3', type: 'system', text: 'Welcome to FrameShift! Complete your profile.', read: true, time: '1d ago' },
];

export const MOCK_THREADS: Thread[] = [
  {
    id: 't1',
    userId: MOCK_USERS[1].id,
    user: MOCK_USERS[1],
    lastMessage: 'Love your latest work! Do you take commissions?',
    unread: 2,
    messages: [
      { id: 'm1', senderId: MOCK_USERS[1].id, text: 'Hey there!', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', senderId: MOCK_USERS[1].id, text: 'Love your latest work! Do you take commissions?', timestamp: '10:01 AM', isMe: false },
    ]
  },
  {
    id: 't2',
    userId: MOCK_USERS[2].id,
    user: MOCK_USERS[2],
    lastMessage: 'Thanks for the feedback.',
    unread: 0,
    messages: [
      { id: 'm3', senderId: 'me', text: 'The gradients in your last post were fire.', timestamp: 'Yesterday', isMe: true },
      { id: 'm4', senderId: MOCK_USERS[2].id, text: 'Thanks for the feedback.', timestamp: 'Yesterday', isMe: false },
    ]
  }
];
