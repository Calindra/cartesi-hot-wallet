import LoginContext from '@/hooks/loginContext'
import { walletService } from '@/src/services/WalletService'
import React, { useContext, useState } from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import CreateAccount from './CreateAccount'
import LoginModal, { LoginCredentials } from './Login'
import OnboardingModal from './Onboarding/Onboarding'
import ParallaxScrollView, { ParallaxScrollViewProps } from './ParallaxScrollView'
import { WalletHeader } from './WalletHeader/WalletHeader'

interface ParallaxScrollViewWithWalletProps extends ParallaxScrollViewProps {
  showWallet?: boolean
  children?: React.ReactNode
}

const ParallaxScrollViewWithWallet: React.FC<ParallaxScrollViewWithWalletProps> = ({
  children,
  showWallet = true,
  ...props
}) => {
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { setAddress } = useContext(LoginContext)
  const headerHeight = Platform.OS === 'ios' ? 107 : (StatusBar.currentHeight || 0) + 60
  const onSave = () => {}

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    const client = walletService.setCurrentWallet(`${credentials.email}\t${credentials.password}`)
    setAddress(client.account.address)
    return
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
        <LoginModal
          isVisible={showLogin}
          onClose={function (): void {
            setShowLogin(false)
          }}
          onLogin={handleLogin}
        />
        <OnboardingModal
          isVisible={showOnboarding}
          onClose={function (): void {
            setShowOnboarding(false)
          }}
        />
        <CreateAccount isVisible={showCreateAccount} onClose={() => setShowCreateAccount(false)} onSave={onSave} />
      </ParallaxScrollView>
      {showWallet && <WalletHeader setShowLogin={setShowLogin} setShowOnboarding={setShowOnboarding} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ParallaxScrollViewWithWallet
