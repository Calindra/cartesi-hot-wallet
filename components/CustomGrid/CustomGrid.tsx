import GameCartridge from '@/components/GameCartridge/GameCartridge';
import LoginContext from '@/hooks/loginContext';
import { GameData } from '@/src/model/GameData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
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
    const [submitScoreWarningModalVisible, setSubmitScoreWarningModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
    const [localGameData, setLocalGameData] = useState(gameData);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Set of game IDs for which the user has chosen to skip the warning
    const [skippedWarningGames, setSkippedWarningGames] = useState<Set<string>>(new Set());

    // Load the skipped games from AsyncStorage on mount
    useEffect(() => {
        const loadSkippedWarnings = async () => {
            try {
                if (!AsyncStorage) return;
                const skippedGamesJson = await AsyncStorage.getItem('skippedLoginWarningGames');
                if (skippedGamesJson) {
                    const skippedGamesArray = JSON.parse(skippedGamesJson);
                    setSkippedWarningGames(new Set(skippedGamesArray));
                }
            } catch (error) {
                console.error('Error loading skipped warnings:', error);
            }
        };

        loadSkippedWarnings();
    }, []);

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
        // Check if this game is in the skipped warnings set
        if (skippedWarningGames.has(game.id)) {
            // Skip warning and navigate directly
            navigateToGame(game);
        } else {
            // Show the warning modal
            setSelectedGame(game);
            setDontShowAgain(false); // Reset checkbox state
            setSubmitScoreWarningModalVisible(true);
        }
    };

    // Function to navigate to a game
    const navigateToGame = (game: GameData) => {
        router.push({
            pathname: game.webview ? '/(tabs)/webview' : '/fullscreen',
            params: {
                gameURL: game.gameURL,
                webviewURI: game.webviewURI,
                arrowGamepad: game.arrowGamepad,
                tiltGamepad: game.tiltGamepad,
            },
        });
    };

    // Function to handle "Play Anyway" with optional don't show again
    const handlePlayAnyway = async () => {
        if (!selectedGame) return;

        if (dontShowAgain) {
            // Add to skipped warnings and save to AsyncStorage
            const updatedSkippedGames = new Set(skippedWarningGames);
            updatedSkippedGames.add(selectedGame.id);
            setSkippedWarningGames(updatedSkippedGames);

            try {
                await AsyncStorage.setItem('skippedLoginWarningGames', JSON.stringify(Array.from(updatedSkippedGames)));
            } catch (error) {
                console.error('Error saving skipped warnings:', error);
            }
        }

        // Close modal and navigate
        setSubmitScoreWarningModalVisible(false);
        navigateToGame(selectedGame);
    };

    // Render the grid
    const renderGrid = () => {
        const columnCount = getNumberOfColumns();
        const rows = [];

        for (let i = 0; i < localGameData.length; i += columnCount) {
            const rowItems = localGameData.slice(i, i + columnCount);

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

    return (
        <View style={styles.container}>
            {renderGrid()}

            {/* Login Required Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={submitScoreWarningModalVisible}
                onRequestClose={() => setSubmitScoreWarningModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Login Required to Submit Score</Text>
                        <Text style={styles.modalText}>
                            You need to be logged in to submit scores for this game. You can still play, casually, without login in.
                        </Text>

                        {/* Don't show again checkbox */}
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setDontShowAgain(!dontShowAgain)}>
                            <Checkbox
                                value={dontShowAgain}
                                onValueChange={setDontShowAgain}
                                style={styles.checkbox}
                                color={dontShowAgain ? '#870b68' : undefined}
                            />
                            <Text style={styles.checkboxLabel}>Don't show this warning again for this game</Text>
                        </TouchableOpacity>

                        <View style={styles.modalButtons}>
                            <ThemedButton
                                onPress={() => {
                                    setSubmitScoreWarningModalVisible(false);
                                }}
                                buttonText="Cancel"
                            />

                            <ThemedButton darkColor="#870b68" onPress={handlePlayAnyway} buttonText="Play Anyway" />
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 14,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default CustomGrid;
