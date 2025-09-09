import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Lightbulb,
  Wifi,
  Shield,
  RefreshCw,
  Eye,
  Bell,
  Settings
} from "lucide-react";

export default function Monitoring() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock real-time monitoring data
  const [monitoringData, setMonitoringData] = useState({
    currentPower: 3.2,
    voltage: 240,
    frequency: 50.1,
    powerFactor: 0.85,
    totalDevices: 11,
    activeDevices: 6,
    alertsCount: 2,
    systemHealth: "Good"
  });

  // Mock device status
  const deviceStatus = [
    { id: 1, name: "HVAC System", status: "active", power: 2.1, health: "good", lastSeen: "2 min ago" },
    { id: 2, name: "Water Heater", status: "standby", power: 0.0, health: "good", lastSeen: "5 min ago" },
    { id: 3, name: "Refrigerator", status: "active", power: 0.15, health: "good", lastSeen: "1 min ago" },
    { id: 4, name: "Smart TV", status: "active", power: 0.12, health: "good", lastSeen: "3 min ago" },
    { id: 5, name: "WiFi Router", status: "active", power: 0.008, health: "warning", lastSeen: "10 min ago" },
    { id: 6, name: "Security System", status: "active", power: 0.025, health: "good", lastSeen: "1 min ago" },
    { id: 7, name: "Smart Lights", status: "active", power: 0.045, health: "good", lastSeen: "2 min ago" },
    { id: 8, name: "Coffee Maker", status: "offline", power: 0.0, health: "offline", lastSeen: "2 hours ago" }
  ];

  // Mock alerts
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "High Power Consumption",
      message: "HVAC system consuming 15% above normal levels",
      timestamp: "2 minutes ago",
      device: "HVAC System"
    },
    {
      id: 2,
      type: "info",
      title: "Device Reconnected",
      message: "Smart TV reconnected to network",
      timestamp: "5 minutes ago",
      device: "Smart TV"
    },
    {
      id: 3,
      type: "error",
      title: "Connection Lost",
      message: "Coffee Maker is offline",
      timestamp: "2 hours ago",
      device: "Coffee Maker"
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setMonitoringData(prev => ({
        ...prev,
        currentPower: prev.currentPower + (Math.random() - 0.5) * 0.2,
        voltage: 240 + (Math.random() - 0.5) * 2,
        frequency: 50 + (Math.random() - 0.5) * 0.2,
        powerFactor: Math.max(0.7, Math.min(0.95, prev.powerFactor + (Math.random() - 0.5) * 0.05))
      }));
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "standby":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-500" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "good":
        return "text-emerald-600 dark:text-emerald-400";
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      case "offline":
        return "text-slate-500";
      default:
        return "text-slate-500";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent">
            Real-time Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor your energy consumption and device status in real-time
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant={isMonitoring ? "default" : "outline"} 
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={isMonitoring ? "bg-gradient-to-r from-cyan-600 to-blue-500" : ""}
          >
            <Activity className={`mr-2 h-4 w-4 ${isMonitoring ? "animate-pulse" : ""}`} />
            {isMonitoring ? "Monitoring" : "Start Monitoring"}
          </Button>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4 text-cyan-500" />
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-cyan-700 dark:text-cyan-300 flex items-center">
              <Zap className="mr-2 h-5 w-5 text-cyan-500" />
              Current Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
              {monitoringData.currentPower.toFixed(2)} kW
            </div>
            <p className="text-xs text-cyan-600/80 dark:text-cyan-400/80">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-blue-700 dark:text-blue-300 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {monitoringData.systemHealth}
            </div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
              {monitoringData.activeDevices}/{monitoringData.totalDevices} devices active
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-purple-700 dark:text-purple-300 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-purple-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {monitoringData.alertsCount}
            </div>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
              Require attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-teal-200 dark:border-teal-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-teal-700 dark:text-teal-300 flex items-center">
              <Thermometer className="mr-2 h-5 w-5 text-teal-500" />
              Power Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">
              {(monitoringData.powerFactor * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-teal-600/80 dark:text-teal-400/80">
              Power factor: {monitoringData.powerFactor.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid System Metrics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-cyan-500" />
            Grid Connection Metrics
          </CardTitle>
          <CardDescription>
            Real-time electrical parameters from your connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-md bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {monitoringData.voltage.toFixed(1)}V
              </div>
              <div className="text-sm text-muted-foreground">Grid Voltage</div>
              <div className="text-xs text-emerald-500 mt-1">Normal Range</div>
            </div>
            <div className="text-center p-4 rounded-md bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {monitoringData.frequency.toFixed(1)}Hz
              </div>
              <div className="text-sm text-muted-foreground">Frequency</div>
              <div className="text-xs text-emerald-500 mt-1">Stable</div>
            </div>
            <div className="text-center p-4 rounded-md bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {(monitoringData.powerFactor * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Power Factor</div>
              <div className="text-xs text-emerald-500 mt-1">Efficient</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Status and Alerts */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-cyan-500" />
                Device Status
              </CardTitle>
              <CardDescription>
                Real-time status of all connected devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deviceStatus.map(device => (
                  <div key={device.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(device.status)}
                      <div>
                        <h4 className="font-medium text-sm">{device.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Last seen: {device.lastSeen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {device.power > 0 ? `${device.power} kW` : "0 W"}
                        </div>
                        <div className={`text-xs capitalize ${getHealthColor(device.health)}`}>
                          {device.health}
                        </div>
                      </div>
                      <Badge variant={device.status === "active" ? "default" : device.status === "standby" ? "secondary" : "destructive"}>
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-purple-500" />
                Recent Alerts
              </CardTitle>
              <CardDescription>
                System notifications and warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <Alert key={alert.id} className={`${
                    alert.type === "error" ? "border-red-200 dark:border-red-800" :
                    alert.type === "warning" ? "border-amber-200 dark:border-amber-800" :
                    "border-blue-200 dark:border-blue-800"
                  }`}>
                    {getAlertIcon(alert.type)}
                    <AlertTitle className="text-sm">{alert.title}</AlertTitle>
                    <AlertDescription className="text-xs">
                      {alert.message}
                      <div className="mt-1 text-xs text-muted-foreground">
                        {alert.device} • {alert.timestamp}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
