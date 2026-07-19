import AsyncStorage from '@react-native-async-storage/async-storage';

let memoryStore = {};

export const safeStorage = {
  async setItem(key, value) {
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("AsyncStorage native module is null or inaccessible, using memory fallback.", e);
    }
    memoryStore[key] = value;
  },

  async getItem(key) {
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null && val !== undefined) {
          return val;
        }
      }
    } catch (e) {
      console.warn("AsyncStorage native module is null or inaccessible, using memory fallback.", e);
    }
    return memoryStore[key] || null;
  },

  async removeItem(key) {
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("AsyncStorage native module is null or inaccessible, using memory fallback.", e);
    }
    delete memoryStore[key];
  }
};
