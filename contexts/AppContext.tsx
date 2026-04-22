
import React, { createContext, useState, useCallback, useEffect, ReactNode, useMemo, useRef } from 'react';
import { Message, DiscoverCharacter, InstagramPost, UserPost, ChatSession, UserProfile, Gift, Reply, AppScreen } from '../types';
import { getAIResponseText, generateSpeech, generateImage } from '../services/geminiService';
import { decode } from '../utils/audioUtils';
import { mockCharacters, mockChatSessions, availableGifts, mockFeedPosts } from '../mockData';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
    auth, 
    db, 
    loginAsGuest as firebaseGuestLogin
} from '../services/firebase';

type RecentChat = {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    date: string;
    unread: boolean;
    activeTime?: number; // Add activeTime for sorting
};

interface ConfirmationModalConfig {
    title: string;
    message: string;
    onConfirm: () => void;
}

interface AppContextType {
  characterProfile: DiscoverCharacter | null;
  activeChatSession: ChatSession | null;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  messages: Message[];
  sendMessage: (text: string) => void;
  sendImage: (imageData: string, mimeType: string, text?: string) => void;
  sendGift: (gift: Gift, text: string) => void;
  editMessage: (id: string, newText: string) => void;
  deleteMessage: (id: string) => void;
  isLoading: boolean;
  resetChat: () => void;
  playAudio: (text: string) => void;
  isAudioPlaying: boolean;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  isChatting: boolean;
  openChat: () => void;
  closeChat: () => void;
  isPhoneOpen: boolean;
  setIsPhoneOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  instagramPosts: InstagramPost[];
  isGeneratingPosts: boolean;
  generateInstagramPosts: () => void;
  toggleLikePost: (id: string) => void;
  isComingSoonModalOpen: boolean;
  setIsComingSoonModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  comingSoonModalContent: { title: string, message: string };
  setComingSoonModalContent: React.Dispatch<React.SetStateAction<{ title: string, message: string }>>;
  isCreateCharacterModalOpen: boolean;
  setIsCreateCharacterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDiaryModalOpen: boolean;
  setIsDiaryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isGiftModalOpen: boolean;
  setIsGiftModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRewardsModalOpen: boolean;
  setIsRewardsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isWallpaperModalOpen: boolean;
  setIsWallpaperModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPhoneWallpaper: (url: string) => void;
  startChatWithCharacter: (character: DiscoverCharacter) => void;
  regenerateLastResponse: () => void;
  askInnerThoughts: () => void;
  posts: UserPost[];
  addUserPost: (content: string) => void;
  addReply: (postId: number, replyText: string) => void;
  recentChats: RecentChat[];
  allCharacters: DiscoverCharacter[];
  userCharacters: DiscoverCharacter[];
  addCharacter: (character: Omit<DiscoverCharacter, 'id' | 'views' | 'author' | 'phoneConfig' | 'appContent'>) => void;
  isCalling: boolean;
  callStatus: 'idle' | 'calling' | 'connected' | 'ended';
  startCall: () => void;
  endCall: () => void;
  isConfirmationModalOpen: boolean;
  setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmationModalConfig: ConfirmationModalConfig;
  showConfirmationModal: (config: ConfirmationModalConfig) => void;
  isRedeemCodeModalOpen: boolean;
  setIsRedeemCodeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  redeemCode: (code: string) => { success: boolean; message: string; reward?: number };
  addCoins: (amount: number) => void;
  user: FirebaseUser | null;
  isAuthLoading: boolean;
  authError: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const CHAT_COST = 1;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => getInitialState('chatSessions', mockChatSessions));
  const [activeCharacterId, setActiveCharacterId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getInitialState('userProfile', { 
    name: 'pyon', 
    avatar: 'https://i.pinimg.com/564x/1b/83/b6/1b83b6348184f23b247f311c18d19736.jpg', 
    isNsfwEnabled: false, 
    age: 25, 
    gender: 'male',
    coins: 100 
  }));
  
  const [systemCharacters, setSystemCharacters] = useState<DiscoverCharacter[]>(() => getInitialState('systemCharacters', mockCharacters));
  const [userCharacters, setUserCharacters] = useState<DiscoverCharacter[]>(() => getInitialState('userCharacters', []));
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeScreen, setActiveScreen] = useState('discover');
  const [isChatting, setIsChatting] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);
  
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [comingSoonModalContent, setComingSoonModalContent] = useState({ title: "Sắp ra mắt", message: "Tính năng này đang được phát triển." });
  const [isCreateCharacterModalOpen, setIsCreateCharacterModalOpen] = useState(false);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);

  const addCoins = useCallback((amount: number) => {
    setUserProfile(prev => ({ ...prev, coins: (prev.coins || 0) + amount }));
  }, []);

  const [posts, setPosts] = useState<UserPost[]>(() => getInitialState('posts', mockFeedPosts));
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalConfig, setConfirmationModalConfig] = useState<ConfirmationModalConfig>({
      title: '',
      message: '',
      onConfirm: () => {},
  });
  const [isRedeemCodeModalOpen, setIsRedeemCodeModalOpen] = useState(false);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            const randomNames = [
              'Người lạ bí ẩn', 'Mèo con đi lạc', 'Lữ hành cô độc', 'Kẻ mộng mơ', 
              'Chiến thần roleplay', 'Ẩn sĩ đại dương', 'Gấu con ngái ngủ', 
              'Thợ săn ánh trăng', 'Phù thủy nhỏ', 'Nhà ảo thuật', 'Kẻ lãng du',
              'Đom đóm đêm', 'Sói xám cô đơn', 'Thỏ ngọc', 'Sơn ca hót', 'Mây lang thang'
            ];
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
            const randomId = Math.floor(1000 + Math.random() * 9000);

            const newProfile: UserProfile = {
              name: firebaseUser.displayName || `${randomName} #${randomId}`,
              avatar: firebaseUser.photoURL || 'https://i.pinimg.com/564x/1b/83/b6/1b83b6348184f23b247f311c18d19736.jpg',
              isNsfwEnabled: false,
              age: 18,
              gender: 'other',
              coins: 500
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
          setIsAuthLoading(false);
        } else {
          // No user, login as guest automatically
          await firebaseGuestLogin();
          // onAuthStateChanged will trigger again with the guest user
        }
      } catch (error) {
        console.error("Error fetching user profile or background login:", error);
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isCallingRef = useRef(isCalling);

  useEffect(() => {
    isCallingRef.current = isCalling;
  }, [isCalling]);

  const allCharacters = useMemo(() => [...systemCharacters, ...userCharacters], [systemCharacters, userCharacters]);
  
  const characterMap = useMemo(() => {
    const map = new Map<number, DiscoverCharacter>();
    allCharacters.forEach(char => map.set(char.id, char));
    return map;
  }, [allCharacters]);

  const characterProfile = useMemo(() => {
    if (activeCharacterId === null) return null;
    return characterMap.get(activeCharacterId) || null;
  }, [activeCharacterId, characterMap]);

  const activeChatSession = useMemo(() => {
    if (activeCharacterId === null) return null;
    return chatSessions.find(s => s.characterId === activeCharacterId) || null;
  }, [activeCharacterId, chatSessions]);

  const messages = activeChatSession?.messages || [];

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);
  
  useEffect(() => {
    localStorage.setItem('systemCharacters', JSON.stringify(systemCharacters));
  }, [systemCharacters]);

  useEffect(() => {
    localStorage.setItem('userCharacters', JSON.stringify(userCharacters));
  }, [userCharacters]);

  useEffect(() => {
    if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        setDoc(userDocRef, userProfile);
    }
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile, user]);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);


  const playAudio = useCallback(async (text: string) => {
    if (isAudioPlaying) return;

    setIsAudioPlaying(true);
    const base64Audio = await generateSpeech(text);
    if (base64Audio) {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        
        try {
            const decodedData = decode(base64Audio);
            const dataInt16 = new Int16Array(decodedData.buffer);
            const frameCount = dataInt16.length;
            const buffer = audioContext.createBuffer(1, frameCount, 24000);
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i] / 32768.0;
            }

            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.onended = () => {
                setIsAudioPlaying(false);
                if (currentAudioSourceRef.current === source) {
                    currentAudioSourceRef.current = null;
                }
            };
            source.start();
            currentAudioSourceRef.current = source;
        } catch (error) {
            console.error("Error playing audio:", error);
            setIsAudioPlaying(false);
        }
    } else {
      setIsAudioPlaying(false);
    }
  }, [isAudioPlaying]);

  const getAIResponse = useCallback(async (text: string, imageInput?: { data: string, mimeType: string }) => {
    if (activeCharacterId === null || !characterProfile) return;
    
    setIsLoading(true);

    const aiResponseRaw = await getAIResponseText(
        characterProfile.systemInstruction,
        text,
        userProfile,
        activeChatSession?.messages || [],
        undefined,
        imageInput
    );
    
    let processedText = aiResponseRaw;
    let giftToSend: Gift | undefined = undefined;

    // Handle Gift
    const giftRegex = /\[GIFT:(\w+)\]/;
    const giftMatch = processedText.match(giftRegex);
    if (giftMatch) {
        const giftId = giftMatch[1];
        giftToSend = availableGifts.find(g => g.id === giftId);
        processedText = processedText.replace(giftRegex, '');
    }

    // Extract Image Commands
    const imgRegex = /\[IMG:(.*?)\]/;
    const imgMatch = processedText.match(imgRegex);
    let imgPrompt = '';
    if (imgMatch) {
        imgPrompt = imgMatch[1];
        processedText = processedText.replace(imgRegex, '');
    }

    // Extract Voice Commands
    const voiceRegex = /\[VOICE:(.*?)\]/;
    const voiceMatch = processedText.match(voiceRegex);
    let voiceText = '';
    if (voiceMatch) {
        voiceText = voiceMatch[1];
        processedText = processedText.replace(voiceRegex, '');
    }

    // Clean up residual tags
    processedText = processedText.replace(/\[(HAPPY|ANNOYED|SHY|SCORE:[+-]?\d+)\]/g, '').trim();

    // 6. Add Text Message First
    if (processedText) {
        const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            text: processedText,
            sender: 'ai',
            timestamp: Date.now(),
            gift: giftToSend,
        };
        setChatSessions(prev => prev.map(session => 
            session.characterId === activeCharacterId
            ? { ...session, messages: [...session.messages, aiMessage] }
            : session
        ));
    }

    setIsLoading(false);

    // 7. Handle Media Generation (Async)
    if (imgPrompt) {
         // Simulate typing or loading for image
         const loadingId = `loading-img-${Date.now()}`;
         // Could add a temp loading message here if desired
         
         generateImage(imgPrompt).then(imgUrl => {
             if (imgUrl) {
                 const imgMessage: Message = {
                     id: `ai-img-${Date.now()}`,
                     text: '',
                     imageUrl: imgUrl,
                     sender: 'ai',
                     timestamp: Date.now()
                 };
                 setChatSessions(prev => prev.map(session => 
                    session.characterId === activeCharacterId
                    ? { ...session, messages: [...session.messages, imgMessage] }
                    : session
                ));
             }
         });
    }

    if (voiceText) {
        generateSpeech(voiceText).then(audioBase64 => {
            if (audioBase64) {
                const audioMessage: Message = {
                    id: `ai-voice-${Date.now()}`,
                    text: '', // No text, purely audio bubble
                    audioData: audioBase64,
                    sender: 'ai',
                    timestamp: Date.now()
                };
                setChatSessions(prev => prev.map(session => 
                    session.characterId === activeCharacterId
                    ? { ...session, messages: [...session.messages, audioMessage] }
                    : session
                ));
            }
        });
    }

  }, [activeCharacterId, characterProfile, userProfile, activeChatSession]);

  const sendMessage = useCallback(async (text: string) => {
    if (activeCharacterId === null) return;
    
    // Check for coins
    if ((userProfile.coins || 0) < CHAT_COST) {
        setComingSoonModalContent({
            title: 'Hết Tim rồi!',
            message: `Bạn cần ít nhất ${CHAT_COST} Tim để tiếp tục trò chuyện. Hãy vào tab Nhiệm vụ để nhận thêm Tim nhé!`
        });
        setIsComingSoonModalOpen(true);
        return;
    }

    // Deduct coins
    setUserProfile(prev => ({ ...prev, coins: (prev.coins || 0) - CHAT_COST }));

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: Date.now()
    };
    setChatSessions(prev => prev.map(session => 
        session.characterId === activeCharacterId
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    ));
    await getAIResponse(text);
  }, [getAIResponse, activeCharacterId, userProfile]);

  const sendImage = useCallback(async (imageData: string, mimeType: string, text: string = "") => {
    if (activeCharacterId === null) return;
    
    // Check for coins
    if ((userProfile.coins || 0) < CHAT_COST) {
        setComingSoonModalContent({
            title: 'Hết Tim rồi!',
            message: `Bạn cần ít nhất ${CHAT_COST} Tim để tiếp tục trò chuyện. Hãy vào tab Nhiệm vụ để nhận thêm Tim nhé!`
        });
        setIsComingSoonModalOpen(true);
        return;
    }

    // Deduct coins
    setUserProfile(prev => ({ ...prev, coins: (prev.coins || 0) - CHAT_COST }));

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      imageUrl: imageData,
      sender: 'user',
      timestamp: Date.now()
    };
    
    setChatSessions(prev => prev.map(session => 
        session.characterId === activeCharacterId
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    ));
    
    // Extract base64 data from data URL
    const base64Data = imageData.split(',')[1];
    await getAIResponse(text, { data: base64Data, mimeType });
  }, [getAIResponse, activeCharacterId, userProfile]);
  
  const sendGift = useCallback(async (gift: Gift, text: string) => {
    if (activeCharacterId === null) return;
    
    setChatSessions(prev => prev.map(session => {
        if (session.characterId !== activeCharacterId) return session;
        const giftMessage: Message = {
            id: `user-gift-${Date.now()}`,
            text,
            sender: 'user',
            timestamp: Date.now(),
            gift: gift,
        };
        // Base score increase for sending a gift
        const updatedSession = { ...session, messages: [...session.messages, giftMessage] };
        return updatedSession;
    }));

    await getAIResponse(`*tôi đã gửi cho bạn ${gift.name} với lời nhắn: "${text}"*`);
  }, [activeCharacterId, getAIResponse]);

  const regenerateLastResponse = useCallback(async () => {
    if (activeCharacterId === null) return;

    const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
    if (!lastUserMessage) return;

    setChatSessions(prev => prev.map(session => {
        if (session.characterId !== activeCharacterId) return session;
        const lastMessage = session.messages[session.messages.length - 1];
        // Remove last AI message(s) if they exist (including images/audio that might have followed)
        const newMessages = session.messages.filter((_, idx) => idx <= session.messages.indexOf(lastUserMessage));
        return { ...session, messages: newMessages };
    }));

    await getAIResponse(lastUserMessage.text);
  }, [messages, getAIResponse, activeCharacterId]);

  const askInnerThoughts = useCallback(() => {
    sendMessage("Bạn đang nghĩ gì thế?");
  }, [sendMessage]);

  const addUserPost = useCallback(async (content: string) => {
    const newPost: UserPost = {
        id: Date.now(),
        author: userProfile.name,
        avatar: userProfile.avatar,
        date: new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit' }).format(new Date()).replace('/', '-'),
        content,
        replies: [],
    };
    
    setPosts(prev => [newPost, ...prev]);
  }, [userProfile]);

  const addReply = useCallback(async (postId: number, replyText: string) => {
    const userReply: Reply = {
        id: Date.now(),
        author: userProfile.name,
        avatar: userProfile.avatar,
        text: replyText,
    };

    let postToUpdate: UserPost | undefined;
    setPosts(prevPosts => prevPosts.map(p => {
        if (p.id === postId) {
            postToUpdate = { ...p, replies: [...p.replies, userReply] };
            return postToUpdate;
        }
        return p;
    }));

    if (!postToUpdate) return;
    const post = postToUpdate;

    const lastAiReplierName = [...post.replies].reverse().find(r => r.author !== userProfile.name)?.author;
    let aiToReply = allCharacters.find(c => c.name === lastAiReplierName);
    
    if (!aiToReply) {
        aiToReply = allCharacters.find(c => c.name === post.author);
    }
    
    if (aiToReply) {
        const prompt = `Trong một bài đăng có nội dung "${post.content}", người dùng ${userProfile.name} vừa trả lời: "${replyText}". Hãy phản hồi lại họ với tư cách là ${aiToReply.name}.`;
        const aiReplyText = await getAIResponseText(aiToReply.systemInstruction, prompt, userProfile);
        
        const aiReply: Reply = {
            id: Date.now() + 1,
            author: aiToReply.name,
            avatar: aiToReply.image,
            text: aiReplyText.replace(/\[(HAPPY|ANNOYED|SHY|GIFT:\w+|SCORE:[+-]?\d+|IMG:.*?|VOICE:.*?)\]/g, '').trim(),
        };
        
        setPosts(prevPosts => prevPosts.map(p => 
            p.id === postId ? { ...p, replies: [...p.replies, userReply, aiReply] } : p
        ));
    } else {
         setPosts(prevPosts => prevPosts.map(p => 
            p.id === postId ? { ...p, replies: [...p.replies, userReply] } : p
        ));
    }
  }, [posts, userProfile, allCharacters, characterMap]);

  const editMessage = (id: string, newText: string) => {
    if (activeCharacterId === null) return;
    setChatSessions(prev => prev.map(session => 
        session.characterId === activeCharacterId
        ? { ...session, messages: session.messages.map(msg => msg.id === id ? { ...msg, text: newText } : msg) }
        : session
    ));
  };
  
  const deleteMessage = (id: string) => {
    if (activeCharacterId === null) return;
    setChatSessions(prev => prev.map(session => 
        session.characterId === activeCharacterId
        ? { ...session, messages: session.messages.filter(msg => msg.id !== id) }
        : session
    ));
  };

  const showConfirmationModal = (config: ConfirmationModalConfig) => {
    setConfirmationModalConfig(config);
    setIsConfirmationModalOpen(true);
  };

  const resetChat = () => {
    if (activeCharacterId === null || !characterProfile) return;
    
    showConfirmationModal({
        title: "Đặt lại cuộc trò chuyện?",
        message: "Toàn bộ lịch sử tin nhắn với nhân vật này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn không?",
        onConfirm: () => {
            setChatSessions(prev => prev.map(session => 
                session.characterId === activeCharacterId
                ? { 
                    ...session, 
                    messages: [{
                        id: `ai-${Date.now()}`,
                        text: characterProfile.firstMessage,
                        sender: 'ai',
                        timestamp: Date.now(),
                    }]
                  }
                : session
            ));
        }
    });
  };

  const openChat = () => setIsChatting(true);
  const closeChat = () => setIsChatting(false);

  const startChatWithCharacter = (character: DiscoverCharacter) => {
    setActiveCharacterId(character.id);
    
    const existingSession = chatSessions.find(s => s.characterId === character.id);
    
    if (!existingSession) {
        const newSession: ChatSession = {
            characterId: character.id,
            messages: [{
                id: `ai-${Date.now()}`,
                text: character.firstMessage,
                sender: 'ai',
                timestamp: Date.now(),
            }]
        };
        setChatSessions(prev => [...prev, newSession]);
    } else if (existingSession.unread) {
        setChatSessions(prev => prev.map(s => 
            s.characterId === character.id ? { ...s, unread: false } : s
        ));
    }
    
    openChat();
  };
  
  const addCharacter = (characterData: Omit<DiscoverCharacter, 'id' | 'views' | 'author' | 'phoneConfig' | 'appContent'>) => {
    const newCharacter: DiscoverCharacter = {
        ...characterData,
        id: Date.now(),
        author: userProfile.name,
        views: '0',
        phoneConfig: {
            wallpaper: 'https://i.pinimg.com/564x/d5/36/44/d53644265d638971d2b8600d2da285d8.jpg',
            apps: [AppScreen.INSTAGRAM, AppScreen.NOTES, AppScreen.GOOGLE, AppScreen.TIKTOK],
            dockApps: [AppScreen.PHONE, AppScreen.MESSAGES, AppScreen.CAMERA, AppScreen.BANK]
        },
        appContent: {
            instagram: { profile: { handle: 'new_char', followers: '0', following: '0', postsCount: 0, bio: '' }, posts: [] },
            notes: [],
            bank: { balance: 0, bankName: 'Bank', accountNumber: '**** 0000', transactions: [] },
            messages: []
        }
    };
    setUserCharacters(prev => [...prev, newCharacter]);
  };
  
  const setPhoneWallpaper = (url: string) => {
    if (activeCharacterId === null) return;
    
    const isSystemChar = systemCharacters.some(c => c.id === activeCharacterId);
    
    if (isSystemChar) {
        setSystemCharacters(prev => 
            prev.map(char => 
                char.id === activeCharacterId 
                ? { ...char, phoneConfig: { ...char.phoneConfig, wallpaper: url } }
                : char
            )
        );
    } else {
        setUserCharacters(prev => 
            prev.map(char => 
                char.id === activeCharacterId 
                ? { ...char, phoneConfig: { ...char.phoneConfig, wallpaper: url } }
                : char
            )
        );
    }
  };

  const generateInstagramPosts = useCallback(async () => {
     // Deprecated in favor of static character data
  }, []);

  const toggleLikePost = useCallback((id: string) => {
    // Placeholder for future implementation
  }, []);

  const recentChats = useMemo(() => {
    return chatSessions
      .map(session => {
        const character = characterMap.get(session.characterId);
        if (!character) return null;
        const lastMessage = session.messages[session.messages.length - 1];
        let lastMessageText = 'Bắt đầu cuộc trò chuyện';
        if (lastMessage) {
            if(lastMessage.gift) {
                lastMessageText = `${lastMessage.sender === 'user' ? 'Bạn' : character.name} đã gửi một món quà.`;
            } else if (lastMessage.imageUrl) {
                lastMessageText = `${lastMessage.sender === 'user' ? 'Bạn' : character.name} đã gửi một ảnh.`;
            } else if (lastMessage.audioData) {
                lastMessageText = `${lastMessage.sender === 'user' ? 'Bạn' : character.name} đã gửi một tin nhắn thoại.`;
            } else {
                lastMessageText = lastMessage.text;
            }
        }
        
        return {
          id: character.id,
          name: character.name,
          avatar: character.image,
          lastMessage: lastMessageText,
          date: lastMessage ? new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit' }).format(new Date(lastMessage.timestamp)).replace('/', '-') : '',
          unread: session.unread || false,
          activeTime: lastMessage ? lastMessage.timestamp : 0
        };
      })
      .filter((c): c is RecentChat => c !== null)
      .sort((a, b) => (b.activeTime || 0) - (a.activeTime || 0));
}, [chatSessions, characterMap]);

    const endCall = useCallback(() => {
        setIsCalling(false);
        setCallStatus('ended');
        if (currentAudioSourceRef.current) {
            try {
                currentAudioSourceRef.current.stop();
            } catch (e) {
                console.warn("Could not stop audio source, it might have already finished.", e);
            }
            currentAudioSourceRef.current = null;
        }
        setIsAudioPlaying(false);
    }, []);

    const startCall = useCallback(() => {
        if (isCallingRef.current || !characterProfile || activeCharacterId === null) return;

        setIsCalling(true);
        setCallStatus('calling');

        setTimeout(async () => {
            if (!isCallingRef.current) return;

            setCallStatus('connected');
            const prompt = "*bạn vừa nhấc máy khi tôi gọi đến, hãy nói một lời chào tự nhiên.*";
            const aiResponseText = await getAIResponseText(
                characterProfile.systemInstruction,
                prompt,
                userProfile,
                activeChatSession?.messages || []
            );
            
            const cleanedText = aiResponseText.replace(/\[(HAPPY|ANNOYED|SHY|GIFT:\w+|SCORE:[+-]?\d+|IMG:.*?|VOICE:.*?)\]/g, '').trim();

            if (isCallingRef.current) {
                if (cleanedText) {
                    playAudio(cleanedText);
                } else {
                    playAudio("Alo?");
                }
            }
        }, 2500);
    }, [characterProfile, activeCharacterId, userProfile, activeChatSession, playAudio]);

  const redeemCode = useCallback((code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    let reward = 0;
    
    switch(normalizedCode) {
        case 'HEARTCHAT': reward = 1000; break;
        case 'LOVE': reward = 200; break;
        case 'START': reward = 500; break;
        default: return { success: false, message: 'Mã quà tặng không hợp lệ.' };
    }

    setUserProfile(prev => ({ ...prev, coins: prev.coins + reward }));
    return { success: true, message: `Bạn nhận được ${reward} xu!`, reward };
  }, []);

  const value = {
    characterProfile, activeChatSession, userProfile, setUserProfile,
    messages, sendMessage, sendImage, editMessage, deleteMessage, sendGift,
    isLoading, resetChat,
    playAudio, isAudioPlaying,
    activeScreen, setActiveScreen,
    isChatting, openChat, closeChat,
    isPhoneOpen, setIsPhoneOpen,
    isSettingsOpen, setIsSettingsOpen,
    instagramPosts, isGeneratingPosts, generateInstagramPosts, toggleLikePost,
    isComingSoonModalOpen, setIsComingSoonModalOpen,
    comingSoonModalContent, setComingSoonModalContent,
    isCreateCharacterModalOpen, setIsCreateCharacterModalOpen,
    isDiaryModalOpen, setIsDiaryModalOpen,
    isGiftModalOpen, setIsGiftModalOpen,
    isRewardsModalOpen, setIsRewardsModalOpen,
    isNotificationsModalOpen, setIsNotificationsModalOpen,
    isWallpaperModalOpen, setIsWallpaperModalOpen,
    setPhoneWallpaper,
    startChatWithCharacter,
    regenerateLastResponse,
    askInnerThoughts,
    posts, addUserPost, addReply,
    recentChats,
    allCharacters, userCharacters, addCharacter,
    isCalling, callStatus, startCall, endCall,
    isConfirmationModalOpen, setIsConfirmationModalOpen,
    confirmationModalConfig, showConfirmationModal,
    isRedeemCodeModalOpen, setIsRedeemCodeModalOpen,
    redeemCode,
    addCoins,
    user, isAuthLoading, authError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
