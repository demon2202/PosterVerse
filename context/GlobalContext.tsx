
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Poster, Follow, Message, Story, Like, Saved, Notification } from '../types';
import { MOCK_USERS, MOCK_POSTERS, MOCK_NOTIFICATIONS } from '../data';

// --- Database Schema (LocalStorage Keys) ---
const DB = {
  USERS: 'pv_users',
  POSTERS: 'pv_posters',
  FOLLOWS: 'pv_follows',
  LIKES: 'pv_likes',
  SAVES: 'pv_saves',
  MESSAGES: 'pv_messages',
  STORIES: 'pv_stories',
  SESSION: 'pv_session',
  VERSION: 'pv_db_version_v2' // Changed to avoid conflict but logic to wipe is removed below
};

interface GlobalContextType {
  // Auth State
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;

  // Data Accessors (Reads)
  allUsers: User[]; 
  posters: Poster[];
  getAllPosters: () => Poster[];
  getFeed: () => Poster[];
  getUserPosters: (userId: string) => Poster[];
  getUserStats: (userId: string) => { followers: number; following: number; posts: number };
  getStories: () => (Story & { user: User })[];
  getConversations: () => { user: User; lastMessage: Message; unreadCount: number }[];
  getMessages: (otherUserId: string) => Message[];
  
  // Actions (Writes)
  addPoster: (poster: Poster) => void;
  toggleFollow: (targetUserId: string) => void;
  isFollowing: (targetUserId: string) => boolean;
  toggleLike: (posterId: string) => void;
  isLiked: (posterId: string) => boolean;
  getLikeCount: (posterId: string) => number;
  toggleSave: (posterId: string) => void;
  isSaved: (posterId: string) => boolean;
  sendMessage: (receiverId: string, text: string) => void;
  addStory: (imageUrl: string) => void;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAsRead: () => void;

  // Additional Lists
  likedPosters: string[];
  savedPosters: string[];
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Core State
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  
  // Auxiliary State
  const [follows, setFollows] = useState<Follow[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [saves, setSaves] = useState<Saved[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // --- Helpers ---
  const loadCollection = <T,>(key: string, defaultData: T[] = []): T[] => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultData;
    } catch {
        return defaultData;
    }
  };

