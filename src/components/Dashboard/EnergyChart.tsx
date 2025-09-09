import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export function EnergyLineChart() {
  const { hourlyData } = useSelector((state: RootState) => state.energy);
  
  // Generate mock data if no real data
  const mockData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    totalUsage: Math.random() * 5 + 2,
  }));
  
  const chartData = hourlyData.length > 0 ? hourlyData : mockData;

  const data = {
    labels: chartData.map((d) => d.timestamp),
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
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(var(--border) / 0.5)",
        },
      },
    },
  };

  return (
    <Card className="col-span-1 md:col-span-2 card-hover">
      <CardHeader>
        <CardTitle>Hourly Energy Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}

export function DeviceUsagePieChart() {
  const { devices } = useSelector((state: RootState) => state.devices);
  
  // Mock device breakdown
  const deviceBreakdown = devices.length > 0 
    ? devices.map(d => ({ name: d.name, usage: d.powerUsage }))
    : [
        { name: "Lights", usage: 150 },
        { name: "HVAC", usage: 800 },
        { name: "Appliances", usage: 450 },
        { name: "Electronics", usage: 200 },
      ];

  const data = {
    labels: deviceBreakdown.map((d) => d.name),
    datasets: [
      {
        data: deviceBreakdown.map((d) => d.usage),
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--energy-active))",
          "hsl(var(--energy-idle))",
          "hsl(var(--primary-glow))",
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
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed} W`,
        },
      },
    },
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Device Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Pie data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}