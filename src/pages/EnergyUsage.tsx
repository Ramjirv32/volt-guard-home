import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Home,
  Lightbulb,
  Thermometer,
  Tv,
  Refrigerator,
  WashingMachine,
  Router,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Filter
} from "lucide-react";

export default function EnergyUsage() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedView, setSelectedView] = useState("overview");

  // Mock energy usage data
  const todayUsage = [
    { time: "00:00", usage: 0.8, cost: 0.12 },
    { time: "03:00", usage: 0.6, cost: 0.09 },
    { time: "06:00", usage: 1.2, cost: 0.18 },
    { time: "09:00", usage: 2.1, cost: 0.32 },
    { time: "12:00", usage: 2.8, cost: 0.42 },
    { time: "15:00", usage: 3.2, cost: 0.48 },
    { time: "18:00", usage: 4.1, cost: 0.62 },
    { time: "21:00", usage: 3.5, cost: 0.53 },
    { time: "24:00", usage: 1.9, cost: 0.29 }
  ];

  const weeklyUsage = [
    { day: "Mon", usage: 18.5, cost: 2.78 },
    { day: "Tue", usage: 22.1, cost: 3.32 },
    { day: "Wed", usage: 19.8, cost: 2.97 },
    { day: "Thu", usage: 25.2, cost: 3.78 },
    { day: "Fri", usage: 23.6, cost: 3.54 },
    { day: "Sat", usage: 28.9, cost: 4.34 },
    { day: "Sun", usage: 26.3, cost: 3.95 }
  ];

  const monthlyUsage = [
    { month: "Jan", usage: 580, cost: 87.00 },
    { month: "Feb", usage: 520, cost: 78.00 },
    { month: "Mar", usage: 490, cost: 73.50 },
    { month: "Apr", usage: 450, cost: 67.50 },
    { month: "May", usage: 420, cost: 63.00 },
    { month: "Jun", usage: 380, cost: 57.00 }
  ];

  const deviceUsage = [
    { name: "HVAC System", usage: 45, cost: 6.75, color: "#3B82F6" },
    { name: "Water Heater", usage: 20, cost: 3.00, color: "#EF4444" },
    { name: "Lighting", usage: 12, cost: 1.80, color: "#F59E0B" },
    { name: "Electronics", usage: 15, cost: 2.25, color: "#10B981" },
    { name: "Appliances", usage: 8, cost: 1.20, color: "#8B5CF6" }
  ];

  const hourlyPattern = [
    { hour: "12 AM", weekday: 0.8, weekend: 1.2 },
    { hour: "3 AM", weekday: 0.6, weekend: 0.9 },
    { hour: "6 AM", weekday: 1.5, weekend: 1.1 },
    { hour: "9 AM", weekday: 2.1, weekend: 1.8 },
    { hour: "12 PM", weekday: 2.8, weekend: 2.5 },
    { hour: "3 PM", weekday: 3.2, weekend: 3.1 },
    { hour: "6 PM", weekday: 4.1, weekend: 3.8 },
    { hour: "9 PM", weekday: 3.5, weekend: 4.2 }
  ];

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "today":
        return { data: todayUsage, unit: "kWh", timeKey: "time" };
      case "week":
        return { data: weeklyUsage, unit: "kWh", timeKey: "day" };
      case "month":
        return { data: monthlyUsage, unit: "kWh", timeKey: "month" };
      default:
        return { data: todayUsage, unit: "kWh", timeKey: "time" };
    }
  };

  const { data, unit, timeKey } = getCurrentData();

  const totalUsage = data.reduce((sum, item) => sum + item.usage, 0);
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
  const averageUsage = totalUsage / data.length;

  const usageStats = {
    current: totalUsage,
    previous: selectedPeriod === "today" ? 16.8 : selectedPeriod === "week" ? 142.5 : 2890,
    target: selectedPeriod === "today" ? 20 : selectedPeriod === "week" ? 150 : 3000
  };

  const changePercent = ((usageStats.current - usageStats.previous) / usageStats.previous * 100);
  const targetProgress = (usageStats.current / usageStats.target * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Energy Usage
          </h1>
          <p className="text-muted-foreground mt-1">
            Detailed analysis of your energy consumption patterns
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant={selectedPeriod === "today" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("today")}
            className={selectedPeriod === "today" ? "bg-gradient-to-r from-indigo-600 to-purple-500" : ""}
          >
            <Clock className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button 
            variant={selectedPeriod === "week" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("week")}
            className={selectedPeriod === "week" ? "bg-gradient-to-r from-indigo-600 to-purple-500" : ""}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Week
          </Button>
          <Button 
            variant={selectedPeriod === "month" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("month")}
            className={selectedPeriod === "month" ? "bg-gradient-to-r from-indigo-600 to-purple-500" : ""}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Month
          </Button>
        </div>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-indigo-700 dark:text-indigo-300 flex items-center">
              <Zap className="mr-2 h-5 w-5 text-indigo-500" />
              Total Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              {totalUsage.toFixed(1)} {unit}
            </div>
            <div className="flex items-center mt-1">
              {changePercent >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-emerald-500 mr-1" />
              )}
              <span className={`text-xs ${changePercent >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {Math.abs(changePercent).toFixed(1)}% vs last {selectedPeriod}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-purple-700 dark:text-purple-300 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-purple-500" />
              Average Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {averageUsage.toFixed(1)} {unit}
            </div>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
              Per {selectedPeriod === "today" ? "hour" : selectedPeriod === "week" ? "day" : "month"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-emerald-700 dark:text-emerald-300 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              ${totalCost.toFixed(2)}
            </div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
              This {selectedPeriod}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-700 dark:text-amber-300 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-amber-500" />
              Target Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {targetProgress.toFixed(0)}%
            </div>
            <Progress value={targetProgress} className="mt-2 h-2" />
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
              of {usageStats.target} {unit} target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center">
            <PieChartIcon className="mr-2 h-4 w-4" />
            By Device
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-indigo-500" />
                  Usage Over Time
                </CardTitle>
                <CardDescription>
                  Energy consumption for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={timeKey} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`${value} kWh`, 'Usage']}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#6366F1" 
                      fill="url(#usageGradient)" 
                    />
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />
                  Cost Analysis
                </CardTitle>
                <CardDescription>
                  Energy costs for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={timeKey} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`$${value}`, 'Cost']}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5 text-purple-500" />
                  Usage by Device
                </CardTitle>
                <CardDescription>
                  Breakdown of energy consumption by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="usage"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} kWh`, 'Usage']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5 text-blue-500" />
                  Device Breakdown
                </CardTitle>
                <CardDescription>
                  Detailed usage and cost per device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceUsage.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: device.color }}
                        ></div>
                        <div>
                          <h4 className="font-medium text-sm">{device.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {device.usage} kWh • ${device.cost.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {((device.usage / totalUsage) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          of total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                Usage Patterns
              </CardTitle>
              <CardDescription>
                Compare weekday vs weekend energy consumption patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hourlyPattern}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="weekday" fill="#3B82F6" name="Weekday" />
                  <Bar dataKey="weekend" fill="#10B981" name="Weekend" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-rose-500" />
                Historical Comparison
              </CardTitle>
              <CardDescription>
                Compare current usage with previous periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="text-center p-4 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {usageStats.current.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Current {selectedPeriod}</div>
                </div>
                <div className="text-center p-4 rounded-md bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30">
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                    {usageStats.previous.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Previous {selectedPeriod}</div>
                </div>
                <div className="text-center p-4 rounded-md bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {usageStats.target.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Target</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">vs Previous Period</span>
                  <div className="flex items-center">
                    {changePercent >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-emerald-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${changePercent >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">vs Target</span>
                  <div className="flex items-center">
                    {targetProgress <= 100 ? (
                      <TrendingDown className="h-4 w-4 text-emerald-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${targetProgress <= 100 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {targetProgress <= 100 ? 'Under' : 'Over'} by {Math.abs(100 - targetProgress).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
