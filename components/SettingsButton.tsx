import { StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { ThemedText } from './ThemedText';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import LeaderboardModal from './LeaderboardModal';

interface SettingsButtonProps {
    title: string
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ title }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    return (
        <View>
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={(e) => {
                    e.stopPropagation();
                    setShowLeaderboard(true);
                }}
            >
                <Feather name="award" size={20} color="#333" />
                <ThemedText style={styles.buttonText}>Leaderboard</ThemedText>
            </TouchableOpacity>

            {showLeaderboard && (
                <LeaderboardModal
                    visible={showLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    settingsButton: {
        marginTop: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 8,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        minWidth: 200,
        minHeight: 250,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        maxWidth: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    dropdownItem: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        marginVertical: 4,
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});

export default SettingsButton;