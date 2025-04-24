import GameCartridge from '@/components/GameCartridge/GameCartridge'
import { GameData } from '@/src/model/GameData'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

interface CustomGridProps {
  data: GameData[]
}

const CustomGrid: React.FC<CustomGridProps> = ({ data }) => {
  // State to track current window width and safe area
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width)

  // Update window width on device rotation or resize
  useEffect(() => {
    const updateLayout = () => {
      setWindowWidth(Dimensions.get('window').width)
    }

    // Add event listener
    const subscription = Dimensions.addEventListener('change', updateLayout)

    // Cleanup listener
    return () => {
      subscription.remove()
    }
  }, [])

  // Determine number of columns based on width
  const getNumberOfColumns = () => {
    return windowWidth < 768 ? 2 : 3
  }

  // Render the grid
  const renderGrid = () => {
    const columnCount = getNumberOfColumns()
    const rows = []

    for (let i = 0; i < data.length; i += columnCount) {
      const rowItems = data.slice(i, i + columnCount)

      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowItems.map((item) => (
            <Link
              key={item.id}
              href={{
                pathname: item.webview ? '/(tabs)/webview' : '/fullscreen',
                params: {
                  gameURL: item.gameURL,
                  webviewURI: item.webviewURI,
                  arrowGamepad: item.arrowGamepad,
                  tiltGamepad: item.tiltGamepad,
                },
              }}
              style={styles.columnContainer}
            >

              <GameCartridge imageUrl={item.imageUrl} title={item.title} author={item.author} />
            </Link>
          ))}
          {/* Fill empty columns if needed */}
          {rowItems.length < columnCount &&
            [...Array(columnCount - rowItems.length)].map((_, index) => (
              <View key={`empty-${index}`} style={[styles.columnContainer, { opacity: 0 }]} />
            ))}
        </View>
      )
    }

    return rows
  }

  return <View style={styles.container}>{renderGrid()}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 8, // Add horizontal padding
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  columnContainer: {
    flex: 1, // Use flex to distribute space evenly
    marginHorizontal: 6, // Reduce margin for better spacing
    alignItems: 'center',
    width: '100%', // Ensure full width within container
  },
})

export default CustomGrid
