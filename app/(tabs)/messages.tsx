import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, Layout, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Conversation, MessageService } from '../../src/services/messageService';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MessagesScreen() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMessages = async () => {
        try {
            const data = await MessageService.getConversations('current-user-id');
            setConversations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMessages();
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();

        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const renderItem = ({ item, index }: { item: Conversation; index: number }) => {
        return <MessageItem item={item} index={index} formatTime={formatTime} />;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <Pressable
                    style={({ pressed }) => [styles.searchButton, { opacity: pressed ? 0.7 : 1 }]}
                >
                    <Ionicons name="search" size={24} color="#fff" />
                </Pressable>
            </View>

            <Animated.FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>No messages yet.</Text> : null
                }
                itemLayoutAnimation={Layout.springify()}
            />
        </View>
    );
}

const MessageItem = ({
    item,
    index,
    formatTime,
}: {
    item: Conversation;
    index: number;
    formatTime: (t: number) => string;
}) => {
    const scale = useSharedValue(1);
    const router = useRouter();

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const onPressIn = () => {
        scale.value = withSpring(0.96);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    const handlePress = () => {
        router.push(`/chat/${item.id}` as any);
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.card, animatedStyle]}
            entering={FadeInDown.delay(index * 100).springify().damping(12)}
            layout={Layout.springify()}
        >
            <LinearGradient
                colors={['#FE6B8B', '#FF8E53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarContainer}
            >
                <Ionicons name="person" size={20} color="#FFF" />
            </LinearGradient>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.name}>{item.participantName}</Text>
                    <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
                </View>
                <View style={styles.messageRow}>
                    <Text
                        style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]}
                        numberOfLines={1}
                    >
                        {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchButton: {
        padding: 8,
        backgroundColor: '#333',
        borderRadius: 50,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        backgroundColor: '#121212', // Ensure background for animation
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 14,
        color: '#888',
        flex: 1,
        marginRight: 10,
    },
    unreadMessage: {
        color: '#fff',
        fontWeight: '600',
    },
    badge: {
        backgroundColor: '#0984e3',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
