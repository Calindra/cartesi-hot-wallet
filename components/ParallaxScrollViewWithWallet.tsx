import React, { useContext, useEffect, useState } from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'

import LoginModal, { LoginCredentials } from './Login'
import OnboardingModal from './Onboarding/Onboarding'
import ParallaxScrollView, { ParallaxScrollViewProps } from './ParallaxScrollView'
import SettingsModal from './SettingsModal'
import { WalletHeader } from './WalletHeader/WalletHeader'

import LoginContext from '@/hooks/loginContext'
import { walletService } from '@/src/services/WalletService'
import { Settings } from '@/src/model/Settings'

export async function getPrivacyPolicyAgreement(): Promise<boolean> {
  const value = await SecureStore.getItemAsync('PrivacyPolicyAgreement')
  return value === 'true'
}

export async function setPrivacyPolicyAgreement(): Promise<void> {
  await SecureStore.setItemAsync('PrivacyPolicyAgreement', 'true')
}

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
  const [showSettings, setShowSettings] = useState(false)

  const [gamepadURL, setGamepadURL] = useState('doom-with-arrows.html')
  const { setAddress } = useContext(LoginContext)
  const headerHeight = Platform.OS === 'ios' ? 107 : (StatusBar.currentHeight || 0) + 60

  useEffect(() => {
    const loadGamepadPreference = async () => {
      const storedMode = await SecureStore.getItemAsync('movementMode')
      if (storedMode === 'tilt') {
        setGamepadURL('doom-smooth-turns.html')
      } else {
        setGamepadURL('doom-with-arrows.html')
      }
    }
    loadGamepadPreference()
  }, [])

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    const client = walletService.setCurrentWallet(`${credentials.email}\t${credentials.password}`)
    setAddress(client.account.address)
    return
  }

  const handleApplySettings = async (settings: Settings) => {
    console.log('Apply settings:', settings)
  }

  return (
    <>
      {/* {showPrivacyPolicy && (
        <PrivacyPolicy onClose={handleClosePrivacyPolicy} />
      )} */}
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
            onClose={() => setShowLogin(false)}
            onLogin={handleLogin}

          />
          <OnboardingModal
            isVisible={showOnboarding}
            onClose={() => setShowOnboarding(false)}
          />
          <SettingsModal
            visible={showSettings}
            onClose={() => setShowSettings(false)}
            onSettingsChange={handleApplySettings}
            onMovementModeChange={(url) => setGamepadURL(url)}
          />



        </ParallaxScrollView>

        {showWallet && (
          <WalletHeader
            setShowLogin={setShowLogin}
            setShowOnboarding={setShowOnboarding}
            setShowSettings={setShowSettings}
          />
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ParallaxScrollViewWithWallet
