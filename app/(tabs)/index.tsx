import CustomGrid from '@/components/CustomGrid/CustomGrid'
import ParallaxScrollViewWithWallet from '@/components/ParallaxScrollViewWithWallet'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { usePathname } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'

// Define the type for game data
interface GameData {
  id: string
  title: string
  author: string
  imageUrl: string
  gameURL: string
  webview: boolean
}

// TODO: could come from an API
const gameData: GameData[] = [
  {
    id: '1',
    title: 'Gamepad Test',
    author: 'Calindra',
    imageUrl: 'https://i.imgur.com/FePyexY.jpeg',
    gameURL: 'https://raw.githubusercontent.com/edubart/cartridges/main/gamepad.sqfs',
    webview: false,
  },
  {
    id: '2',
    title: 'Free Doom',
    author: 'Dude',
    imageUrl: 'https://rives.io/img/carts/freedoom.png',
    gameURL: 'https://mainnet-v5.rives.io/data/cartridges/721f735bbca3',
    webview: false,
  },
  {
    id: '3',
    title: 'Rives Raid',
    author: 'Rives',
    imageUrl: 'https://via.placeholder.com/150',
    gameURL: 'https://mainnet-v5.rives.io/data/cartridges/40b0cb5ee306',
    webview: true,
  },
  {
    id: '4',
    title: 'Slalom',
    author: '',
    imageUrl: 'https://via.placeholder.com/150',
    gameURL: 'https://mainnet-v5.rives.io/data/cartridges/a612d46cd43f',
    webview: true,
  },
  {
    id: '5',
    title: 'Pakboy',
    author: '',
    imageUrl: 'https://via.placeholder.com/150',
    gameURL: 'https://mainnet-v5.rives.io/data/cartridges/bba40250eaeb',
    webview: true,
  },
]

export default function Home() {
  const pathname = usePathname()

  // State to track current window width
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width)

  // Change orientation
  const changeOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
  }

  // Update window width on device rotation or resize
  useEffect(() => {
    const updateLayout = () => {
      setWindowWidth(Dimensions.get('window').width)
    }

    // Add event listener
    const subscription = Dimensions.addEventListener('change', updateLayout)

    // Initial orientation lock
    if (pathname === '/') {
      changeOrientation()
    }

    // Cleanup listener
    return () => {
      subscription.remove()
    }
  }, [pathname])

  return (
    <ParallaxScrollViewWithWallet
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <CustomGrid data={gameData} />
      </ScrollView>
    </ParallaxScrollViewWithWallet>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  cartridgeContainer: {
    flex: 1,
    margin: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
})
