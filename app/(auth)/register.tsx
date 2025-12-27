import { LanguageSwitcher } from '@/src/components/LanguageSwitcher';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthService } from '../../src/services/authService';

export default function RegisterScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert(t('common.error'), t('validation.fillAll'));
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert(t('common.error'), t('validation.passwordMatch'));
            return;
        }
        setLoading(true);
        try {
            // NOTE: We are creating a basic user profile here. 
            // Detailed profile setup (age, weight, etc.) will happen in the Profile Setup / Onboarding flow.
            await AuthService.register(email, password, {});
            // Success - AuthContext picks it up
        } catch (error: any) {
            Alert.alert(t('common.error'), error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LanguageSwitcher />
            <Text style={styles.title}>{t('auth.signup')}</Text>
            <Text style={styles.subtitle}>{t('auth.signup')}</Text>

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
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password" // I didn't add this to json, using plain text or could duplicate t('auth.password')
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{t('auth.signup')}</Text>
                )}
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>{t('auth.hasAccount')} </Text>
                <Link href={"/login" as any} asChild>
                    <TouchableOpacity>
                        <Text style={styles.link}>{t('auth.login')}</Text>
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
