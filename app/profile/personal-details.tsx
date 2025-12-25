import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { AuthService } from '../../src/services/authService';

export default function PersonalDetailsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, userProfile, refreshProfile } = useAuth();

    // Local state for form fields
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');

    const [saving, setSaving] = useState(false);

    // Initialize fields with current user data
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.displayName || user?.displayName || '');
            setWeight(userProfile.weight ? userProfile.weight.toString() : '');
            setHeight(userProfile.height ? userProfile.height.toString() : '');
            setAge(userProfile.age ? userProfile.age.toString() : '');
        } else if (user) {
            setName(user.displayName || '');
        }
    }, [userProfile, user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        try {
            await AuthService.updateUserProfile(user.uid, {
                displayName: name,
                weight: weight ? parseFloat(weight) : undefined,
                height: height ? parseFloat(height) : undefined,
                age: age ? parseInt(age) : undefined,
            });

            // If we have a refresh function in context, call it. 
            // Assuming refreshProfile exists or we manually update local state if needed.
            // For now, simple Alert and Back.
            if (refreshProfile) {
                await refreshProfile();
            }

            Alert.alert(t('common.save'), "Profile updated successfully", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert(t('common.error'), "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <LinearGradient
                colors={Colors.gradients.ocean}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('profile.personalDetails')}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput
                                style={styles.input}
                                value={weight}
                                onChangeText={setWeight}
                                placeholder="0.0"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <TextInput
                                style={styles.input}
                                value={height}
                                onChangeText={setHeight}
                                placeholder="0"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            style={styles.input}
                            value={age}
                            onChangeText={setAge}
                            placeholder="0"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    <LinearGradient
                        colors={Colors.gradients.primary}
                        style={styles.saveGradient}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveText}>{t('common.save')}</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: Colors.dark.icon,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        padding: 20,
        backgroundColor: Colors.dark.background,
        borderTopWidth: 1,
        borderTopColor: '#222',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    saveButton: {
        borderRadius: 25,
        overflow: 'hidden',
        height: 50,
    },
    disabledButton: {
        opacity: 0.7,
    },
    saveGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
