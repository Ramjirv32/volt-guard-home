import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDevices } from "@/store/slices/devicesSlice";
import { fetchEnergyData, fetchCurrentUsage } from "@/store/slices/energySlice";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { DeviceList } from "@/components/Dashboard/DeviceList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Home, 
  Cpu, 
  TrendingDown, 
  TrendingUp,
  AlertTriangle, 
  Battery,
  Lightbulb,
  Thermometer,
  Shield,
  Leaf,
  DollarSign,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { USE_MOCK_DATA } from "@/config/api";
import { EnergyChartDashboard } from "@/components/Dashboard/EnhancedEnergyChart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line
} from "recharts";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUsage } = useSelector((state: RootState) => state.energy);
  const { devices } = useSelector((state: RootState) => state.devices);
  const [connectionError, setConnectionError] = useState(false);

  // Mock chart data for colorful visualizations
  const energyData = [
    { time: "00:00", usage: 2.1, solar: 0, grid: 2.1 },
    { time: "06:00", usage: 3.2, solar: 1.2, grid: 2.0 },
    { time: "12:00", usage: 4.8, solar: 4.2, grid: 0.6 },
    { time: "18:00", usage: 6.1, solar: 2.8, grid: 3.3 },
    { time: "24:00", usage: 3.5, solar: 0, grid: 3.5 }
  ];

  const deviceUsageData = [
    { name: "HVAC", value: 35, color: "#3B82F6" },
    { name: "Lighting", value: 20, color: "#F59E0B" },
    { name: "Kitchen", value: 15, color: "#10B981" },
    { name: "Electronics", value: 18, color: "#8B5CF6" },
    { name: "Others", value: 12, color: "#EF4444" }
  ];

  const weeklyData = [
    { day: "Mon", consumption: 22, cost: 3.2, efficiency: 85 },
    { day: "Tue", consumption: 18, cost: 2.8, efficiency: 92 },
    { day: "Wed", consumption: 25, cost: 3.8, efficiency: 78 },
    { day: "Thu", consumption: 20, cost: 3.1, efficiency: 88 },
    { day: "Fri", consumption: 24, cost: 3.6, efficiency: 82 },
    { day: "Sat", consumption: 28, cost: 4.2, efficiency: 75 },
    { day: "Sun", consumption: 26, cost: 3.9, efficiency: 79 }
  ];

  const temperatureData = [
    { time: "6AM", indoor: 22, outdoor: 18, target: 21 },
    { time: "12PM", indoor: 24, outdoor: 28, target: 23 },
    { time: "6PM", indoor: 25, outdoor: 26, target: 24 },
    { time: "12AM", indoor: 21, outdoor: 20, target: 20 }
  ];

  // Mock data to use when API calls fail
  const getMockData = (type: string) => {
    if (type === 'devices') {
      return [
        { id: '1', name: 'Living Room Light', type: 'light', status: 'off', location: 'Living Room', powerUsage: 0, automationEnabled: false, lastActive: new Date().toISOString() },
        { id: '2', name: 'Kitchen Light', type: 'light', status: 'off', location: 'Kitchen', powerUsage: 0, automationEnabled: true, lastActive: new Date().toISOString() },
        { id: '3', name: 'Smart TV', type: 'plug', status: 'off', location: 'Living Room', powerUsage: 0, automationEnabled: false, lastActive: new Date().toISOString() },
        { id: '4', name: 'Temperature Sensor', type: 'sensor', status: 'on', location: 'Bedroom', powerUsage: 2, automationEnabled: true, lastActive: new Date().toISOString() }
      ];
    }
    
    return null;
  };

  useEffect(() => {
    // Function to fetch data with error handling
    const fetchData = async () => {
      try {
        // Try fetching data from API or mock data
        await dispatch(fetchDevices()).unwrap();
        await dispatch(fetchEnergyData({ period: "hourly" })).unwrap();
        await dispatch(fetchCurrentUsage()).unwrap();
        
        // Only set connection error to false if we're not in mock mode
        // In mock mode, we don't care about connection status
        if (!USE_MOCK_DATA) {
          setConnectionError(false);
        }
      } catch (error) {
        // Only handle connection errors if not in mock mode
        if (!USE_MOCK_DATA) {
          // Only log detailed errors if it's not just a connection issue
          if (!(error instanceof Error && error.message === 'Backend unavailable')) {
            console.warn("Error fetching data, using mock data");
          }
          setConnectionError(true);
          
          // Use mock data if API calls fail
          const mockDevices = getMockData('devices');
          
          if (mockDevices && devices.length === 0) {
            dispatch({ 
              type: 'devices/fetchDevices/fulfilled',
              payload: mockDevices
            });
          }
          
          // Notify user about connection issues
          dispatch(addNotification({
            id: Date.now().toString(),
            type: 'warning',
            title: 'Connection Issue',
            message: 'Unable to connect to the server. Showing demo data.',
            timestamp: new Date().toISOString(),
            read: false,
          }));
        }
      }
    };
    
    fetchData();
    
    // Setup a polling interval to refresh mock data occasionally
    // Use a longer interval since we're just using mock data
    const pollingInterval = USE_MOCK_DATA ? 60000 : 30000; // 60 seconds for mock data, 30 seconds for real API
    
    const intervalId = setInterval(() => {
      fetchData();
    }, pollingInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, devices.length]);

  const activeDevices = devices.filter(d => d.status === "on").length;
  const totalDevices = devices.length || 8; // Mock total if no devices
  const currentUsageDisplay = currentUsage || 3.2; // Mock value if no data
  const isHomeOccupied = activeDevices > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-50 to-emerald-100 dark:from-violet-950 dark:via-sky-950 dark:to-emerald-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <main className="relative container mx-auto px-4 py-8">
          {USE_MOCK_DATA && (
            <Alert className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 dark:text-amber-200">Demo Mode</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                Application is running in demo mode with mock data. No server connection is being attempted.
              </AlertDescription>
            </Alert>
          )}
          
          {!USE_MOCK_DATA && connectionError && (
            <Alert className="mb-6 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 dark:text-red-200">Connection Issue</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                Unable to connect to the server. Showing demo data. Some features may be limited.
              </AlertDescription>
            </Alert>
          )}

          {/* Dashboard Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Your home is consuming <span className="font-bold text-blue-600">{currentUsageDisplay.toFixed(1)} kW</span> right now. 
              You're saving <span className="font-bold text-emerald-600">12%</span> compared to last month.
            </p>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Left Column - Primary Stats */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Real-time Monitoring Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Zap className="w-8 h-8" />
                      <span className="text-blue-100 text-sm font-medium">LIVE</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{currentUsageDisplay.toFixed(1)} kW</div>
                    <div className="text-blue-100 text-sm">Current Usage</div>
                    <div className="mt-4 flex items-center">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      <span className="text-sm">0.3 kW less than usual</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8" />
                      <span className="text-emerald-100 text-sm font-medium">SAVED</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">$42.50</div>
                    <div className="text-emerald-100 text-sm">This Month</div>
                    <div className="mt-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">12% better than last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Leaf className="w-8 h-8" />
                      <span className="text-purple-100 text-sm font-medium">ECO</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">87%</div>
                    <div className="text-purple-100 text-sm">Efficiency Score</div>
                    <div className="mt-4">
                      <div className="w-full bg-purple-400/30 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{width: '87%'}}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Energy Visualization */}
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                        Energy Flow Today
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Real-time energy consumption and generation
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                        <Activity className="w-3 h-3 mr-1" />
                        Usage
                      </Badge>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        <Battery className="w-3 h-3 mr-1" />
                        Solar
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={energyData}>
                      <defs>
                        <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="usage" 
                        stroke="#ef4444" 
                        fill="url(#usageGradient)" 
                        strokeWidth={3}
                        name="Usage (kW)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="solar" 
                        stroke="#10b981" 
                        fill="url(#solarGradient)" 
                        strokeWidth={3}
                        name="Solar (kW)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Device Status Grid */}
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                    Device Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30">
                      <Lightbulb className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="font-bold text-orange-800 dark:text-orange-200">6/8</div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Lights On</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                      <Thermometer className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-bold text-blue-800 dark:text-blue-200">22°C</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Temperature</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="font-bold text-green-800 dark:text-green-200">ARMED</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Security</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                      <Cpu className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="font-bold text-purple-800 dark:text-purple-200">{activeDevices}/{totalDevices}</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Devices</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Secondary Info */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Quick Stats */}
              <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Home Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-100">Occupancy</span>
                      <Badge className="bg-white/20 text-white">
                        {isHomeOccupied ? "Occupied" : "Away"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-100">Active Devices</span>
                      <span className="font-bold">{activeDevices}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-100">Energy Mode</span>
                      <Badge className="bg-emerald-500 text-white">Eco</Badge>
                    </div>
                    <Progress value={75} className="mt-4 bg-white/20" />
                    <div className="text-sm text-indigo-100">75% of daily energy budget used</div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Highlights */}
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                    Today's Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">Peak Efficiency</div>
                      <div className="text-xs text-green-600 dark:text-green-400">Achieved 94% efficiency at 2 PM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Solar Generation</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Generated 12.4 kWh from solar panels</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Smart Optimization</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">HVAC automatically adjusted 3 times</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <button className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Toggle All Lights
                  </button>
                  
                  <button className="w-full p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center">
                    <Leaf className="w-4 h-4 mr-2" />
                    Eco Mode
                  </button>
                  
                  <button className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Arm Security
                  </button>
                </CardContent>
              </Card>

              {/* Weather Widget */}
              <Card className="bg-gradient-to-br from-sky-400 to-blue-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">24°C</div>
                      <div className="text-sky-100">Partly Cloudy</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sky-100 text-sm">Humidity</div>
                      <div className="font-bold">65%</div>
                    </div>
                  </div>
                  <div className="text-xs text-sky-100">
                    Perfect weather for solar generation today!
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}