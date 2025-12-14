export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
    isRead: boolean;
    isMine: boolean;
}

export interface Conversation {
    id: string;
    participantName: string;
    lastMessage: string;
    unreadCount: number;
    avatar?: string;
    timestamp: number;
}

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'c1',
        participantName: 'Coach Sarah',
        lastMessage: 'Great progress this week! Keep it up.',
        unreadCount: 1,
        timestamp: Date.now() - 1000 * 60 * 5 // 5 mins ago
    },
    {
        id: 'c2',
        participantName: 'Dr. Mike',
        lastMessage: 'Don\'t forget to track your water intake.',
        unreadCount: 0,
        timestamp: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
    },
    {
        id: 'c3',
        participantName: 'Support Team',
        lastMessage: 'Your subscription has been renewed.',
        unreadCount: 0,
        timestamp: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
    }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
    'c1': [
        { id: 'm1', senderId: 'coach', senderName: 'Coach Sarah', text: 'Hey! How are you feeling today?', timestamp: Date.now() - 100000, isRead: true, isMine: false },
        { id: 'm2', senderId: 'me', senderName: 'Me', text: 'Feeling great, thanks similar to last week.', timestamp: Date.now() - 90000, isRead: true, isMine: true },
        { id: 'm3', senderId: 'coach', senderName: 'Coach Sarah', text: 'Great progress this week! Keep it up.', timestamp: Date.now() - 50000, isRead: false, isMine: false },
    ]
};

export const MessageService = {
    getConversations: async (userId: string): Promise<Conversation[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [...MOCK_CONVERSATIONS].sort((a, b) => b.timestamp - a.timestamp);
    },

    getMessages: async (conversationId: string): Promise<Message[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_MESSAGES[conversationId] || [];
    },

    sendMessage: async (conversationId: string, text: string): Promise<Message> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const newMessage: Message = {
            id: 'm_' + Date.now(),
            senderId: 'me',
            senderName: 'Me',
            text: text,
            timestamp: Date.now(),
            isRead: true,
            isMine: true
        };

        if (!MOCK_MESSAGES[conversationId]) {
            MOCK_MESSAGES[conversationId] = [];
        }
        MOCK_MESSAGES[conversationId].push(newMessage);

        return newMessage;
    }
};
