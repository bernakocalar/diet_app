import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

export default function PrivacyScreen() {
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
                    <Text style={styles.headerTitle}>{t('profile.privacy', 'Privacy & Security')}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.heading}>Privacy Policy</Text>
                <Text style={styles.paragraph}>
                    Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our application.
                </Text>

                <Text style={styles.heading}>Data Security</Text>
                <Text style={styles.paragraph}>
                    We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
                </Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Export My Data</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.deleteButton]}>
                    <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>Delete Account</Text>
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
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
    },
    paragraph: {
        color: '#ccc',
        lineHeight: 22,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1E293B',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 1,
        borderColor: '#FF6B6B',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
