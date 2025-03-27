import { emailShortner, walletAddressShortner } from '@/app/utils/walletAddressUtils'
import { Colors } from '@/constants/Colors'
import LoginContext from '@/hooks/loginContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { walletService } from '@/src/services/WalletService'
import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import React, { useContext, useEffect, useState } from 'react'
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface WalletHeaderProps {
  setShowLogin: (value: boolean) => void
  setShowOnboarding: (value: boolean) => void
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({ setShowLogin, setShowOnboarding }) => {
  const colorScheme = useColorScheme()
  const { address, logout, email, setEmail } = useContext(LoginContext)
  const colors = Colors[colorScheme ?? 'light']
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
              <Text> What is a hot wallet?</Text>
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
              <Text style={[styles.addressText, { color: colors.text }]}>{emailShortner(email)}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.connectButton, { backgroundColor: colors.tint }]} onPress={handleConnect}>
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </TouchableOpacity>
          )}
        </View>
        {showWalletData && (
          <View style={[styles.showWalletDataContainer]}>
            <TouchableOpacity style={[styles.walletToClipboard]} onPress={copyToClipboard}>
              <Text style={[styles.addressText, { color: colors.text }]}>{walletAddressShortner(address)}</Text>
              <Feather name="copy" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={[styles.balance]}>$ {balance}USD</Text>
            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.tint }]} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
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
    color: '#FFFFFF',
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
