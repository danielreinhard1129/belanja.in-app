import {
  configureStore,
  combineReducers,
  Action,
  Dispatch,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./slices/userSlice";
import tokenExpirationMiddleware from "./middlewares/tokenExpiration";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const fingerprintName =
  process.env.NEXT_PUBLIC_FINGERPRINT_NAME || "default_key";

const persistConfig = {
  key: fingerprintName,
  storage,
  whitelist: ["user"],
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
      }).concat(tokenExpirationMiddleware),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export const { store, persistor } = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = Dispatch<Action>;
