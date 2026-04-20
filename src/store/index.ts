import type { Action } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { type ThunkAction } from 'redux-thunk';

import noopStorage from '@/store/noop-storage';
import rootReducer from '@/store/root-reducer';

const persistConfig = {
  key: 'root',
  storage: noopStorage, // Specify storage (localStorage in this case)
  whitelist: ['device', 'passkey', 'user'], // Persist device, passkey, and user state across page refreshes
};

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production', // NOTE : Enable devTools only in development
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;

// Custom hooks for dispatch and selector
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch: () => AppDispatch = () => useReduxDispatch<AppDispatch>();
