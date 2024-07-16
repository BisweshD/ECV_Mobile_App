import localforage from 'localforage';

localforage.config({
  driver: localforage.INDEXEDDB, // Force IndexedDB; same as using setDriver()
  name: 'myApp',
  version: 1.0,
  storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
  description: 'some description'
});

export const clearOldCache = async () => {
  try {
    await localforage.clear();
    console.log('Old cache cleared');
  } catch (err) {
    console.error('Error clearing old cache:', err);
  }
};

export const setItem = async (key: string, value: any) => {
  try {
    await localforage.setItem(key, value);
    console.log(`Data with key "${key}" has been set in IndexedDB`);
  } catch (err) {
    console.error('Error setting data in IndexedDB:', err);
  }
};

export const getItem = async (key: string): Promise<any> => {
  try {
    const value = await localforage.getItem(key);
    console.log(`Data with key "${key}" has been retrieved from IndexedDB`);
    return value;
  } catch (err) {
    console.error('Error getting data from IndexedDB:', err);
  }
};
