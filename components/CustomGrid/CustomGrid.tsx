import GameCartridge from '@/components/GameCartridge/GameCartridge';
import LoginContext from '@/hooks/loginContext';
import { GameData } from '@/src/model/GameData';
import { Link, router } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedButton } from '../ThemedButton';

interface CustomGridProps {
    gameData: GameData[];
}

const CustomGrid: React.FC<CustomGridProps> = ({ gameData }) => {
    // Get login context to check user authentication status
    const { address } = useContext(LoginContext);

    // State to track current window width and modal visibility
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
    const [localGameData, setLocalGameData] = useState(gameData);

    // Update window width on device rotation or resize
    useEffect(() => {
        const updateLayout = () => {
            setWindowWidth(Dimensions.get('window').width);
        };

        // Add event listener
        const subscription = Dimensions.addEventListener('change', updateLayout);

        // Cleanup listener
        return () => {
            subscription.remove();
        };
    }, []);

    // Determine number of columns based on width
    const getNumberOfColumns = () => {
        return windowWidth < 768 ? 2 : 3;
    };

    // Handle game selection for non-logged in users
    const handleGamePress = (game: GameData) => {
        // User is not logged in, show modal
        setSelectedGame(game);
        setModalVisible(true);
    };

    // Render the grid
    const renderGrid = () => {
        const columnCount = getNumberOfColumns();
        const rows = [];

        for (let i = 0; i < gameData.length; i += columnCount) {
            const rowItems = gameData.slice(i, i + columnCount);

            rows.push(
                <View key={`row-${i}`} style={styles.row}>
                    {rowItems.map(item =>
                        address ? (
                            <Link
                                key={item.id}
                                href={{
                                    pathname: item.webview ? '/(tabs)/webview' : '/fullscreen',
                                    params: {
                                        gameURL: item.gameURL,
                                        webviewURI: item.webviewURI,
                                        arrowGamepad: item.arrowGamepad,
                                        tiltGamepad: item.tiltGamepad,
                                    },
                                }}
                                style={styles.columnContainer}
                            >
                                <GameCartridge imageUrl={item.imageUrl} title={item.title} author={item.author} />
                            </Link>
                        ) : (
                            <TouchableOpacity key={item.id} style={styles.columnContainer} onPress={() => handleGamePress(item)}>
                                <GameCartridge imageUrl={item.imageUrl} title={item.title} author={item.author} />
                            </TouchableOpacity>
                        )
                    )}
                    {rowItems.length < columnCount &&
                        [...Array(columnCount - rowItems.length)].map((_, index) => (
                            <View key={`empty-${index}`} style={[styles.columnContainer, { opacity: 0 }]} />
                        ))}
                </View>
            );
        }

        return rows;
    };

    const [isChecked, setChecked] = useState(false);

    return (
        <View style={styles.container}>
            {renderGrid()}

            {/* Login Required Modal */}
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Login Required to Submit Score</Text>
                        <Text style={styles.modalText}>
                            You need to be logged in to submit scores for this game. You can still play, casually, without login in.
                        </Text>
                        <View style={styles.modalButtons}>
                            <ThemedButton
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                                buttonText="Cancel"
                            />

                            <ThemedButton
                                darkColor="#870b68"
                                onPress={() => {
                                    setModalVisible(false);
                                    if (selectedGame) {
                                        // Navigate to game using expo-router
                                        router.push({
                                            pathname: selectedGame.webview ? '/(tabs)/webview' : '/fullscreen',
                                            params: {
                                                gameURL: selectedGame.gameURL,
                                                webviewURI: selectedGame.webviewURI,
                                                arrowGamepad: selectedGame.arrowGamepad,
                                                tiltGamepad: selectedGame.tiltGamepad,
                                            },
                                        });
                                    }
                                }}
                                buttonText="Play Anyway"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    columnContainer: {
        flex: 1,
        marginHorizontal: 6,
        alignItems: 'center',
        width: '100%',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default CustomGrid;
