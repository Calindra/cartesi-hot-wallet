import { Feather } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Define a type for Feather icon names
type FeatherIconName = 'repeat' | 'refresh-cw' | 'cloud' | 'arrow-up-right' | 'arrow-down-right'

// Define an interface for navigation items
interface NavigationItem {
  name: string
  icon: FeatherIconName
}

const WalletHeaderBottomNavigation: React.FC = () => {
  const navigationItems: NavigationItem[] = [
    { name: 'Buy & Sell', icon: 'repeat' },
    { name: 'Swap', icon: 'refresh-cw' },
    { name: 'Bridge', icon: 'cloud' },
    { name: 'Send', icon: 'arrow-up-right' },
    { name: 'Receive', icon: 'arrow-down-right' },
  ]

  return (
    <View style={styles.container}>
      {navigationItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => {
            // Add navigation logic here
            console.log(`Pressed ${item.name}`)
          }}
        >
          <Feather name={item.icon} size={24} color="#FFFFFF" />
          <Text style={styles.navText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 20,
    paddingHorizontal: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    gap: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    minWidth: 60,
    minHeight: 60,
    borderRadius: '50%',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 5,
  },
})

export default WalletHeaderBottomNavigation
