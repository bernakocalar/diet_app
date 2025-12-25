import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { AuthService } from '../../src/services/authService';
import { UserProfile } from '../../src/types/user';

export default function ProfileScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
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

    const [uploading, setUploading] = useState(false);

    const handleLogout = async () => {
        Alert.alert(
            t('profile.logout'),
            t('profile.logoutConfirm'),
            [
                { text: t('common.cancel'), style: "cancel" },
                {
                    text: t('profile.logout'),
                    style: "destructive",
                    onPress: async () => {
                        await AuthService.logout();
                        router.replace('/');
                    }
                }
            ]
        );
    };

    const handlePickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert("Permission Required", "You need to grant permission to access your photos to change your profile picture.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets && result.assets.length > 0 && user) {
                setUploading(true);
                const uri = result.assets[0].uri;
                await AuthService.uploadProfileImage(user.uid, uri);

                // Refresh local user state (simple re-fetch logic or just waiting on auth listener might be enough)
                // Since onAuthStateChanged might not trigger on photoURL update immediately or requires reload
                // We can manually update the state here for feedback
                const updatedUser = { ...user, photoURL: uri } as User; // Optimistic update
                setUser(updatedUser);
                setUploading(false);
                Alert.alert("Success", "Profile picture updated!");
            }
        } catch (error) {
            console.error(error);
            setUploading(false);
            Alert.alert("Error", "Failed to update profile picture.");
        }
    };

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'tr' : 'en';
        i18n.changeLanguage(nextLang);
    };

    if (!user) {
        return <View style={styles.loadingContainer}><Text style={styles.text}>{t('common.loading')}</Text></View>;
    }
    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={Colors.gradients.ocean}
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
                    <TouchableOpacity style={styles.editIcon} onPress={handlePickImage} disabled={uploading}>
                        {uploading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="camera" size={20} color="#fff" />
                        )}
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
                <Text style={styles.sectionTitle}>{t('profile.account')}</Text>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/personal-details')}
                >
                    <View style={styles.menuIconBox}>
                        <Ionicons name="person-outline" size={22} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.menuText}>{t('profile.personalDetails')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/diet-preferences')}
                >
                    <View style={styles.menuIconBox}>
                        <Ionicons name="nutrition-outline" size={22} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.menuText}>{t('profile.dietPreferences')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/subscription')}
                >
                    <View style={styles.menuIconBox}>
                        <Ionicons name="card-outline" size={22} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.menuText}>{t('profile.subscription')}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{t('profile.pro')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/notifications')}
                >
                    <View style={styles.menuIconBox}>
                        <Ionicons name="notifications-outline" size={22} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.menuText}>{t('profile.notifications')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/privacy')}
                >
                    <View style={styles.menuIconBox}>
                        <Ionicons name="shield-checkmark-outline" size={22} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.menuText}>{t('profile.privacy')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
                    <View style={styles.menuIconBox}>
                        <Ionicons name="globe-outline" size={22} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.menuText}>{t('profile.language')}</Text>
                    <Text style={{ color: '#888', marginRight: 10 }}>{i18n.language === 'en' ? 'English' : 'Türkçe'}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <View style={[styles.menuIconBox, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
                        <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
                    </View>
                    <Text style={[styles.menuText, { color: '#FF6B6B' }]}>{t('profile.logout')}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.background,
    },
    text: {
        color: Colors.dark.text,
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
        backgroundColor: Colors.light.primary,
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.dark.background,
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
        color: Colors.dark.text,
        marginBottom: 15,
        marginLeft: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B', // Slightly lighter than background
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(42, 157, 143, 0.2)', // Tint with opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: Colors.dark.text,
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
