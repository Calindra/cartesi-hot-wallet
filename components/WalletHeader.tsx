import { emailShortner, walletAddressShortner } from '@/app/utils/walletAddressUtils'
import { Colors } from '@/constants/Colors'
import LoginContext from '@/hooks/loginContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { walletService } from '@/src/services/WalletService'
import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import React, { useContext, useEffect, useState } from 'react'
import { Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from './ThemedText'
import { ThemedTouchableOpacity } from './ThemedTouchableOpacity'

interface WalletHeaderProps {
  setShowLogin: (value: boolean) => void
  setShowOnboarding: (value: boolean) => void
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({ setShowLogin, setShowOnboarding }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { address, logout, email, setEmail } = useContext(LoginContext)
  const [copied, setCopied] = useState(false)
  const [showWalletData, setShowWalletData] = useState(false)
  const [balance, setBalance] = useState('')

  useEffect(() => {
    if (!address) {
      return
    }
    getWalletBalance(address as `0x${string}`)
  }, [address])

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(address)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const getWalletBalance = async (address: `0x${string}`) => {
    const balance = await walletService.getWalletBalance(address)
    setBalance(balance)
  }

  const handleConnect = () => {
    setEmail('')
    setShowLogin(true)
  }

  const handleOnboarding = () => {
    setShowOnboarding(true)
  }

  const handleLogout = () => {
    setShowWalletData(false)
    logout()
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View>
          {!address && (
            <TouchableOpacity style={[styles.connectButton]} onPress={handleOnboarding}>
              <ThemedText> What is a hot wallet?</ThemedText>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.headerContent, { backgroundColor: colors.background }]}>
          {address ? (
            <TouchableOpacity
              onPress={() => {
                setShowWalletData(!showWalletData)
              }}
            >
              <ThemedText style={[styles.addressText, { color: colors.text }]}>{emailShortner(email)}</ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedTouchableOpacity onPress={handleConnect} buttonText="Connect Wallet" type="button" />
          )}
        </View>
        {showWalletData && (
          <View style={[styles.showWalletDataContainer]}>
            <TouchableOpacity style={[styles.walletToClipboard]} onPress={copyToClipboard}>
              <ThemedText style={[styles.addressText, { color: colors.text }]}>
                {walletAddressShortner(address)}
              </ThemedText>
              <Feather name="copy" size={24} color="#666" />
            </TouchableOpacity>
            <ThemedText style={[styles.balance]}>$ {balance}USD</ThemedText>
            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.tint }]} onPress={handleLogout}>
              <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 47 : StatusBar.currentHeight,
    zIndex: 100,
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 16,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
  },
  showWalletDataContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 47 : StatusBar!.currentHeight! * 2,
    left: 0,
    marginTop: Platform.OS === 'ios' ? 47 : StatusBar.currentHeight,
    width: '100%',
    minHeight: 300,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  walletToClipboard: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: 700,
    alignSelf: 'flex-start',
    margin: 8,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
})
