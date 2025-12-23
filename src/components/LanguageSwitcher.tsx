import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'tr' : 'en';
        i18n.changeLanguage(nextLang);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={toggleLanguage}>
            <Text style={styles.text}>{i18n.language.toUpperCase()}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        zIndex: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        // Shadow for better visibility
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
