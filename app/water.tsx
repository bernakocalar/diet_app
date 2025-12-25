import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { TrackingService } from '../src/services/trackingService';

export default function WaterScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [currentWater, setCurrentWater] = useState(0);
    const [targetWater, setTargetWater] = useState(2.5);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const stats = await TrackingService.getDailyStats();
            setCurrentWater(stats.water.current);
            setTargetWater(stats.water.target);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addWater = async (amount: number) => {
        setAdding(true);
        try {
            const newStats = await TrackingService.updateWater(amount);
            setCurrentWater(newStats.water.current);
        } catch (error) {
            console.error(error);
        } finally {
            setAdding(false);
        }
    };

    const percentage = Math.min(100, Math.round((currentWater / targetWater) * 100));

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
                    <Text style={styles.headerTitle}>{t('water.title', 'Add Water')}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                ) : (
                    <>
                        <View style={styles.progressContainer}>
                            <View style={styles.circle}>
                                <Text style={styles.percentage}>{percentage}%</Text>
                                <Text style={styles.amount}>{currentWater} / {targetWater} L</Text>
                            </View>
                        </View>

                        <Text style={styles.instruction}>{t('water.tapToAdd', 'Tap to add water')}</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => addWater(0.2)}
                                disabled={adding}
                            >
                                <Ionicons name="water" size={30} color="#fff" />
                                <Text style={styles.actionText}>{t('water.glass', 'Glass')}</Text>
                                <Text style={styles.actionSubText}>+200ml</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => addWater(0.5)}
                                disabled={adding}
                            >
                                <Ionicons name="beer-outline" size={30} color="#fff" />
                                <Text style={styles.actionText}>{t('water.bottle', 'Bottle')}</Text>
                                <Text style={styles.actionSubText}>+500ml</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    progressContainer: {
        marginBottom: 50,
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 10,
        borderColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(42, 157, 143, 0.1)',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    percentage: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    amount: {
        fontSize: 16,
        color: '#ccc',
        marginTop: 5,
    },
    instruction: {
        color: '#888',
        marginBottom: 20,
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        gap: 20,
    },
    actionButton: {
        backgroundColor: '#1E293B',
        width: 120,
        height: 120,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
    },
    actionSubText: {
        color: Colors.light.primary,
        fontSize: 12,
        marginTop: 2,
    },
});
