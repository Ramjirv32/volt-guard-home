import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSettings } from '../../types';

const initialState: UserSettings = {
  theme: 'system',
  emailNotifications: true,
  pushNotifications: true,
  whatsappNotifications: false,
  energyGoal: 500, // kWh per month
  currency: 'USD',
  timezone: 'America/New_York',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      return { ...state, ...action.payload };
    },
    toggleTheme: (state) => {
      const themes: UserSettings['theme'][] = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(state.theme);
      state.theme = themes[(currentIndex + 1) % themes.length];
    },
    resetSettings: () => initialState,
  },
});

export const { updateSettings, toggleTheme, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
