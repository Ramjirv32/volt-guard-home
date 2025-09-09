import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDevices } from "@/store/slices/devicesSlice";
import { fetchEnergyData, fetchCurrentUsage } from "@/store/slices/energySlice";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { EnergyLineChart, DeviceUsagePieChart } from "@/components/Dashboard/EnergyChart";
import { DeviceList } from "@/components/Dashboard/DeviceList";
import { Navbar } from "@/components/Layout/Navbar";
import { Zap, Home, Cpu, TrendingDown } from "lucide-react";
import socketManager from "@/utils/socket";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUsage } = useSelector((state: RootState) => state.energy);
  const { devices } = useSelector((state: RootState) => state.devices);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchDevices());
    dispatch(fetchEnergyData({ period: "hourly" }));
    dispatch(fetchCurrentUsage());
    
    // Connect to WebSocket
    socketManager.connect();
    
    return () => {
      socketManager.disconnect();
    };
  }, [dispatch]);

  const activeDevices = devices.filter(d => d.status === "on").length;
  const totalDevices = devices.length || 8; // Mock total if no devices
  const currentUsageDisplay = currentUsage || 3.2; // Mock value if no data
  const isHomeOccupied = activeDevices > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Energy Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and control your smart home in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Current Usage"
            value={`${currentUsageDisplay.toFixed(1)} kW`}
            subtitle="Real-time power consumption"
            icon={Zap}
            status="active"
            trend="down"
            trendValue="0.3 kW"
          />
          <StatsCard
            title="Home Status"
            value={isHomeOccupied ? "Occupied" : "Away"}
            subtitle={`${activeDevices} devices active`}
            icon={Home}
            status={isHomeOccupied ? "active" : "idle"}
          />
          <StatsCard
            title="Connected Devices"
            value={totalDevices}
            subtitle={`${activeDevices} currently active`}
            icon={Cpu}
            status="active"
          />
          <StatsCard
            title="Monthly Savings"
            value="$42.50"
            subtitle="Compared to last month"
            icon={TrendingDown}
            trend="down"
            trendValue="12%"
          />
        </div>

        {/* Charts and Device List */}
        <div className="grid gap-4 md:grid-cols-3">
          <EnergyLineChart />
          <DeviceUsagePieChart />
          <DeviceList />
        </div>
      </main>
    </div>
  );
}