import LoginContext from '@/hooks/loginContext'
import { walletService } from '@/src/services/WalletService'
import React, { useContext, useEffect, useState } from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import CreateAccount from './CreateAccount'
import LoginModal, { LoginCredentials } from './Login'
import OnboardingModal from './Onboarding/Onboarding'
import ParallaxScrollView, { ParallaxScrollViewProps } from './ParallaxScrollView'
import { WalletHeader } from './WalletHeader/WalletHeader'
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy'
import * as SecureStore from 'expo-secure-store'

export async function getPrivacyPolicyAgreement(): Promise<boolean> {
  const value = await SecureStore.getItemAsync('PrivacyPolicyAgreement')
  return value === 'true'
}
export async function resetPrivacyPolicyAgreement() {
  await SecureStore.deleteItemAsync('PrivacyPolicyAgreement')
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
  const { setAddress } = useContext(LoginContext)
  const headerHeight = Platform.OS === 'ios' ? 107 : (StatusBar.currentHeight || 0) + 60
  const onSave = () => { }

  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    const client = walletService.setCurrentWallet(`${credentials.email}\t${credentials.password}`)
    setAddress(client.account.address)
    return
  }
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean | null>(true)


  useEffect(() => {
    const checkAgreement = async () => {
      const agreed = await getPrivacyPolicyAgreement()
      console.log("agreeeeeeed>>>>", agreed)
      setShowPrivacyPolicy(!agreed) // Only show if not agreed
    }

    checkAgreement()
  }, [])

  // Un-comment to test privacy policy
  // useEffect(() => {
  //   const testResetAndCheck = async () => {
  //     await resetPrivacyPolicyAgreement() // só pra testar! apague depois

  //     const agreed = await getPrivacyPolicyAgreement()
  //     setShowPrivacyPolicy(!agreed)
  //   }

  //   testResetAndCheck()
  // }, [])


  const handleClosePrivacyPolicy = () => {
    setShowPrivacyPolicy(false)
  }
  useEffect(() => {
    const testResetAndCheck = async () => {
      await resetPrivacyPolicyAgreement() // só pra testar! apague depois

      const agreed = await getPrivacyPolicyAgreement()
      setShowPrivacyPolicy(!agreed)
    }

    testResetAndCheck()
  }, [])

  return (
    <>
      {showPrivacyPolicy === true && (
        <PrivacyPolicy onClose={handleClosePrivacyPolicy} />
      )}
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
        {showWallet && <WalletHeader setShowLogin={setShowLogin} setShowOnboarding={setShowOnboarding} setShowSettings={setShowSettings} />}
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
