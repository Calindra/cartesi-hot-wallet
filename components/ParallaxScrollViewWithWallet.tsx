import React from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import ParallaxScrollView, { ParallaxScrollViewProps } from './ParallaxScrollView';
import { WalletHeader } from './WalletHeader';

interface ParallaxScrollViewWithWalletProps extends ParallaxScrollViewProps {
    showWallet?: boolean;
}

const ParallaxScrollViewWithWallet: React.FC<ParallaxScrollViewWithWalletProps> = ({ 
    children, 
    showWallet = true,
    ...props 
}) => {
    const headerHeight = Platform.OS === 'ios' ? 107 : (StatusBar.currentHeight || 0) + 60;

    return (
        <View style={styles.container}>
            <ParallaxScrollView 
                {...props}
                style={[props.style, showWallet && { marginTop: headerHeight }]}
            >
                {children}
            </ParallaxScrollView>
            {showWallet && <WalletHeader />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ParallaxScrollViewWithWallet;