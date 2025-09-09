import { useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchEnergyData } from "@/store/slices/energySlice";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Helper function to format timestamps
const formatTimestamp = (timestamp: string, period: 'hourly' | 'daily' | 'monthly') => {
  if (!timestamp) return "";
  const date = parseISO(timestamp);
  
  switch (period) {
    case 'hourly':
      return format(date, 'HH:mm');
    case 'daily':
      return format(date, 'MMM dd');
    case 'monthly':
      return format(date, 'MMM yyyy');
    default:
      return format(date, 'MMM dd, HH:mm');
  }
};

export function EnergyChartDashboard() {
  const [period, setPeriod] = useState<'hourly' | 'daily' | 'monthly'>('hourly');
  const dispatch = useDispatch<AppDispatch>();
  const { hourlyData, dailyData, monthlyData, loading } = useSelector((state: RootState) => state.energy);
  
  useEffect(() => {
    dispatch(fetchEnergyData({ period }));
  }, [dispatch, period]);
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value as 'hourly' | 'daily' | 'monthly');
  };
  
  const getData = () => {
    switch (period) {
      case 'hourly':
        return hourlyData;
      case 'daily':
        return dailyData;
      case 'monthly':
        return monthlyData;
      default:
        return hourlyData;
    }
  };
  
  const chartData = getData();
  
  return (
    <Card className="col-span-1 md:col-span-3 card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Energy Usage</CardTitle>
          <CardDescription>
            Monitor your {period} energy consumption
          </CardDescription>
        </div>
        <Select onValueChange={handlePeriodChange} defaultValue={period}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-[300px]">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="line" className="h-[400px]">
            <EnergyLineChart data={chartData} period={period} />
          </TabsContent>
          
          <TabsContent value="bar" className="h-[400px]">
            <EnergyBarChart data={chartData} period={period} />
          </TabsContent>
          
          <TabsContent value="pie" className="h-[400px]">
            <DeviceUsagePieChart data={chartData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Line Chart Component
function EnergyLineChart({ data, period }: { data: any[], period: 'hourly' | 'daily' | 'monthly' }) {
  // Generate mock data if no real data
  const mockData = Array.from({ length: period === 'hourly' ? 24 : period === 'daily' ? 7 : 12 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * (period === 'hourly' ? 3600000 : period === 'daily' ? 86400000 : 2592000000)).toISOString(),
    totalUsage: Math.random() * 5 + 2,
  }));
  
  const chartData = data && data.length > 0 ? data : mockData;

  const lineData = {
    labels: chartData.map((d) => formatTimestamp(d.timestamp, period)),
    datasets: [
      {
        label: "Energy Usage (kWh)",
        data: chartData.map((d) => d.totalUsage),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(2)} kWh`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        reverse: true, // Show most recent data on the right
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(var(--border) / 0.5)",
        },
      },
    },
  };

  return <Line data={lineData} options={options} />;
}

// Bar Chart Component
function EnergyBarChart({ data, period }: { data: any[], period: 'hourly' | 'daily' | 'monthly' }) {
  // Generate mock data if no real data
  const mockData = Array.from({ length: period === 'hourly' ? 24 : period === 'daily' ? 7 : 12 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * (period === 'hourly' ? 3600000 : period === 'daily' ? 86400000 : 2592000000)).toISOString(),
    totalUsage: Math.random() * 5 + 2,
    cost: Math.random() * 1 + 0.5,
  }));
  
  const chartData = data && data.length > 0 ? data : mockData;

  const barData = {
    labels: chartData.map((d) => formatTimestamp(d.timestamp, period)),
    datasets: [
      {
        label: "Energy Usage (kWh)",
        data: chartData.map((d) => d.totalUsage),
        backgroundColor: "hsl(var(--primary))",
      },
      {
        label: "Cost ($)",
        data: chartData.map((d) => d.cost || (d.totalUsage * 0.15)), // Default cost calculation if none exists
        backgroundColor: "hsl(var(--energy-active))",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        reverse: true, // Show most recent data on the right
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(var(--border) / 0.5)",
        },
      },
    },
  };

  return <Bar data={barData} options={options} />;
}

// Pie Chart Component
function DeviceUsagePieChart({ data }: { data: any[] }) {
  // Combine device usage across all time periods
  const deviceMap = new Map();
  
  if (data && data.length > 0) {
    data.forEach(entry => {
      if (entry.deviceBreakdown && entry.deviceBreakdown.length) {
        entry.deviceBreakdown.forEach((device: any) => {
          if (!deviceMap.has(device.deviceId)) {
            deviceMap.set(device.deviceId, { 
              name: device.deviceName, 
              usage: 0 
            });
          }
          deviceMap.get(device.deviceId).usage += device.usage || 0;
        });
      }
    });
  }
  
  // If no data, use mock data
  const deviceBreakdown = deviceMap.size > 0 
    ? Array.from(deviceMap.values())
    : [
        { name: "Lights", usage: 150 },
        { name: "HVAC", usage: 800 },
        { name: "Appliances", usage: 450 },
        { name: "Electronics", usage: 200 },
      ];

  const pieData = {
    labels: deviceBreakdown.map((d) => d.name),
    datasets: [
      {
        data: deviceBreakdown.map((d) => d.usage),
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--energy-active))",
          "hsl(var(--energy-idle))",
          "hsl(var(--primary-glow))",
          "hsl(var(--accent))",
          "hsl(var(--success))",
          "hsl(var(--destructive))",
          "hsl(var(--warning))",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.toFixed(2)} kWh`,
        },
      },
    },
  };

  return <Pie data={pieData} options={options} />;
}
