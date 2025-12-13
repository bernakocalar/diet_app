import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { AuthService } from '../../src/services/authService';
import { UserProfile } from '../../src/types/user';

export default function ProfileSetupScreen() {
    const { user, refreshProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<Partial<UserProfile>>({
        age: undefined,
        height: undefined,
        weight: undefined,
        gender: 'male',
        target: 'lose',
        activityLevel: 'moderate'
    });

    const handleUpdate = (key: keyof UserProfile, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = async () => {
        if (!user) return;
        if (!form.age || !form.height || !form.weight) {
            Alert.alert("Missing Info", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            await AuthService.updateUserProfile(user.uid, {
                ...form,
                age: Number(form.age),
                height: Number(form.height),
                weight: Number(form.weight)
            });
            await refreshProfile();
            router.replace('/(onboarding)/package-selection');
        } catch (error) {
            Alert.alert("Error", "Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Tell Us About You</Text>
            <Text style={styles.subtitle}>We need this to calibrate your diet plan.</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="e.g. 30"
                    onChangeText={t => handleUpdate('age', t)}
                />

                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="e.g. 175"
                    onChangeText={t => handleUpdate('height', t)}
                />

                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="e.g. 70"
                    onChangeText={t => handleUpdate('weight', t)}
                />

                <Text style={styles.label}>Gender</Text>
                <View style={styles.row}>
                    {['male', 'female'].map(g => (
                        <TouchableOpacity
                            key={g}
                            style={[styles.option, form.gender === g && styles.selectedOption]}
                            onPress={() => handleUpdate('gender', g)}
                        >
                            <Text style={[styles.optionText, form.gender === g && styles.selectedOptionText]}>
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Goal</Text>
                <View style={styles.row}>
                    {['lose', 'maintain', 'gain'].map(t => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.option, form.target === t && styles.selectedOption]}
                            onPress={() => handleUpdate('target', t)}
                        >
                            <Text style={[styles.optionText, form.target === t && styles.selectedOptionText]}>
                                {t.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Next Step</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        paddingTop: 60
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333'
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30
    },
    form: {
        gap: 15,
        marginBottom: 30
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9'
    },
    row: {
        flexDirection: 'row',
        gap: 10
    },
    option: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center'
    },
    selectedOption: {
        borderColor: '#007AFF',
        backgroundColor: '#F0F8FF'
    },
    optionText: {
        fontWeight: '600',
        color: '#666'
    },
    selectedOptionText: {
        color: '#007AFF'
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 'auto'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
