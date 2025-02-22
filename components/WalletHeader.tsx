import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface WalletHeaderProps {
    setShowLogin: (value: boolean) => void
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({ setShowLogin }) => {
    const [address, setAddress] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleConnect = () => {
        // setAddress('0x1234...abcd'); // Example address
        setShowLogin(true)
    };

    return (
        <>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.headerContent, { backgroundColor: colors.background }]}>
                    {address ? (
                        <Text style={[styles.addressText, { color: colors.text }]}>
                            {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                        </Text>
                    ) : (
                        <TouchableOpacity
                            style={[styles.connectButton, { backgroundColor: colors.tint }]}
                            onPress={handleConnect}
                        >
                            <Text style={styles.connectButtonText}>Connect Wallet</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: Platform.OS === 'ios' ? 47 : StatusBar.currentHeight,
        zIndex: 100,
        position: 'absolute',
        top: 0,
    },
    headerContent: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
    },
    connectButton: {
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
        fontSize: 16,
        fontWeight: '500',
    },
});
