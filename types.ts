
export interface Gift {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  gift?: Gift;
  imageUrl?: string;
  audioData?: string; // Base64 string for voice messages
}

export interface ChatSession {
    characterId: number;
    messages: Message[];
    unread?: boolean;
    diary?: string[];
}

export interface UserProfile {
  name:string;
  avatar: string;
  isNsfwEnabled: boolean;
  age: number;
  gender: 'male' | 'female' | 'other';
  coins: number;
}


export enum AppScreen {
  HOME = 'HOME',
  INSTAGRAM = 'INSTAGRAM',
  NOTES = 'NOTES',
  BANK = 'BANK',
  GOOGLE = 'GOOGLE',
  PHONE = 'PHONE',
  MESSAGES = 'MESSAGES',
  TIKTOK = 'TIKTOK',
  X = 'X',
  CAMERA = 'CAMERA',
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  likedByUser: boolean;
}

export interface TikTokPost {
  id: string;
  userAvatar: string;
  username: string;
  videoUrl: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
}

export interface Tweet {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
}


export interface PhoneConfig {
  wallpaper: string;
  apps: AppScreen[];
  dockApps: AppScreen[];
}

export interface Note {
    id: string;
    title: string;
    content: string;
}

export interface BankTransaction {
    id: string;
    merchant: string;
    amount: number;
    type: 'debit' | 'credit';
    date: string;
}

export interface BankData {
    balance: number;
    bankName: string;
    accountNumber: string;
    transactions: BankTransaction[];
}

export interface SocialProfile {
    handle: string;
    followers: string;
    following: string;
    postsCount: number;
    bio: string;
    verified?: boolean;
}

export interface Contact {
    name: string;
    status: string;
    avatar?: string;
    time?: string;
}

export interface PhoneMessage {
    id: string;
    sender: string;
    text: string;
    time: string;
    unread: boolean;
    avatar?: string;
}

export interface CharacterAppContent {
    instagram?: {
        profile: SocialProfile;
        posts: InstagramPost[];
    };
    tiktok?: {
        profile: SocialProfile;
        posts: TikTokPost[];
    };
    x?: {
        profile: SocialProfile;
        posts: Tweet[];
    };
    notes?: Note[];
    bank?: BankData;
    contacts?: Contact[];
    messages?: PhoneMessage[];
    searchHistory?: string[];
}

export interface DiscoverCharacter {
  id: number;
  name: string;
  author: string;
  views: string;
  image: string;
  description: string;
  tags: string[];
  systemInstruction: string;
  firstMessage: string;
  phoneConfig: PhoneConfig;
  appContent: CharacterAppContent;
}

export interface Reply {
  id: number;
  author: string;
  avatar: string;
  text: string;
}

export interface UserPost {
  id: number;
  author: string;
  avatar: string;
  date: string;
  content: string;
  replies: Reply[];
}

export interface CollectionItem {
    id: number;
    name: string;
    image: string;
}
