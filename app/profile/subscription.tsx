import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

export default function SubscriptionScreen() {
    const { t } = useTranslation();
    const router = useRouter();

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
                    <Text style={styles.headerTitle}>{t('profile.subscription', 'Subscription')}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <LinearGradient
                        colors={['#FFD700', '#FDB931']}
                        style={styles.cardGradient}
                    >
                        <Text style={styles.planName}>PRO Plan</Text>
                        <Text style={styles.planPrice}>$9.99 / month</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Active</Text>
                        </View>
                    </LinearGradient>
                </View>

                <Text style={styles.sectionTitle}>Features</Text>

                {['Unlimited Diet Plans', 'Advanced Analytics', 'Priority Support', 'Ad-Free Experience'].map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}

                <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel Subscription</Text>
                </TouchableOpacity>
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
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
    },
    cardGradient: {
        padding: 30,
        alignItems: 'center',
    },
    planName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    planPrice: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.7)',
        marginBottom: 15,
    },
    badge: {
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    featureText: {
        color: '#ccc',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 30,
        padding: 15,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
    },
});
