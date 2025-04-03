import { walletService } from '@/src/services/WalletService'
import React, { ReactNode, useEffect, useState } from 'react'
import { WalletClient } from 'viem'
import LoginContext from './loginContext'

interface LoginProviderProps {
  children: ReactNode
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string>('')
  const [client, setClient] = useState<WalletClient | null>(null)
  const [email, setEmail] = useState<string>('')

  // Check for existing wallet on mount
  useEffect(() => {
    const data = walletService.getCurrentWalletAndEmail()
    if (data && data.currentWallet) {
      setEmail(data.email)
      setClient(data.currentWallet)
      setAddress(data.currentWallet.account.address)
    }
  }, [])

  const logout = () => {
    walletService.unsetCurrentWallet()
    setAddress('')
    setClient(null)
  }

  return (
    <LoginContext.Provider
      value={{
        address,
        setAddress,
        client,
        setClient,
        logout,
        email,
        setEmail,
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}
