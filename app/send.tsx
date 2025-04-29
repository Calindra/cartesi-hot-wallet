import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';
import LoginContext from '@/hooks/loginContext';
import { walletService } from '@/src/services/WalletService';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Hex, parseEther } from 'viem';

export default function SendEthScreen() {
    const { address } = useContext(LoginContext);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (address) {
            getWalletBalance(address as `0x${string}`);
        }
    }, [address]);

    const getWalletBalance = async (address: `0x${string}`) => {
        const balance = await walletService.getWalletBalance(address);
        setBalance(parseFloat(balance).toFixed(6));
    };

    const sendEth = async () => {
        if (!recipient || !amount) {
            console.log('Please fill in all fields...');
            Alert.alert('Please fill in all fields');
            return;
        }

        setIsSending(true);

        try {
            const walletClient = walletService.getCurrentWallet();
            if (!walletClient) {
                console.log('There is no current wallet');
                setIsSending(false);
                return;
            }
            const txHash = await walletClient.sendTransaction({
                to: recipient as Hex,
                value: parseEther(amount), // Converts ETH string to wei
                gasLimit: 21000,
            });

            Alert.alert('Transaction Sent!', `Tx Hash: ${txHash}`);
            await getWalletBalance(address as `0x${string}`); // Refresh balance
        } catch (e) {
            console.error(e);
            Sentry.captureException(e, {
                // user: { id: '123', email: 'test1@example.com' }, // context info about user
                tags: { feature: 'sendEth' },
                extra: { debugData: '@send.tsx - Error sending Eth' },
                // fingerprint: ['custom-fingerprint'],
            });
            Alert.alert('Error', e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerTitle: 'Send', headerBackTitle: 'Home' }} />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ThemedView style={styles.container}>
                        <MaterialIcons name="send" size={48} color="#4a90e2" style={styles.icon} />
                        <ThemedText style={styles.description}>Send ETH to another wallet address quickly and securely.</ThemedText>
                        <ThemedText style={styles.balance}>Your Balance: {balance} ETH</ThemedText>

                        <ThemedText style={styles.label}>Recipient Address</ThemedText>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputIconContainer}>
                                <Feather name="user" size={20} color="#666" />
                            </View>
                            <ThemedTextInput
                                style={styles.input}
                                placeholder="0x..."
                                onChangeText={setRecipient}
                                value={recipient}
                                autoCapitalize="none"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <ThemedText style={styles.label}>Amount (ETH)</ThemedText>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputIconContainer}>
                                <Feather name="dollar-sign" size={20} color="#666" />
                            </View>
                            <ThemedTextInput
                                style={styles.input}
                                placeholder="e.g. 0.01"
                                keyboardType="decimal-pad"
                                onChangeText={text => setAmount(text.replace(',', '.'))}
                                value={amount}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, isSending && styles.buttonDisabled]}
                            onPress={() => {
                                console.log('Send ETH');
                                sendEth();
                            }}
                            disabled={isSending}
                        >
                            <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Send ETH</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    balance: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        marginVertical: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    inputIconContainer: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
    },
    button: {
        color: '#fff',
        backgroundColor: '#4a90e2',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#a0c5e8',
    },
});
