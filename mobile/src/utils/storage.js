import AsyncStorage from '@react-native-async-storage/async-storage';

let memoryStore = {};

const getLocalStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {}
  return null;
};

export const safeStorage = {
  async setItem(key, value) {
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {}
    
    const local = getLocalStorage();
    if (local) {
      try {
        local.setItem(key, value);
      } catch (e) {}
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
    } catch (e) {}
    
    const local = getLocalStorage();
    if (local) {
      try {
        const val = local.getItem(key);
        if (val !== null && val !== undefined) {
          return val;
        }
      } catch (e) {}
    }
    
    return memoryStore[key] || null;
  },

  async removeItem(key) {
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {}
    
    const local = getLocalStorage();
    if (local) {
      try {
        local.removeItem(key);
      } catch (e) {}
    }
    
    delete memoryStore[key];
  }
};
