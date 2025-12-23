import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Group, GroupService } from '../../src/services/groupService';

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);

    const groupId = Array.isArray(id) ? id[0] : id;

    useEffect(() => {
        const fetchGroup = async () => {
            if (groupId) {
                try {
                    const data = await GroupService.getGroupDetails(groupId);
                    if (data) setGroup(data);
                } catch (error) {
                    console.error("Failed to load group:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchGroup();
    }, [groupId]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#00d2d3" />
            </View>
        );
    }

    if (!group) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Group not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonSimple}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView bounces={false}>
                {/* Hero Header */}
                <View style={styles.heroContainer}>
                    <LinearGradient
                        colors={['#0f2027', '#203a43', '#2c5364']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroGradient}
                    >
                        {/* Custom Back Button */}
                        <TouchableOpacity style={styles.backButtonOver} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.groupIconPlaceholder}>
                            <Ionicons name="people" size={50} color="#fff" />
                        </View>
                        <Text style={styles.title}>{group.name}</Text>
                        <Text style={styles.memberCount}>{group.memberCount} Members • Public Group</Text>
                    </LinearGradient>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    {/* Next Session Card */}
                    {group.nextSession && (
                        <LinearGradient
                            colors={['rgba(255, 159, 67, 0.1)', 'rgba(255, 159, 67, 0.05)']}
                            style={styles.sessionCard}
                        >
                            <View style={styles.sessionIcon}>
                                <Ionicons name="time" size={24} color="#ff9f43" />
                            </View>
                            <View style={styles.sessionInfo}>
                                <Text style={styles.sessionLabel}>Next Live Session</Text>
                                <Text style={styles.sessionValue}>{group.nextSession}</Text>
                            </View>
                            <TouchableOpacity style={styles.joinButton}>
                                <Text style={styles.joinButtonText}>Join</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    )}

                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.description}>{group.description}</Text>
                    </View>

                    {/* Members Preview (Mock) */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Members</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersList}>
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <View key={i} style={styles.memberAvatar}>
                                    <Ionicons name="person" size={20} color="#ccc" />
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.primaryAction} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#00d2d3', '#00a8ff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Ionicons name="chatbubbles-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.primaryActionText}>Enter Group Chat</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryAction}>
                            <Text style={styles.secondaryActionText}>Invite Friends</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
    },
    heroContainer: {
        height: 300,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    heroGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    backButtonOver: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        zIndex: 10,
    },
    groupIconPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
    memberCount: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    contentContainer: {
        padding: 20,
    },
    sessionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 159, 67, 0.3)',
        marginBottom: 30,
    },
    sessionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 159, 67, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionLabel: {
        fontSize: 12,
        color: '#ff9f43',
        marginBottom: 2,
    },
    sessionValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    joinButton: {
        backgroundColor: '#ff9f43',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    joinButtonText: {
        color: '#121212',
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: '#ccc',
    },
    seeAllText: {
        color: '#00d2d3',
        fontSize: 14,
    },
    membersList: {
        flexDirection: 'row',
    },
    memberAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    actionsContainer: {
        gap: 15,
        marginBottom: 30,
    },
    primaryAction: {
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
    },
    gradientButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryActionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryAction: {
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryActionText: {
        color: '#ccc',
        fontSize: 16,
        fontWeight: '600',
    },
    backButtonSimple: {
        marginTop: 10,
        padding: 10,
    },
    backButtonText: {
        color: '#00d2d3',
        fontSize: 16,
    }
});
