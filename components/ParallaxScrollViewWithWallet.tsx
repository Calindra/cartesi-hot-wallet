import React, { useContext, useState } from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import ParallaxScrollView, { ParallaxScrollViewProps } from './ParallaxScrollView';
import { WalletHeader } from './WalletHeader';
import CreateAccount from './CreateAccount';
import LoginModal, { LoginCredentials } from './Login';
import { walletService } from '@/src/services/WalletService';
import LoginContext from '@/hooks/loginContext';

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
    const { setAddress } = useContext(LoginContext);
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
                    const client = walletService.setCurrentWallet(`${credentials.email}\t${credentials.password}`)
                    setAddress(client.account.address)
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