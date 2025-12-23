import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Group, GroupService } from '../../src/services/groupService';

export default function GroupsScreen() {
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchGroups = async () => {
        try {
            const data = await GroupService.getUserGroups('current-user-id');
            setGroups(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchGroups();
    };

    const renderItem = ({ item }: { item: Group }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/group/${item.id}` as any)}
        >
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.cardGradient}
            >
                <View style={styles.headerRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="people" size={24} color="#00d2d3" />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.groupName}>{item.name}</Text>
                        <Text style={styles.memberCount}>{item.memberCount} members</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </View>

                <Text style={styles.description}>{item.description}</Text>

                {item.nextSession && (
                    <View style={styles.sessionContainer}>
                        <Ionicons name="time-outline" size={14} color="#ff9f43" />
                        <Text style={styles.sessionText}>Next: {item.nextSession}</Text>
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0F2027', '#203A43']}
                style={styles.header}
            >
                <Text style={styles.title}>My Groups</Text>
                <Text style={styles.subtitle}>Connect with your community</Text>
            </LinearGradient>

            <FlatList
                data={groups}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>You haven't joined any groups yet.</Text> : null
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
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#a0a0a0',
    },
    listContent: {
        padding: 20,
    },
    card: {
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    cardGradient: {
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 210, 211, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerInfo: {
        flex: 1,
    },
    groupName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
    },
    memberCount: {
        fontSize: 13,
        color: '#888',
    },
    description: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 15,
    },
    sessionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 159, 67, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    sessionText: {
        color: '#ff9f43',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});
