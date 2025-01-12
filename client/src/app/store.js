import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authSlice } from "../features/slices/authSlice";
import { tweetSlice } from "../features/slices/tweetSlice";
import { searchSlice } from "../features/slices/searchSlice";
import { loaderSlice } from "../features/slices/loaderSlice";
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
// Combine reducers
const rootReducer = combineReducers({
   user: authSlice.reducer,
   tweet: tweetSlice.reducer,
   search: searchSlice.reducer,
   loader : loaderSlice.reducer,
});

// Persist configuration
const persistConfig = {
   key: "root",
   storage,
   whitelist: ["user"], // Persist only the user state
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Persistor
const persistor = persistStore(store);

export { store, persistor };


