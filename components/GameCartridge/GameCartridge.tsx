import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

interface GameCardProps {
  imageUrl: string
  title: string
  author: string
}

const cartridgeBackground = require('../../assets/images/cartridge.png') // Make sure to place the cartridge.png in the same directory

const GameCartridge: React.FC<GameCardProps> = ({ imageUrl, title, author = 'Cartesi Foundation' }) => {
  return (
    <View style={styles.cartridgeContainer}>
      <View style={styles.backgroundContainer}>
        <Image source={cartridgeBackground} style={styles.backgroundImage} resizeMode="cover" />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.gameImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
            {author}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cartridgeContainer: {
    width: 150,
    height: 200,
    display: 'flex',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A7BE4',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  author: {
    color: '#888',
    fontSize: 14,
  },
})

export default GameCartridge
