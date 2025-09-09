import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { updateDeviceStatus, updateDevicePower } from '../store/slices/devicesSlice';
import { updateCurrentUsage, addEnergyData } from '../store/slices/energySlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { SocketEvent } from '../types';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
      
      // Notify user
      store.dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Connected',
        message: 'Real-time updates connected',
        timestamp: new Date().toISOString(),
        read: false,
      }));
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        store.dispatch(addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Connection Failed',
          message: 'Unable to connect to real-time updates',
          timestamp: new Date().toISOString(),
          read: false,
        }));
      }
    });

    // Custom events
    this.socket.on('deviceUpdate', (data: SocketEvent) => {
      const { deviceId, status, powerUsage } = data.payload;
      
      if (status) {
        store.dispatch(updateDeviceStatus({ id: deviceId, status }));
      }
      
      if (powerUsage !== undefined) {
        store.dispatch(updateDevicePower({ id: deviceId, powerUsage }));
      }
    });

    this.socket.on('energyUpdate', (data: SocketEvent) => {
      const { currentUsage, energyData } = data.payload;
      
      if (currentUsage !== undefined) {
        store.dispatch(updateCurrentUsage(currentUsage));
      }
      
      if (energyData) {
        store.dispatch(addEnergyData(energyData));
      }
    });

    this.socket.on('alert', (data: SocketEvent) => {
      const notification = {
        id: Date.now().toString(),
        ...data.payload,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      store.dispatch(addNotification(notification));
    });

    this.socket.on('presence', (data: SocketEvent) => {
      const { detected, location, confidence } = data.payload;
      
      if (detected) {
        store.dispatch(addNotification({
          id: Date.now().toString(),
          type: 'info',
          title: 'Presence Detected',
          message: `User detected in ${location} (${confidence}% confidence)`,
          timestamp: new Date().toISOString(),
          read: false,
        }));
      }
    });
  }

  emit(event: string, data: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketManager = new SocketManager();
export default socketManager;