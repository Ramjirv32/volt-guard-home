import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart3, PieChart, TrendingDown, TrendingUp, Zap, Calendar, Download, Share2, Filter } from "lucide-react";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("last7days");
  const [dataView, setDataView] = useState("consumption");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Energy Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your energy consumption patterns
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="last3months">Last 3 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4 text-purple-500" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4 text-indigo-500" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="consumption" className="mb-8" onValueChange={setDataView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consumption" className="data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-500 data-[state=active]:text-white">
            <Zap className="mr-2 h-4 w-4" />
            Consumption
          </TabsTrigger>
          <TabsTrigger value="cost" className="data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-500 data-[state=active]:text-white">
            <BarChart3 className="mr-2 h-4 w-4" />
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-500 data-[state=active]:text-white">
            <TrendingUp className="mr-2 h-4 w-4" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-gradient-to-r from-indigo-600 to-purple-500 data-[state=active]:text-white">
            <PieChart className="mr-2 h-4 w-4" />
            By Device
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="consumption" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Total Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">426 kWh</div>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500">8.2% less than previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Daily Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">14.2 kWh</div>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500">3.5% less than previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Peak Usage Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">Monday, Sep 5</div>
                <p className="text-sm text-muted-foreground">21.3 kWh consumed</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Consumption Trend</CardTitle>
                  <CardDescription>Daily energy usage over time</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {/* This would be a real chart component in your actual implementation */}
                <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-md border border-border flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 mx-auto text-indigo-500 opacity-50" />
                    <p className="text-muted-foreground mt-2">Energy consumption visualization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Patterns</CardTitle>
                <CardDescription>Hourly consumption averages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {/* This would be a real chart component in your actual implementation */}
                  <div className="h-full w-full bg-gradient-to-br from-fuchsia-50 to-indigo-50 dark:from-fuchsia-950/20 dark:to-indigo-950/20 rounded-md border border-border flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-purple-500 opacity-50" />
                      <p className="text-muted-foreground mt-2">Hourly usage patterns</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Energy Insights</CardTitle>
                <CardDescription>Key observations from your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40 border border-indigo-200 dark:border-indigo-800">
                    <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">High Consumption Alert</h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Your energy use was 32% higher between 6-8 PM compared to your average. Consider shifting usage to off-peak hours.</p>
                  </div>
                  
                  <div className="p-4 rounded-md bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 border border-emerald-200 dark:border-emerald-800">
                    <h3 className="font-medium text-emerald-700 dark:text-emerald-300 mb-1">Energy Saving Opportunity</h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Reducing your HVAC usage by 1 hour each day could save approximately 45 kWh per month.</p>
                  </div>
                  
                  <div className="p-4 rounded-md bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 border border-purple-200 dark:border-purple-800">
                    <h3 className="font-medium text-purple-700 dark:text-purple-300 mb-1">Weather Impact</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Energy consumption increased by 18% during the recent temperature drop. Consider improving insulation.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cost" className="mt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cost Analysis content would appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Comparison content would appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="mt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Device breakdown content would appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}