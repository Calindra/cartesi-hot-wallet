import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ThemedText } from '../ThemedText'

interface GameCardProps {
  imageUrl: string
  title: string
  author: string
}

const cartridgeBackground = require('../../assets/images/cartridge.png') // Make sure to place the cartridge.png in the same directory
const rivesLogo = require('../../assets/images/logo-rives.png')

const GameCartridge: React.FC<GameCardProps> = ({ imageUrl, title, author = 'Cartesi Foundation' }) => {
  return (
    <View style={styles.cartridgeContainer}>
      <View style={styles.backgroundContainer}>
        <Image source={cartridgeBackground} style={styles.backgroundImage} resizeMode="cover" />
      </View>
      <View style={styles.contentContainer}>
        <Image source={rivesLogo} style={styles.rivesLogo} />
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.gameImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </ThemedText>
          <ThemedText style={styles.author} numberOfLines={1} ellipsizeMode="tail">
            By {author}
          </ThemedText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cartridgeContainer: {
    width: 150,
    height: 220,
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
    padding: 16,
  },
  imageContainer: {
    flex: 1,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  rivesLogo: {
    width: '40%',
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
