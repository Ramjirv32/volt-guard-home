import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api, { USE_MOCK_DATA } from '../../config/api';
import { EnergyData, EnergyState } from '../../types';

const initialState: EnergyState = {
  currentUsage: 0,
  hourlyData: [],
  dailyData: [],
  monthlyData: [],
  loading: false,
  error: null,
};

// Helper function for mock energy data
const getMockEnergyData = (period: 'hourly' | 'daily' | 'monthly'): EnergyData[] => {
  const count = period === 'hourly' ? 24 : period === 'daily' ? 7 : 12;
  return Array(count).fill(0).map((_, i) => ({ 
    timestamp: new Date(Date.now() - i * (period === 'hourly' ? 3600000 : period === 'daily' ? 86400000 : 2592000000)).toISOString(),
    totalUsage: Math.random() * 5 + 1,
    deviceBreakdown: [
      { deviceId: '1', deviceName: 'Living Room Light', usage: Math.random() * 1 },
      { deviceId: '2', deviceName: 'Kitchen Light', usage: Math.random() * 1 },
      { deviceId: '3', deviceName: 'Smart TV', usage: Math.random() * 3 }
    ],
    cost: Math.random() * 2 + 0.5
  }));
};

// Async thunks
export const fetchEnergyData = createAsyncThunk(
  'energy/fetchEnergyData',
  async ({ period }: { period: 'hourly' | 'daily' | 'monthly' }) => {
    // If we're using mock data, return mock energy data directly without API call
    if (USE_MOCK_DATA) {
      return { period, data: getMockEnergyData(period) };
    }
    
    try {
      const response = await api.get(`/api/iot/data?period=${period}`);
      return { period, data: response.data as EnergyData[] };
    } catch (error) {
      // Return mock data if API fails
      return { period, data: getMockEnergyData(period) };
    }
  }
);

export const fetchCurrentUsage = createAsyncThunk(
  'energy/fetchCurrentUsage',
  async () => {
    // If we're using mock data, return mock current usage directly without API call
    if (USE_MOCK_DATA) {
      return Math.random() * 4 + 1;
    }
    
    try {
      const response = await api.get('/api/iot/current');
      return response.data.usage as number;
    } catch (error) {
      // Return a random value between 1 and 5 if API fails
      return Math.random() * 4 + 1;
    }
  }
);

// Slice
const energySlice = createSlice({
  name: 'energy',
  initialState,
  reducers: {
    updateCurrentUsage: (state, action: PayloadAction<number>) => {
      state.currentUsage = action.payload;
    },
    addEnergyData: (state, action: PayloadAction<EnergyData>) => {
      // Add to hourly data and limit to last 24 entries
      state.hourlyData = [...state.hourlyData, action.payload].slice(-24);
    },
  },
  extraReducers: (builder) => {
    // Fetch energy data
    builder
      .addCase(fetchEnergyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnergyData.fulfilled, (state, action) => {
        state.loading = false;
        const { period, data } = action.payload;
        switch (period) {
          case 'hourly':
            state.hourlyData = data;
            break;
          case 'daily':
            state.dailyData = data;
            break;
          case 'monthly':
            state.monthlyData = data;
            break;
        }
      })
      .addCase(fetchEnergyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch energy data';
      })
      // Fetch current usage
      .addCase(fetchCurrentUsage.fulfilled, (state, action) => {
        state.currentUsage = action.payload;
      });
  },
});

export const { updateCurrentUsage, addEnergyData } = energySlice.actions;
export default energySlice.reducer;
