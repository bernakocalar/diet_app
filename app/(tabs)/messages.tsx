import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Conversation, MessageService } from '../../src/services/messageService';

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

    const renderItem = ({ item }: { item: Conversation }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.avatarContainer}>
                <Ionicons name="person" size={20} color="#FFF" />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.name}>{item.participantName}</Text>
                    <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
                </View>
                <View style={styles.messageRow}>
                    <Text style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>No messages yet.</Text> : null
                }
            />
        </View>
    );
}

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
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', // Fallback color
        backgroundColor: '#5d5d5d', // Fallback
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
    }
});
