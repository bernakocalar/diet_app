import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number; // We'll convert Firestore Timestamp to number for UI
    isRead: boolean;
    isMine?: boolean; // Calculated on client
}

export interface Conversation {
    id: string;
    participantName: string;
    lastMessage: string;
    unreadCount: number;
    avatar?: string;
    timestamp: number;
    participants: string[];
}

export const MessageService = {
    // Get list of conversations for a user
    getConversations: async (userId: string): Promise<Conversation[]> => {
        try {
            const chatsRef = collection(db, "chats");
            const q = query(chatsRef, where("participants", "array-contains", userId), orderBy("lastMessageTimestamp", "desc"));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                // Simple logic to find "other" participant name - in real app we'd fetch their profile or store it in the chat doc
                // For MVP let's assume the chat doc has a 'participantNames' map or similar, OR just generic for now.
                // Let's improve schema slightly to include 'displayNames' map { uid: "Name" }
                const otherUid = data.participants.find((uid: string) => uid !== userId) || "User";
                const name = data.displayNames ? data.displayNames[otherUid] : "Chat";

                return {
                    id: doc.id,
                    participantName: name,
                    lastMessage: data.lastMessage || "",
                    unreadCount: data.unreadCounts ? (data.unreadCounts[userId] || 0) : 0,
                    timestamp: data.lastMessageTimestamp?.toMillis() || Date.now(),
                    participants: data.participants
                } as Conversation;
            });
        } catch (error) {
            console.error("Error fetching conversations:", error);
            return [];
        }
    },

    // Listen to messages in a conversation
    // Returns an unsubscribe function
    subscribeToMessages: (conversationId: string, currentUserId: string, onUpdate: (messages: Message[]) => void) => {
        const messagesRef = collection(db, "chats", conversationId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"), limit(50));

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    senderId: data.senderId,
                    senderName: data.senderName,
                    text: data.text,
                    timestamp: data.timestamp?.toMillis() || Date.now(),
                    isRead: data.isRead,
                    isMine: data.senderId === currentUserId
                } as Message;
            });
            onUpdate(messages);
        });
    },

    // Get messages (One-time fetch - fallback if needed, but subscription is better for Chat UI)
    getMessages: async (conversationId: string): Promise<Message[]> => {
        // We'll leave this empty or basic, as we prefer real-time subscription in the UI
        // But to keep interface compatible with what we built in chat/[id].tsx:
        // Actually chat/[id].tsx calls getMessages ONCE. We should update it to use subscription or just use this.
        // Let's implement one-time fetch here for compatibility.
        try {
            const messagesRef = collection(db, "chats", conversationId, "messages");
            const q = query(messagesRef, orderBy("timestamp", "asc"));
            const snapshot = await getDocs(q);
            // We don't know currentUserId here to set isMine easily without passing it...
            // We'll leave isMine undefined and let UI handle it or expect caller to check senderId
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toMillis() || Date.now()
                } as unknown as Message; // casting for now
            });
        } catch (error) {
            console.error("Error getting messages:", error);
            return [];
        }
    },

    // Send a message
    sendMessage: async (conversationId: string, text: string, senderId: string, senderName: string): Promise<Message> => {
        // 1. Add message to subcollection
        const messagesRef = collection(db, "chats", conversationId, "messages");
        const newMessageData = {
            text,
            senderId,
            senderName,
            timestamp: serverTimestamp(),
            isRead: false
        };
        const docRef = await addDoc(messagesRef, newMessageData);

        // 2. Update parent chat with last message
        const chatRef = doc(db, "chats", conversationId);
        await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageTimestamp: serverTimestamp(),
            // We could increment unread counts here for other participants
        });

        return {
            id: docRef.id,
            text,
            senderId,
            senderName,
            timestamp: Date.now(), // Optimistic return
            isRead: false,
            isMine: true
        };
    },

    // Create a new conversation (Helper)
    createConversation: async (participants: string[], displayNames: Record<string, string>) => {
        const chatsRef = collection(db, "chats");
        const docRef = await addDoc(chatsRef, {
            participants,
            displayNames,
            lastMessage: "",
            lastMessageTimestamp: serverTimestamp(),
            unreadCounts: {}
        });
        return docRef.id;
    }
};
