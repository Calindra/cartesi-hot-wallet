import React, { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import { ThemedText } from '../ThemedText'
import { Feather } from '@expo/vector-icons'

import { Colors } from '@/constants/Colors'
import { Modal, Text } from 'react-native'
import LeaderboardModal from '../LeaderboardModal'


interface GameCardProps {
  imageUrl: string
  title: string
  author: string
}

const cartridgeBackground = require('../../assets/images/cartridge.png') // Make sure to place the cartridge.png in the same directory
const rivesLogo = require('../../assets/images/logo-rives.png')

const GameCartridge: React.FC<GameCardProps> = ({ imageUrl, title, author = 'Cartesi Foundation' }) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const toggleDropdown = () => setShowDropdown(prev => !prev)

  return (

    <View style={styles.cartridgeContainer}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <Image source={cartridgeBackground} style={styles.backgroundImage} resizeMode="cover" />
      </View>

      {/* Main content */}
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

      <View>
        <TouchableOpacity style={styles.settingsButton} onPress={toggleDropdown}>
          <Feather name="settings" size={14} color={colors.text} />
        </TouchableOpacity>


        <Modal
          visible={showDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{title}</Text>

              {title === 'Free Doom' &&
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowDropdown(false)
                    setShowLeaderboard(true)
                  }}
                >
                  <ThemedText style={styles.dropdownText}>Leaderboard</ThemedText>
                </TouchableOpacity>
              }
              <TouchableOpacity style={styles.dropdownItem} onPress={() => console.log('Controls')}>
                <ThemedText style={styles.dropdownText}>Controls</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowDropdown(false)}>
                <ThemedText style={{ marginTop: 16, color: '#E44' }}>Close</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <LeaderboardModal
          visible={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
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
  settingsButton: {
    marginLeft: 16,
    padding: 15, // increases touch area
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  dropdown: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dropdownItem: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },

  dropdownText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  }


})

export default GameCartridge
