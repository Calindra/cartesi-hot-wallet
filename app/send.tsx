import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';
import { walletService } from '@/src/services/WalletService';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Hex, parseEther } from 'viem';

export default function SendEthScreen() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    const sendEth = async () => {
        if (!recipient || !amount) {
            console.log('Please fill in all fields...')
            Alert.alert('Please fill in all fields');
            return;
        }

        try {
            const walletClient = walletService.getCurrentWallet()
            if (!walletClient) {
                console.log('There is no current wallet')
                return
            }
            const txHash = await walletClient.sendTransaction({
                to: recipient as Hex,
                value: parseEther(amount), // Converts ETH string to wei
                gasLimit: 21000,
            });

            Alert.alert('Transaction Sent!', `Tx Hash: ${txHash}`);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Something went wrong');
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerTitle: 'Send' }} />
            <ThemedView style={styles.container}>
                <ThemedText style={styles.label}>Recipient Address</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="0x..."
                    onChangeText={setRecipient}
                    value={recipient}
                    autoCapitalize="none"
                />

                <ThemedText style={styles.label}>Amount (ETH)</ThemedText>
                <ThemedTextInput
                    style={styles.input}
                    placeholder="e.g. 0.01"
                    keyboardType="numeric"
                    onChangeText={setAmount}
                    value={amount}
                />

                <ThemedButton buttonText="Send ETH" onPress={() => {
                    console.log('Send ETH')
                    sendEth()
                }} />
            </ThemedView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
});
