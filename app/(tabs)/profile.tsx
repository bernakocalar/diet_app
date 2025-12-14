import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthService, MockUser } from '../../src/services/authService';
import { UserProfile } from '../../src/types/user';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<MockUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const unsubscribe = AuthService.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userProfile = await AuthService.getUserProfile(currentUser.uid);
                setProfile(userProfile);
            }
        });
        return unsubscribe;
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await AuthService.logout();
                        router.replace('/');
                    }
                }
            ]
        );
    };

    if (!user) {
        return <View style={styles.loadingContainer}><Text style={styles.text}>Loading...</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#2c3e50', '#000000']}
                style={styles.header}
            >
                <View style={styles.profileImageContainer}>
                    {user.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.profilePlaceholder}>
                            <Ionicons name="person" size={50} color="#ccc" />
                        </View>
                    )}
                    <TouchableOpacity style={styles.editIcon}>
                        <Ionicons name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.name}>{profile?.displayName || user.displayName || 'User'}</Text>
                <Text style={styles.email}>{user.email}</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile?.weight || '--'}</Text>
                        <Text style={styles.statLabel}>kg</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile?.height || '--'}</Text>
                        <Text style={styles.statLabel}>cm</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile?.age || '--'}</Text>
                        <Text style={styles.statLabel}>yrs</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="person-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.menuText}>Personal Details</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="nutrition-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.menuText}>Diet Preferences</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="card-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.menuText}>Subscription</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>PRO</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="notifications-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.menuText}>Notifications</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.menuText}>Privacy & Security</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <View style={[styles.menuIconBox, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
                        <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
                    </View>
                    <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    text: {
        color: '#fff',
    },
    header: {
        alignItems: 'center',
        paddingTop: 70,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    profilePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#0984e3',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#2c3e50',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 25,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: '85%',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: '#ccc',
        marginTop: 2,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        marginLeft: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    badge: {
        backgroundColor: '#fdcb6e',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: 10,
    },
    badgeText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 10,
    }
});
