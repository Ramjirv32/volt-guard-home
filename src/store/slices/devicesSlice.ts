import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../config/api';
import { Device, DeviceState } from '../../types';
import toast from 'react-hot-toast';

const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async () => {
    const response = await api.get('/devices');
    return response.data as Device[];
  }
);

export const addDevice = createAsyncThunk(
  'devices/addDevice',
  async (device: Omit<Device, 'id'>) => {
    const response = await api.post('/devices', device);
    return response.data as Device;
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, updates }: { id: string; updates: Partial<Device> }) => {
    const response = await api.patch(`/devices/${id}`, updates);
    return response.data as Device;
  }
);

export const toggleDevice = createAsyncThunk(
  'devices/toggleDevice',
  async (id: string) => {
    const response = await api.post(`/devices/${id}/toggle`);
    return response.data as Device;
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/deleteDevice',
  async (id: string) => {
    await api.delete(`/devices/${id}`);
    return id;
  }
);

// Slice
const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    selectDevice: (state, action: PayloadAction<Device | null>) => {
      state.selectedDevice = action.payload;
    },
    updateDeviceStatus: (state, action: PayloadAction<{ id: string; status: Device['status'] }>) => {
      const device = state.devices.find(d => d.id === action.payload.id);
      if (device) {
        device.status = action.payload.status;
      }
    },
    updateDevicePower: (state, action: PayloadAction<{ id: string; powerUsage: number }>) => {
      const device = state.devices.find(d => d.id === action.payload.id);
      if (device) {
        device.powerUsage = action.payload.powerUsage;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch devices
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch devices';
      })
      // Add device
      .addCase(addDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
        toast.success('Device added successfully');
      })
      // Update device
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.devices.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
        toast.success('Device updated');
      })
      // Toggle device
      .addCase(toggleDevice.fulfilled, (state, action) => {
        const index = state.devices.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
      })
      // Delete device
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.devices = state.devices.filter(d => d.id !== action.payload);
        toast.success('Device removed');
      });
  },
});

export const { selectDevice, updateDeviceStatus, updateDevicePower } = devicesSlice.actions;
export default devicesSlice.reducer;