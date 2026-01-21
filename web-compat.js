// Web compatibility shims for React Native Web
import { Platform } from 'react-native';

// Polyfill for AsyncStorage on web
if (Platform.OS === 'web') {
  // Use localStorage as fallback for AsyncStorage on web
  const AsyncStorageWeb = {
    getItem: async (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage not available:', e);
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('localStorage setItem failed:', e);
      }
    },
    removeItem: async (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('localStorage removeItem failed:', e);
      }
    },
  };

  // Replace AsyncStorage if needed
  if (typeof window !== 'undefined') {
    window.__ASYNC_STORAGE_WEB__ = AsyncStorageWeb;
  }
}

export default {};
