import { DiscoverCharacter, CollectionItem, ChatSession, Gift, UserPost, AppScreen } from './types';

export const mockCharacters: DiscoverCharacter[] = [];

export const mockCollectionItems: CollectionItem[] = [
    { id: 1, name: "Kẹp tóc hoa", image: 'https://i.pinimg.com/564x/5a/f3/f9/5af3f99e083f2a833503f19a0082f173.jpg' },
    { id: 2, name: "Cún Alaska", image: 'https://i.pinimg.com/564x/b1/7d/51/b17d5193910543e2f07f4e747209e530.jpg' },
    { id: 3, name: "Piano", image: 'https://i.pinimg.com/564x/a4/0f/50/a40f507722650059f0f9b6e680a6b.jpg' },
    { id: 4, name: "Mì cay", image: 'https://i.pinimg.com/564x/e0/75/f2/e075f2b8471c66280436d41b65893d5c.jpg' },
];

export const randomThoughts: string[] = [
    "Hôm nay crush xinh thế nhở?",
    "Rep story của ẻm mới đc",
    "Chắc rủ đi cf quá",
    "Nói gì cho ngầu giờ ta?",
    "Dính lun rồi, sao giờ 🥺",
    "U là trời, tim tui...",
];

export const availableGifts: Gift[] = [
    { id: 'rose', name: 'Đoá hồng tình iu', description: 'Tặng em đoá hồng nè 🌹', icon: '🌹' },
    { id: 'chocolate', name: 'Socola ngọt ngào', description: 'Ngọt như em zậy đó 🍫', icon: '🍫' },
    { id: 'ring', name: 'Nhẫn "chốt đơn"', description: 'Mình cưới nhau đi 💍', icon: '💍' },
    { id: 'teddy_bear', name: 'Gấu bông ôm ngủ', description: 'Ôm anh ngủ cho ngon 🧸', icon: '🧸' },
    { id: 'cake', name: 'Bánh kem "iu" bạn', description: 'Chúc mừng sinh nhật tình iu 🎂', icon: '🎂' },
    { id: 'perfume', name: 'Nước hoa "say yes"', description: 'Mùi hương này là của em 🧴', icon: '🧴' },
];


export const mockChatSessions: ChatSession[] = [];

export const mockFeedPosts: UserPost[] = [
    { 
        id: 1, 
        author: 'pyon', 
        avatar: 'https://i.pinimg.com/564x/1b/83/b6/1b83b6348184f23b247f311c18d19736.jpg', 
        date: '10-01', 
        content: 'muốn ở gần em quá đột nhiên nhớ vậy ó', 
        replies: []
    },
    { 
        id: 2, 
        author: 'pyon', 
        avatar: 'https://i.pinimg.com/564x/1b/83/b6/1b83b6348184f23b247f311c18d19736.jpg', 
        date: '09-30', 
        content: 'nhớ em quá', 
        replies: []
    },
    { 
        id: 3, 
        author: 'pyon', 
        avatar: 'https://i.pinimg.com/564x/1b/83/b6/1b83b6348184f23b247f311c18d19736.jpg', 
        date: '09-30', 
        content: 'nhìn em là anh cứng 😭', 
        replies: []
    },
];