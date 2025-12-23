import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { Message, MessageService } from '../../src/services/messageService';

export default function ChatDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, userProfile } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);

    const conversationId = Array.isArray(id) ? id[0] : id;

    useEffect(() => {
        if (conversationId && user) {
            const unsubscribe = MessageService.subscribeToMessages(conversationId, user.uid, (newMessages) => {
                setMessages(newMessages);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [conversationId, user]);

    const handleSend = async () => {
        if (!inputText.trim() || !conversationId || !user) return;

        const textToSend = inputText;
        setInputText(''); // Optimistic clear

        try {
            const senderName = user.displayName || userProfile?.displayName || "User";
            await MessageService.sendMessage(conversationId, textToSend, user.uid, senderName);
            // No need to manually update state, subscription will handle it
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMine = item.isMine;
        return (
            <View style={[styles.messageRow, isMine ? styles.myMessageRow : styles.otherMessageRow]}>
                {!isMine && (
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={16} color="#FFF" />
                    </View>
                )}
                <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
                    <Text style={[styles.messageText, isMine ? styles.myMessageText : styles.otherMessageText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timeText, isMine ? styles.myTimeText : styles.otherTimeText]}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Chat</Text>
                    {/* Ideally fetch participant name from service or pass it via params */}
                    <Text style={styles.headerSubtitle}>Conversation</Text>
                </View>
                <TouchableOpacity style={styles.headerAction}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                inverted={false} // Depending on how you sort. Usually chat is bottom-up but let's stick to standard top-down with auto-scroll for now or simple list.
            // Actually better UX is inverted list if we load from newest, but mock service returns oldest first.
            // Let's keep it standard and maybe add auto-scroll in a real app.
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#666"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <LinearGradient
                            colors={['#00d2d3', '#00a8ff']}
                            style={styles.sendButtonGradient}
                        >
                            <Ionicons name="send" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 15,
        backgroundColor: '#1e1e1e',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#888',
    },
    headerAction: {
        padding: 5,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageRow: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    otherMessageRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    bubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
    },
    myBubble: {
        backgroundColor: '#00d2d3',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#333',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#000',
    },
    otherMessageText: {
        color: '#fff',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(0,0,0,0.6)',
    },
    otherTimeText: {
        color: 'rgba(255,255,255,0.5)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: '#1e1e1e',
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    input: {
        flex: 1,
        backgroundColor: '#2c2c2c',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingTop: 10, // Adjust for multiline
        fontSize: 16,
        color: '#fff',
        maxHeight: 100,
        marginRight: 12,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
