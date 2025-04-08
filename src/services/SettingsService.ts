import * as SecureStore from 'expo-secure-store';
import { getDefaultSettings, Settings } from '../model/Settings';

class SettingsService {
    async loadSettings(): Promise<Settings> {
        const defaultSettings = getDefaultSettings();
        const storedSettings = await SecureStore.getItemAsync('deviceOrientationSettings');
        if (storedSettings) {
            const stored = JSON.parse(storedSettings)
            if (!stored.deviceOrientation) {
                stored.deviceOrientation = defaultSettings.deviceOrientation;
            }
            if (!stored.movementMode) {
                stored.movementMode = defaultSettings.movementMode;
            }
            return stored
        } else {
            return defaultSettings
        }
    };
}

const settingsService = new SettingsService()
export { settingsService }