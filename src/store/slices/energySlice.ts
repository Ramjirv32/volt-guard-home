import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../config/api';
import { EnergyData, EnergyState } from '../../types';

const initialState: EnergyState = {
  currentUsage: 0,
  hourlyData: [],
  dailyData: [],
  monthlyData: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchEnergyData = createAsyncThunk(
  'energy/fetchEnergyData',
  async ({ period }: { period: 'hourly' | 'daily' | 'monthly' }) => {
    const response = await api.get(`/iot/data?period=${period}`);
    return { period, data: response.data as EnergyData[] };
  }
);

export const fetchCurrentUsage = createAsyncThunk(
  'energy/fetchCurrentUsage',
  async () => {
    const response = await api.get('/iot/current');
    return response.data.usage as number;
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