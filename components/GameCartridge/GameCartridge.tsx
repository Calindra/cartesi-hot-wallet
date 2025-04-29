import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';


export interface GameCardProps {
  imageUrl: string;
  title: string;
  author: string;
}

const cartridgeBackground = require('../../assets/images/cartridge.png');
const rivesLogo = require('../../assets/images/logo-rives.png');

const GameCartridge: React.FC<GameCardProps> = ({ imageUrl, title, author = 'Cartesi Foundation' }) => {

  return (
    <View style={{ alignItems: 'center' }}>
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
    </View>
  );
};

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
    marginTop: 8,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 10, // Ensure button stays on top
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
  },
});

export default GameCartridge;