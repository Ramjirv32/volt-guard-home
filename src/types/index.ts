// User and Authentication Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Device Types
export interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'plug' | 'sensor' | 'camera' | 'lock';
  status: 'on' | 'off' | 'idle';
  powerUsage: number; // in watts
  location: string;
  automationEnabled: boolean;
  lastActive: string;
  sensorId?: string;
}

export interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  loading: boolean;
  error: string | null;
}

// Energy Data Types
export interface EnergyData {
  timestamp: string;
  totalUsage: number; // in kWh
  deviceBreakdown: {
    deviceId: string;
    deviceName: string;
    usage: number;
  }[];
  cost: number; // in currency
}

export interface EnergyState {
  currentUsage: number;
  hourlyData: EnergyData[];
  dailyData: EnergyData[];
  monthlyData: EnergyData[];
  loading: boolean;
  error: string | null;
}

// Automation Rule Types
export interface AutomationRule {
  id: string;
  name: string;
  deviceId: string;
  trigger: 'time' | 'idle' | 'presence' | 'energy';
  condition: string;
  action: 'on' | 'off' | 'dim' | 'notify';
  enabled: boolean;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  deviceId?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  whatsappNotifications: boolean;
  energyGoal: number; // monthly kWh goal
  currency: string;
  timezone: string;
}

// WebSocket Event Types
export interface SocketEvent {
  type: 'deviceUpdate' | 'energyUpdate' | 'alert' | 'presence';
  payload: any;
}