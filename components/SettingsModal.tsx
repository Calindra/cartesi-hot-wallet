import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as SecureStore from 'expo-secure-store';
import { ThemedButton } from './ThemedButton';
import { Settings } from '@/types/types';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  visible, 
  onClose, 
  onSettingsChange 
}) => {
  const [settings, setSettings] = useState<Settings>({
    right: 3,
    left: -3,
    up: -41,
    down: -51
  });

  useEffect(() => {
    const loadSettings = async () => {
      const storedSettings = await SecureStore.getItemAsync('deviceOrientationSettings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    };
    loadSettings();
  }, []);

  const handleSliderChange = async (key: keyof Settings, userValue: number) => {
    const realValue = userValue - 100; // Convert user value (0-200) to real value (-100 to 100)
    const newSettings = { ...settings, [key]: realValue };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
    await SecureStore.setItemAsync('deviceOrientationSettings', JSON.stringify(newSettings));
  };

  const renderSlider = (key: keyof Settings, label: string) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0} // User sees 0-200
        maximumValue={200}
        step={1}
        value={settings[key] + 100} // Convert real value (-100 to 100) to user value (0-200)
        onValueChange={(userValue) => handleSliderChange(key, userValue)}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#333333"
        thumbTintColor="#FFFFFF"
      />
      <Text style={styles.sliderValue}>{String(settings[key] + 100)}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Settings</Text>
          <Text style={styles.modalSubtitle}>Controller Sensitivity</Text>
          
          {renderSlider('right', 'Right')}
          {renderSlider('left', 'Left')}
          {renderSlider('up', 'Up')}
          {renderSlider('down', 'Down')}
          
          <ThemedButton 
            type="button" 
            buttonText="Close" 
            onPress={onClose} 
            style={styles.closeButton} 
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10 // Adjusted margin
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 20
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center'
  },
  sliderLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10
  },
  slider: {
    width: '100%',
    height: 40
  },
  sliderValue: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5
  },
  closeButton: {
    marginTop: 20,
    height: 50,
    alignSelf: 'stretch'
  }
});

export default SettingsModal;