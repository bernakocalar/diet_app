import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { HistoryEntry, HistoryService } from '../../src/services/historyService';

export default function HistoryScreen() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await HistoryService.getHistory('current-user-id');
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const renderItem = ({ item }: { item: HistoryEntry }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
                <View style={styles.weightBadge}>
                    <Text style={styles.weightText}>{item.weight} kg</Text>
                </View>
            </View>

            {item.calories && (
                <View style={styles.statRow}>
                    <Ionicons name="flame-outline" size={16} color="#FF6B6B" />
                    <Text style={styles.statText}>{item.calories} kcal</Text>
                </View>
            )}

            {item.notes && (
                <Text style={styles.notes}>{item.notes}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={Colors.gradients.ocean}
                style={styles.header}
            >
                <Text style={styles.title}>My History</Text>
                <Text style={styles.subtitle}>Track your progress over time</Text>
            </LinearGradient>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>No history yet.</Text> : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#a0a0a0',
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    weightBadge: {
        backgroundColor: 'rgba(76, 209, 55, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    weightText: {
        color: '#167c7cff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statText: {
        color: '#ccc',
        marginLeft: 6,
        fontSize: 14,
    },
    notes: {
        color: '#888',
        fontStyle: 'italic',
        fontSize: 14,
        marginTop: 4,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});
