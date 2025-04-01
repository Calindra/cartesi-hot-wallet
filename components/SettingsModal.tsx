import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as SecureStore from 'expo-secure-store';

interface Settings {
  right: number;
  left: number;
  up: number;
  down: number;
}

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSettingsChange: (settings: Settings) => void;
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

  const handleSliderChange = async (key: keyof Settings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
    await SecureStore.setItemAsync('deviceOrientationSettings', JSON.stringify(newSettings));
  };

  const renderSlider = (key: keyof Settings, label: string) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <Slider
        style={styles.slider}
        minimumValue={-100}
        maximumValue={100}
        step={1}
        value={settings[key]}
        onValueChange={(value) => handleSliderChange(key, value)}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1a9274"
      />
      <Text style={styles.sliderValue}>{settings[key]}</Text>
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
          
          {renderSlider('right', 'Right')}
          {renderSlider('left', 'Left')}
          {renderSlider('up', 'Up')}
          {renderSlider('down', 'Down')}
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
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
    marginBottom: 20
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center'
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 10
  },
  slider: {
    width: '100%',
    height: 40
  },
  sliderValue: {
    fontSize: 16,
    marginTop: 5
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default SettingsModal;