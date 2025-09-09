# Smart Home Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   - The `.env` file is already configured with your MongoDB connection string
   - Update `JWT_SECRET` for production use

3. **Run the Server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

4. **Server will run on**
   - HTTP: http://localhost:5000
   - WebSocket: ws://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (use viewer@smarthome.demo / Demo123! for demo)
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/settings` - Update user settings

### Devices
- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get single device
- `POST /api/devices` - Create device
- `PATCH /api/devices/:id` - Update device
- `POST /api/devices/:id/toggle` - Toggle device on/off
- `DELETE /api/devices/:id` - Delete device

### Energy Data
- `GET /api/iot/data?period=hourly` - Get energy data (hourly/daily/monthly)
- `GET /api/iot/current` - Get current power usage
- `POST /api/iot/record` - Record sensor data (for IoT devices)
- `GET /api/iot/stats` - Get energy statistics

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## WebSocket Events

### Client → Server
- `join` - Join user room for targeted updates
- `deviceControl` - Control device
- `requestEnergyUpdate` - Request energy data

### Server → Client
- `deviceUpdate` - Device status changed
- `energyUpdate` - New energy data available
- `alert` - New notification
- `presence` - Presence detection event

## Testing with Demo Account

Login with:
- Email: `viewer@smarthome.demo`
- Password: `Demo123!`

This will return demo data without requiring real devices.

## IoT Sensor Integration

Send PZEM-004T data to `/api/iot/record`:
```json
{
  "sensorId": "PZEM-001",
  "voltage": 230.5,
  "current": 2.3,
  "power": 529.15,
  "energy": 125.4,
  "powerFactor": 0.95,
  "frequency": 50
}
```

## Database Schema

- **Users** - User accounts and settings
- **Devices** - Smart home devices
- **EnergyData** - Time-series energy consumption
- **Notifications** - User notifications

## Notes

- JWT tokens expire after 7 days
- WebSocket connections auto-reconnect
- Demo viewer account bypasses database
- All timestamps are in ISO 8601 format