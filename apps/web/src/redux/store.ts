import { configureStore, combineReducers, Action, Dispatch } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';

const fingerprintName =
  process.env.NEXT_PUBLIC_FINGERPRINT_NAME || 'default_key';

const persistConfig = {
  key: fingerprintName,
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export const { store, persistor } = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = Dispatch<Action>;
