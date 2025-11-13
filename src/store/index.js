import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './slices/apiSlice';
import authReducer from './slices/authSlice';
import permissionReducer from './slices/permissionSlice';
import dashboardReducer from './slices/dashboardSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    api: apiReducer,
    auth: authReducer,
    permissions: permissionReducer,
    dashboard: dashboardReducer,
    // Add other slices here as needed
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