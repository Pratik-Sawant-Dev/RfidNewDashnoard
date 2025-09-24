import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './slices/apiSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    api: apiReducer,
    // Add other slices here as needed
    // user: userReducer,
    // inventory: inventoryReducer,
    // etc.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export default store;