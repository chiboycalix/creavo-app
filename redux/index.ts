import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import moduleReducer from "./slices/module.slice";
import courseReducer from "./slices/course.slice";
import uploadReducer from "./slices/upload.slice";
import communityReducer from "./slices/community.slice";
import spaceReducer from "./slices/space.slice";
export type RootState = ReturnType<typeof rootReducer>;
import { KEYS } from "@/types";

const persistConfig = {
  key: KEYS.REDUX_STORE,
  storage: storageSession,
  whitelist: [
    "moduleStore",
    "courseStore",
    "uploadStore",
    "communityStore",
    "spaceStore",
  ],
};

const rootReducer = combineReducers({
  moduleStore: moduleReducer,
  courseStore: courseReducer,
  uploadStore: uploadReducer,
  communityStore: communityReducer,
  spaceStore: spaceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