  const saveCollection = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // --- Initialization ---
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) setTheme(savedTheme);

    // Initialize Data
    // We check if data exists; if not, we use MOCK data.
    // IMPORTANT: We do NOT wipe data on version change anymore to preserve user data.
    
    let loadedUsers = loadCollection<User>(DB.USERS);
    if (loadedUsers.length === 0) {
        loadedUsers = MOCK_USERS;
        saveCollection(DB.USERS, loadedUsers);
    }
    setAllUsers(loadedUsers);

    let loadedPosters = loadCollection<Poster>(DB.POSTERS);
    if (loadedPosters.length === 0) {
        loadedPosters = MOCK_POSTERS;
        saveCollection(DB.POSTERS, loadedPosters);
    }
    setPosters(loadedPosters);

    // Load Relationships
    setFollows(loadCollection<Follow>(DB.FOLLOWS));
    setLikes(loadCollection<Like>(DB.LIKES));
    setSaves(loadCollection<Saved>(DB.SAVES));
    setMessages(loadCollection<Message>(DB.MESSAGES));
    setStories(loadCollection<Story>(DB.STORIES));

    // Session Restore
    const session = localStorage.getItem(DB.SESSION);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        console.error("Failed to restore session", e);
        localStorage.removeItem(DB.SESSION);
      }
    }
    setIsLoading(false);
  }, []);

  // Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getUserById = (id: string): User | undefined => {
    return allUsers.find(u => u.id === id);
  };

  // --- Auth Methods ---
  const login = async (email: string, pass: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Refetch fresh users from state
    const isEmail = email.includes('@');
    const found = allUsers.find(u => 
      (isEmail && (u as any).email === email) || 
      (!isEmail && u.username.toLowerCase() === email.toLowerCase())
    ); 
    
    if (found) {
      if ((found as any).password && (found as any).password !== pass) {
         throw new Error("Invalid password.");
      }
      const safeUser = { ...found };
      // Keep sensitive data out of session/state if possible, but we need password for mock check
      setUser(safeUser);
      localStorage.setItem(DB.SESSION, JSON.stringify(safeUser));
    } else {
      throw new Error("User not found.");
    }
  };

  const register = async (email: string, pass: string, username: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (allUsers.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error("Username is already taken.");
    }
    if (allUsers.find(u => (u as any).email === email)) {
        throw new Error("Email is already registered.");
    }
    
    const newUser: User = {
      id: `u_${Date.now()}`,
      username,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: 'New Creator',
      joinedAt: new Date().toISOString(),
      followers: 0,
      following: 0,
    };
    
    // Store with password
    const dbUser = { ...newUser, password: pass, email };
    
    // Update State AND LocalStorage
    const newAllUsers = [...allUsers, dbUser];
    setAllUsers(newAllUsers);
    saveCollection(DB.USERS, newAllUsers);
    
    setUser(newUser);
    localStorage.setItem(DB.SESSION, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(DB.SESSION);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    
    const updatedUsers = allUsers.map(u => u.id === user.id ? { ...u, ...data } : u);
    setAllUsers(updatedUsers);
    saveCollection(DB.USERS, updatedUsers);
    
    setUser(updatedUser);
    localStorage.setItem(DB.SESSION, JSON.stringify(updatedUser));
  };

  // --- Data Accessors ---

  // Hydrate posters with creator data
  const getAllPosters = (): Poster[] => {
    return posters.map(p => ({
      ...p,
      creator: getUserById(p.creatorId) || { id: 'unknown', username: 'Unknown', name: 'Unknown', avatar: '', joinedAt: '' }
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getFeed = (): Poster[] => {
    if (!user) return [];
    const followingIds = follows.filter(f => f.followerId === user.id).map(f => f.followingId);
    followingIds.push(user.id);

    // We use the hydrated getter here
    const all = getAllPosters();
    return all.filter(p => followingIds.includes(p.creatorId));
  };

  const getUserPosters = (userId: string) => getAllPosters().filter(p => p.creatorId === userId);

  const getUserStats = (userId: string) => {
    const followers = follows.filter(f => f.followingId === userId).length;
    const following = follows.filter(f => f.followerId === userId).length;
    const posts = posters.filter(p => p.creatorId === userId).length;
    return { followers, following, posts };
  };

  // --- Social Actions ---

  const toggleFollow = (targetId: string) => {
    if (!user) return;
    const existing = follows.find(f => f.followerId === user.id && f.followingId === targetId);
    
    let newFollows;
    if (existing) {
      newFollows = follows.filter(f => f.id !== existing.id);
    } else {
      newFollows = [...follows, {
        id: `f_${Date.now()}`,
        followerId: user.id,
        followingId: targetId,
        createdAt: new Date().toISOString()
      }];
    }
    setFollows(newFollows);
    saveCollection(DB.FOLLOWS, newFollows);
  };

  const isFollowing = (targetId: string) => {
    if (!user) return false;
    return follows.some(f => f.followerId === user.id && f.followingId === targetId);
  };

  const toggleLike = (posterId: string) => {
    if (!user) return;
    const exists = likes.some(l => l.userId === user.id && l.posterId === posterId);
    let newLikes;
    if (exists) {
        newLikes = likes.filter(l => !(l.userId === user.id && l.posterId === posterId));
    } else {
        newLikes = [...likes, { userId: user.id, posterId }];
    }
    setLikes(newLikes);
    saveCollection(DB.LIKES, newLikes);
  };

  const isLiked = (posterId: string) => {
    if (!user) return false;
    return likes.some(l => l.userId === user.id && l.posterId === posterId);
  };

  const getLikeCount = (posterId: string) => {
    return likes.filter(l => l.posterId === posterId).length;
  };

  const toggleSave = (posterId: string) => {
    if (!user) return;
    const exists = saves.some(s => s.userId === user.id && s.posterId === posterId);
    let newSaves;
    if (exists) {
        newSaves = saves.filter(s => !(s.userId === user.id && s.posterId === posterId));
    } else {
        newSaves = [...saves, { userId: user.id, posterId }];
    }
    setSaves(newSaves);
    saveCollection(DB.SAVES, newSaves);
  };

  const isSaved = (posterId: string) => {
    if (!user) return false;
    return saves.some(s => s.userId === user.id && s.posterId === posterId);
  };

  const addPoster = (posterData: Poster) => {
    const newPosters = [posterData, ...posters];
    setPosters(newPosters);
    saveCollection(DB.POSTERS, newPosters);
  };

  // --- Messaging ---
  
  const sendMessage = (receiverId: string, text: string) => {
    if (!user) return;
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: user.id,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    saveCollection(DB.MESSAGES, newMessages);
  };

  const getConversations = () => {
    if (!user) return [];
    const myMessages = messages.filter(m => m.senderId === user.id || m.receiverId === user.id);
    
    const threadMap = new Map<string, Message>();
    myMessages.forEach(m => {
      const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
      const existing = threadMap.get(otherId);
      if (!existing || new Date(m.timestamp) > new Date(existing.timestamp)) {
        threadMap.set(otherId, m);
      }
    });

    const threads: any[] = [];
    threadMap.forEach((lastMsg, otherId) => {
      const otherUser = getUserById(otherId);
      if (otherUser) {
        const unread = myMessages.filter(m => m.senderId === otherId && m.receiverId === user.id && !m.read).length;
        threads.push({ user: otherUser, lastMessage: lastMsg, unreadCount: unread });
      }
    });

    return threads.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
  };

  const getMessages = (otherUserId: string) => {
    if (!user) return [];
    return messages.filter(m => 
      (m.senderId === user.id && m.receiverId === otherUserId) || 
      (m.senderId === otherUserId && m.receiverId === user.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  // --- Stories ---

  const addStory = (imageUrl: string) => {
    if (!user) return;
    const newStories = [...stories, {
      id: `st_${Date.now()}`,
      userId: user.id,
      imageUrl,
      timestamp: new Date().toISOString(),
      viewers: []
    }];
    setStories(newStories);
    saveCollection(DB.STORIES, newStories);
  };

  const getStories = () => {
    if (!user) return [];
    const followingIds = follows.filter(f => f.followerId === user.id).map(f => f.followingId);
    followingIds.push(user.id); 

    const now = new Date();
    
    return stories
      .filter(s => {
         const storyTime = new Date(s.timestamp);
         const diffHrs = (now.getTime() - storyTime.getTime()) / (1000 * 60 * 60);
         return diffHrs < 24 && followingIds.includes(s.userId);
      })
      .map(s => ({ ...s, user: getUserById(s.userId)! }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const likedPosters = user ? likes.filter(l => l.userId === user.id).map(l => l.posterId) : [];
  const savedPosters = user ? saves.filter(s => s.userId === user.id).map(s => s.posterId) : [];

  return (
    <GlobalContext.Provider value={{ 
      user, isLoading, login, register, logout, updateUserProfile, theme, toggleTheme,
      allUsers,
      posters: getAllPosters(), getAllPosters, getFeed, getUserPosters, getUserStats,
      toggleFollow, isFollowing,
      toggleLike, isLiked, getLikeCount,
      toggleSave, isSaved,
      addPoster,
      sendMessage, getConversations, getMessages,
      addStory, getStories,
      notifications, unreadCount, markAsRead,
      likedPosters, savedPosters
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) throw new Error('useGlobalContext must be used within a GlobalProvider');
  return context;
};
