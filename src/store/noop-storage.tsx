'use client';

import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

type StorageKey = string;
type StorageValue = string | null;

const createNoopStorage = (): {
  getItem: (key: StorageKey) => Promise<StorageValue>;
  setItem: (key: StorageKey, value: StorageValue) => Promise<void>;
  removeItem: (key: StorageKey) => Promise<void>;
} => {
  return {
    getItem(_key: StorageKey) {
      return Promise.resolve(null);
    },
    setItem(_key: StorageKey, _value: StorageValue) {
      return Promise.resolve();
    },
    removeItem(_key: StorageKey) {
      return Promise.resolve();
    },
  };
};

const noopStorage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export default noopStorage;
