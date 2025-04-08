import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as SecureStore from 'expo-secure-store';
import { ThemedButton } from './ThemedButton';
import { DeviceOrientation, getDefaultSettings, Settings } from '@/src/model/Settings';
import { settingsService } from '@/src/services/SettingsService';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: Settings) => void;
  onMovementModeChange?: (url: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onSettingsChange,
  onMovementModeChange,
}) => {
  const [settings, setSettings] = useState<Settings>(getDefaultSettings());

  const [useTilt, setUseTilt] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedSettings = await settingsService.loadSettings();
      setSettings(storedSettings);
      const tilt = storedSettings.movementMode === 'tilt'
      setUseTilt(tilt);
      onMovementModeChange?.(tilt ? 'doom-smooth-turn.html' : 'doom-with-arrows.html');
    };
    loadSettings();
  }, []);

  const handleSliderChange = async (key: keyof DeviceOrientation, userValue: number) => {
    const realValue = userValue;
    const newSettings = { ...settings, deviceOrientation: { ...settings.deviceOrientation, [key]: realValue } };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
    await SecureStore.setItemAsync('deviceOrientationSettings', JSON.stringify(newSettings));
  };

  const handleToggle = async (newUseTilt: boolean) => {
    setUseTilt(newUseTilt);
    const newSettings = { ...settings };
    newSettings.movementMode = newUseTilt ? 'tilt' : 'arrow';
    await SecureStore.setItemAsync('deviceOrientationSettings', JSON.stringify(newSettings));
    onMovementModeChange?.(newUseTilt ? 'doom-smooth-turn.html' : 'doom-with-arrows.html');
    console.log(`saved`, JSON.stringify(newSettings));
  };

  const renderSlider = (key: keyof DeviceOrientation, label: string, settings: Settings) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={200}
        step={1}
        value={settings.deviceOrientation[key]}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#333333"
        thumbTintColor="#FFFFFF"
        onSlidingComplete={(userValue) => {
          handleSliderChange(key, userValue);
        }}
      />
      <Text style={styles.sliderValue}>{String(settings.deviceOrientation[key] + 100)}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      supportedOrientations={['landscape', 'landscape-right']} // works=true
    >
      <View style={styles.modalContainer}>
        <ScrollView
          style={styles.modalContent}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <Text style={styles.modalTitle}>Settings</Text>

          <View style={styles.toggleContainer}>
            <Text style={styles.modalSubtitle}>
              Movement Mode: {useTilt ? 'Tilt' : 'Arrows'}
            </Text>
            <Switch
              value={useTilt}
              onValueChange={handleToggle}
              thumbColor={useTilt ? '#4CAF50' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          </View>

          <Text style={styles.modalSubtitle}>Controller Sensitivity</Text>
          {renderSlider('leftRight', '(-) Left Right (+)', settings)}
          {renderSlider('upDown', '(-) Up Down (+)', settings)}
          {renderSlider('upDownAngle', 'Up Down Angle', settings)}

          <ThemedButton
            type="button"
            buttonText="Close"
            onPress={() => {
              SecureStore.setItemAsync('deviceOrientationSettings', JSON.stringify(settings));
              onClose()
            }}
            style={styles.closeButton}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '75%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  closeButton: {
    marginTop: 20,
    height: 50,
    alignSelf: 'stretch',
    marginBottom: 30,
  },
});

export default SettingsModal;
