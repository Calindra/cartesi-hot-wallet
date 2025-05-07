import GameCartridge from '@/components/GameCartridge/GameCartridge'
import { GameData } from '@/src/model/GameData'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import SettingsButton from '../SettingsButton'

interface CustomGridProps {
  data: GameData[]
}

const CustomGrid: React.FC<CustomGridProps> = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width)

  // Update window width on device rotation or resize
  useEffect(() => {
    const updateLayout = () => {
      setWindowWidth(Dimensions.get('window').width)
    }

    const subscription = Dimensions.addEventListener('change', updateLayout)

    return () => {
      subscription.remove()
    }
  }, [])

  const getNumberOfColumns = () => {
    return windowWidth < 768 ? 2 : 3
  }

  const renderGrid = () => {
    const columnCount = getNumberOfColumns()
    const rows = []

    for (let i = 0; i < data.length; i += columnCount) {
      const rowItems = data.slice(i, i + columnCount)

      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowItems.map((item) => (
            <View key={item.id} style={styles.columnContainer}>
              <Link
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
                <GameCartridge
                  imageUrl={item.imageUrl}
                  title={item.title}
                  author={item.author}
                />
              </Link>
              {item.title === 'Free Doom' &&
                (<SettingsButton title={item.title} />)
              }
            </View>
          ))}
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
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  columnContainer: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    flexDirection: 'column',
  },
})

export default CustomGrid
