import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { PackageService } from '../../src/services/packageService';
import { DietPackage } from '../../src/types/package';

export default function PackageSelectionScreen() {
    const [packages, setPackages] = useState<DietPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const { user, refreshProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        loadPackages();
    }, []);

    const loadPackages = async () => {
        try {
            const data = await PackageService.getAllPackages();
            setPackages(data);
        } catch (error) {
            Alert.alert("Error", "Failed to load packages");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPackage = async () => {
        if (!selectedPackageId || !user) return;

        try {
            setLoading(true);
            await PackageService.assignPackageToUser(user.uid, selectedPackageId);
            await refreshProfile();
            // Navigate to main app
            router.replace('/(tabs)');
        } catch (error) {
            Alert.alert("Error", "Failed to select package");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>Select the diet package that fits your goals. This cannot be changed easily!</Text>

            <ScrollView contentContainerStyle={styles.list}>
                {packages.map((pkg) => (
                    <TouchableOpacity
                        key={pkg.id}
                        style={[
                            styles.card,
                            selectedPackageId === pkg.id && styles.selectedCard
                        ]}
                        onPress={() => setSelectedPackageId(pkg.id)}
                    >
                        <Text style={styles.cardTitle}>{pkg.name}</Text>
                        <Text style={styles.cardGoal}>Goal: {pkg.goal.replace('_', ' ')}</Text>
                        <Text style={styles.cardDesc}>{pkg.description}</Text>

                        <View style={styles.rulesContainer}>
                            <Text style={styles.rulesLabel}>Rules:</Text>
                            {pkg.rules.map((rule, index) => (
                                <Text key={index} style={styles.rule}>• {rule}</Text>
                            ))}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, !selectedPackageId && styles.disabledButton]}
                    onPress={handleSelectPackage}
                    disabled={!selectedPackageId || loading}
                >
                    <Text style={styles.buttonText}>Confirm Selection</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    list: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedCard: {
        borderColor: '#007AFF',
        backgroundColor: '#F0F8FF',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    cardGoal: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
        marginBottom: 10,
        textTransform: 'capitalize',
    },
    cardDesc: {
        fontSize: 14,
        color: '#555',
        marginBottom: 15,
    },
    rulesContainer: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
    },
    rulesLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#666',
    },
    rule: {
        fontSize: 12,
        color: '#444',
        marginBottom: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
