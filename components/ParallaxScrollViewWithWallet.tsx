import React, { useState } from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import ParallaxScrollView, { ParallaxScrollViewProps } from './ParallaxScrollView';
import { WalletHeader } from './WalletHeader';
import CreateAccount from './CreateAccount';
import LoginModal, { LoginCredentials } from './Login';

interface ParallaxScrollViewWithWalletProps extends ParallaxScrollViewProps {
    showWallet?: boolean;
    children?: React.ReactNode;
}

const ParallaxScrollViewWithWallet: React.FC<ParallaxScrollViewWithWalletProps> = ({
    children,
    showWallet = true,
    ...props
}) => {
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const headerHeight = Platform.OS === 'ios' ? 107 : (StatusBar.currentHeight || 0) + 60;
    const onSave = () => {

    }
    return (
        <View style={styles.container}>
            <ParallaxScrollView
                {...props}
                style={{
                    ...props.style,
                    ...(showWallet ? { marginTop: headerHeight } : {}),
                }}
            >
                {children}
                <LoginModal isVisible={showLogin} onClose={function (): void {
                    setShowLogin(false)
                }} onLogin={async function (credentials: LoginCredentials): Promise<void> {
                    return;
                }} />
                <CreateAccount isVisible={showCreateAccount} onClose={() => setShowCreateAccount(false)} onSave={onSave} />
            </ParallaxScrollView>
            {showWallet && <WalletHeader setShowLogin={setShowLogin} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ParallaxScrollViewWithWallet;