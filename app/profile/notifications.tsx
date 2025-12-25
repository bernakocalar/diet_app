import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

export default function NotificationsScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const [settings, setSettings] = useState({
        reminders: true,
        updates: false,
        news: true,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
                    <Text style={styles.headerTitle}>{t('profile.notifications', 'Notifications')}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.label}>Daily Reminders</Text>
                        <Text style={styles.subLabel}>Get reminded to log meals</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: Colors.light.primary }}
                        thumbColor={settings.reminders ? '#fff' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('reminders')}
                        value={settings.reminders}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <View>
                        <Text style={styles.label}>App Updates</Text>
                        <Text style={styles.subLabel}>New features and improvements</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: Colors.light.primary }}
                        thumbColor={settings.updates ? '#fff' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('updates')}
                        value={settings.updates}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <View>
                        <Text style={styles.label}>Health Tips</Text>
                        <Text style={styles.subLabel}>Daily motivation and advice</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: Colors.light.primary }}
                        thumbColor={settings.news ? '#fff' : '#f4f3f4'}
                        onValueChange={() => toggleSwitch('news')}
                        value={settings.news}
                    />
                </View>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    subLabel: {
        color: '#999',
        fontSize: 12,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});
