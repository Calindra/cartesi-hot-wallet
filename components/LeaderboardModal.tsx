import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
// import { generateLeaderboardData, LeaderboardEntry } from './Lea';
import { Feather } from '@expo/vector-icons';
import { generateLeaderboardData, LeaderboardEntry } from '@/src/services/LeaderboardServices';

interface LeaderboardModalProps {
    visible: boolean;
    onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ visible, onClose }) => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await generateLeaderboardData();
            setLeaderboardData(data);
        } catch (err) {
            setError('Failed to load leaderboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchLeaderboardData();
        setRefreshing(false);
    };

    useEffect(() => {
        if (visible) {
            fetchLeaderboardData();
        }
    }, [visible]);

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return '#FFD700'; // Gold
            case 2:
                return '#C0C0C0'; // Silver
            case 3:
                return '#CD7F32'; // Bronze
            default:
                return 'transparent';
        }
    };

    const renderItem = ({ item }: { item: LeaderboardEntry }) => (
        <View style={[styles.row, { backgroundColor: getRankColor(item.rank) + '20' }]}>
            <View style={[styles.rankContainer, { backgroundColor: getRankColor(item.rank) }]}>
                <Text style={styles.rankText}>{item.rank}</Text>
            </View>
            <Text style={styles.userText}>{item.user}</Text>
            <Text style={styles.scoreText}>{item.score}</Text>

            {item.verified ? (
                <View style={styles.verifiedContainer}>
                    <Feather name="check-circle" size={18} color="#4CAF50" />
                </View>
            ) : (<View style={styles.verifiedContainer}>
                <Feather name="x" size={18} color="red" />
            </View>)}
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerRow}>
            <Text style={[styles.headerText, styles.rankHeader]}>Rank</Text>
            <Text style={[styles.headerText, styles.userHeader]}>User</Text>
            <Text style={[styles.headerText, styles.scoreHeader]}>Score</Text>
            <Text style={[styles.headerText, styles.verifiedHeader]}>Verified</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Leaderboard</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Feather name="x" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {loading && !refreshing ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#6200EE" />
                                <Text style={styles.loadingText}>Loading leaderboard...</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Feather name="alert-circle" size={48} color="#F44336" />
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={fetchLeaderboardData}>
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : leaderboardData.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Feather name="users" size={48} color="#9E9E9E" />
                                <Text style={styles.emptyText}>No leaderboard data available</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={leaderboardData}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => item.user + index}
                                ListHeaderComponent={renderHeader}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={handleRefresh}
                                        colors={['#6200EE']}
                                    />
                                }
                                contentContainerStyle={styles.listContent}
                            />

                        )}
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    headerRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerText: {
        fontWeight: 'bold',
        color: '#555',
    },
    rankHeader: {
        width: 60,
    },
    userHeader: {
        flex: 1,
    },
    scoreHeader: {
        width: 80,
        textAlign: 'center',
    },
    verifiedHeader: {
        width: 60,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    rankContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 16,
    },
    userText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    scoreText: {
        width: 80,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    verifiedContainer: {
        width: 60,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#6200EE',
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    listContent: {
        flexGrow: 1,
    },
});

export default LeaderboardModal;