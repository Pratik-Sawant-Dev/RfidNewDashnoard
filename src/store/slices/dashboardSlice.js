import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

// Async thunk for fetching weight by category
export const fetchWeightByCategory = createAsyncThunk(
  'dashboard/fetchWeightByCategory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/Dashboard/weight-by-category');
      // Handle different response structures
      const responseData = response?.data || response;
      
      // If response has a 'data' property (wrapped response), extract it
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return Array.isArray(responseData.data) ? responseData.data : [];
      }
      
      // If response is directly an array
      if (Array.isArray(responseData)) {
        return responseData;
      }
      
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch weight by category');
    }
  }
);

// Initial state
const initialState = {
  weightByCategory: [],
  loading: false,
  error: null,
};

// Create the dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearWeightByCategory: (state) => {
      state.weightByCategory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeightByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeightByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.weightByCategory = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchWeightByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch weight by category';
        state.weightByCategory = [];
      });
  },
});

// Export actions
export const { clearWeightByCategory } = dashboardSlice.actions;

// Export selectors
export const selectWeightByCategory = (state) => state.dashboard.weightByCategory;
export const selectWeightByCategoryLoading = (state) => state.dashboard.loading;
export const selectWeightByCategoryError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;
