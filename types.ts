
export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  joinedAt?: string;
  followers?: number;
  following?: number;
  isTrending?: boolean;
}

export interface Poster {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creatorId: string;
  creator: User; // Hydrated on fetch
  tags: string[];
  createdAt: string;
  colors: string[];
  license: 'personal' | 'commercial';
  likes: number;
}

// Normalized Relationships
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Like {
  userId: string;
  posterId: string;
}

export interface Saved {
  userId: string;
  posterId: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: string; // Expires in 24h
  viewers: string[];
}

export interface Notification {
  id: string;
  type: 'like' | 'follow' | 'message' | 'system';
  actorId?: string; // Who did it
  targetUserId?: string; // Who received it
  referenceId?: string; // posterId or messageId
  read: boolean;
  time: string;
  text?: string;
  userAvatar?: string;
  userId?: string;
}

export interface ThreadMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Thread {
  id: string;
  userId: string;
  user: User;
  lastMessage: string;
  unread: number;
  messages: ThreadMessage[];
}
