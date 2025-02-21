import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

const WalletHeader = () => {
    const [address, setAddress] = useState(null);

    const handleConnect = () => {
        // TODO: Implement wallet connection logic
        setAddress('0x1234...abcd'); // Example address
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {address ? (
                    <Text style={styles.addressText}>
                        {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                    </Text>
                ) : (
                    <TouchableOpacity 
                        style={styles.connectButton}
                        onPress={handleConnect}
                    >
                        <Text style={styles.connectButtonText}>Connect Wallet</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#1a1a1a',
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        backgroundColor: '#1a1a1a',
    },
    connectButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    connectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    addressText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default WalletHeader;