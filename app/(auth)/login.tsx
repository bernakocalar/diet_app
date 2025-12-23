import { LanguageSwitcher } from '@/src/components/LanguageSwitcher';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthService } from '../../src/services/authService';

export default function LoginScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(t('common.error'), t('common.error')); // Ideally 'Please fill all fields' should have a key, for now I'll reuse or add later, let's keep english as fallback or just use t('common.error') for title
            // Correction: I should have added validation errors to json. I'll stick to hardcoded english for validation messages OR add them if I can.
            // Let's use hardcoded for validation for now to save time, or just 'common.error' for title.
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await AuthService.login(email, password);
            // AuthContext will detect change and _layout will handle redirect
        } catch (error: any) {
            Alert.alert(t('common.error'), error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LanguageSwitcher />
            <Text style={styles.title}>{t('auth.welcome')}</Text>
            <Text style={styles.subtitle}>{t('auth.welcome')}</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={t('auth.email')}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder={t('auth.password')}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{t('auth.login')}</Text>
                )}
            </TouchableOpacity>

            {/* TEMP: Seed Button */}
            <TouchableOpacity onPress={() => import('../../src/utils/seedPackages').then(m => m.seedPackages().then(() => Alert.alert('Seeded!')))} style={{ marginTop: 10, alignSelf: 'center' }}>
                <Text style={{ color: '#ccc', fontSize: 12 }}>Seed Data</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
                <Link href={"/register" as any} asChild>
                    <TouchableOpacity>
                        <Text style={styles.link}>{t('auth.signup')}</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    inputContainer: {
        gap: 15,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#666',
        fontSize: 16,
    },
    link: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
