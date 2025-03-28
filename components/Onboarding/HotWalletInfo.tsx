import { Feather } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { ThemedText } from '../ThemedText'

interface Styles {
  userIcon: ViewStyle
  title: TextStyle
  subtitle: TextStyle
  sectionTitle: TextStyle
  bulletPointContainer: ViewStyle
  bulletPointTitle: TextStyle
  bulletPointText: TextStyle
}

const HotWalletInfo: React.FC = () => {
  const BulletPoint = ({ title, text }: { title?: string; text: string }) => (
    <View style={styles.bulletPointContainer}>
      {title ? (
        <ThemedText style={styles.bulletPointTitle}>{title}</ThemedText>
      ) : (
        <ThemedText style={styles.bulletPointTitle}>•</ThemedText>
      )}
      <ThemedText style={styles.bulletPointText}>{text}</ThemedText>
    </View>
  )

  return (
    <>
      <Feather name="book-open" size={32} color="#4a90e2" style={styles.userIcon as any} />
      <ThemedText style={styles.title}>What is a hot wallet?</ThemedText>
      <ThemedText style={styles.subtitle}>
        A "hot wallet" in crypto is a software wallet that stores your private keys online, connected to the internet,
        allowing for quick and easy access to your cryptocurrency for transactions and trading, but also making it more
        vulnerable to security breaches.{' '}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        When you leave your home do you carry all of your assets? The same logic can be applied to understand the usage
        of a Hot Wallet. The password you use to create the wallet is the only thing attaching you to the wallet. So, be
        councious and pick a really strong, unique password.
      </ThemedText>

      <ThemedText style={styles.sectionTitle}>Advantages:</ThemedText>
      <BulletPoint
        title="Convenience"
        text="Easy access to your funds for trading, payments, and interacting with decentralized applications (dApps)."
      />
      <BulletPoint title="Real-time Transactions" text="Facilitates quick and instant cryptocurrency transactions." />
      <BulletPoint
        title="Integration with Exchanges"
        text="Many hot wallets are integrated with cryptocurrency exchanges, making it easier to trade."
      />

      <ThemedText style={styles.sectionTitle}>Disadvantages:</ThemedText>
      <BulletPoint
        title="Security Vulnerability"
        text="The constant internet connection makes them a target for hackers and malware."
      />
      <BulletPoint
        title="Risk of Theft"
        text="If the private keys are compromised, your cryptocurrency can be stolen."
      />
      <BulletPoint
        title="Not Ideal for Long-Term Storage"
        text="Because of the security risks, hot wallets are not recommended for storing large amounts of cryptocurrency long-term."
      />

      <ThemedText style={styles.sectionTitle}>Security Best Practices for Hot Wallets:</ThemedText>
      <BulletPoint title="Strong Passwords" text="Use STRONG and UNIQUE passwords for your hot wallet." />
      <BulletPoint
        title="Regularly Update Software"
        text="Keep your hot wallet software and operating system up to date to patch security vulnerabilities."
      />
    </>
  )
}

const styles = StyleSheet.create<Styles>({
  userIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPointTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 8,
    width: 120,
  },
  bulletPointText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
})

export default HotWalletInfo
