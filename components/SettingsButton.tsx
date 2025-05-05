import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import LeaderboardModal from './LeaderboardModal';
import { ThemedText } from './ThemedText';

interface SettingsButtonProps {
    title: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ title }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(prev => !prev);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleModalClose = () => setShowDropdown(false);
    return (
        <View>
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={e => {
                    e.stopPropagation();
                    toggleDropdown();
                }}
            >
                <Feather name="settings" size={20} color={colors.text} />
            </TouchableOpacity>

            <Modal visible={showDropdown} transparent animationType="fade" onRequestClose={handleModalClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{title}</Text>

                        {title === 'Free Doom' && (
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setShowDropdown(false);
                                    setShowLeaderboard(true);
                                }}
                            >
                                <ThemedText style={styles.dropdownText}>Leaderboard</ThemedText>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => console.log('Controls')}>
                            <ThemedText style={styles.dropdownText}>Controls</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleModalClose}>
                            <ThemedText style={{ marginTop: 16, color: '#E44' }}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {showLeaderboard && <LeaderboardModal visible={showLeaderboard} onClose={() => setShowLeaderboard(false)} />}
        </View>
    );
};
const styles = StyleSheet.create({
    settingsButton: {
        marginTop: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        zIndex: 10,
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
