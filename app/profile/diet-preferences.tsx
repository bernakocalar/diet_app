import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { AuthService } from '../../src/services/authService';
import { DietService } from '../../src/services/dietService';
import { DietProgram } from '../../src/types/diet';

export default function DietPreferencesScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, userProfile, refreshProfile } = useAuth();

    const [diets, setDiets] = useState<DietProgram[]>([]);
    const [selectedDiet, setSelectedDiet] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadDiets();
    }, []);

    useEffect(() => {
        if (userProfile?.currentDietId) {
            setSelectedDiet(userProfile.currentDietId);
        }
    }, [userProfile]);

    const loadDiets = async () => {
        setLoading(true);
        try {
            const data = await DietService.getAllPrograms();
            setDiets(data);
        } catch (error) {
            console.error("Failed to load diets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async (id: string) => {
        setSelectedDiet(id);
        if (user) {
            setSaving(true);
            try {
                await AuthService.updateUserProfile(user.uid, { currentDietId: id });
                if (refreshProfile) await refreshProfile();
                Alert.alert(t('common.save'), "Diet preference updated.");
            } catch (error) {
                Alert.alert(t('common.error'), "Failed to update preference.");
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={Colors.gradients.ocean}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('profile.dietPreferences', 'Diet Preferences')}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.description}>Select a diet type to customize your meal recommendations.</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                ) : (
                    diets.map((diet) => (
                        <TouchableOpacity
                            key={diet.id}
                            style={[
                                styles.optionCard,
                                selectedDiet === diet.id && styles.selectedCard
                            ]}
                            onPress={() => handleSelect(diet.id)}
                            disabled={saving}
                        >
                            <View style={styles.optionRow}>
                                <Ionicons name={diet.icon as any} size={24} color={selectedDiet === diet.id ? Colors.light.primary : '#ccc'} />
                                <View style={styles.textColumn}>
                                    <Text style={[styles.optionLabel, selectedDiet === diet.id && styles.selectedText]}>{diet.name}</Text>
                                    <Text style={styles.optionDesc}>{diet.description}</Text>
                                </View>
                            </View>
                            {selectedDiet === diet.id && (
                                <View>
                                    {saving ? <ActivityIndicator size="small" color={Colors.light.primary} /> : <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        paddingTop: 50,
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
    description: {
        color: '#ccc',
        marginBottom: 20,
        fontSize: 14,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1E293B',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    selectedCard: {
        borderColor: Colors.light.primary,
        backgroundColor: 'rgba(42, 157, 143, 0.1)',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    textColumn: {
        flex: 1,
    },
    optionLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    optionDesc: {
        color: '#888',
        fontSize: 12,
    },
    selectedText: {
        color: Colors.light.primary,
    },
});
