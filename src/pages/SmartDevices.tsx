import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Laptop, 
  Lightbulb, 
  Plus, 
  RefreshCw, 
  Settings, 
  Thermometer, 
  Timer, 
  Tv, 
  Wifi, 
  Home, 
  PlusCircle,
  Search,
  PlugZap,
  AlertTriangle,
  Zap,
  Clock,
  LayoutGrid,
  ListFilter,
  LampFloor,
  Refrigerator,
  Coffee,

} from "lucide-react";

export default function SmartDevices() {
  const dispatch = useDispatch<AppDispatch>();
  const { devices } = useSelector((state: RootState) => state.devices);
  const [view, setView] = useState("grid");
  const [roomFilter, setRoomFilter] = useState("all");
  const [isAddingDevice, setIsAddingDevice] = useState(false);

  // Mock rooms data
  const rooms = [
    { id: "living", name: "Living Room", devices: 5 },
    { id: "kitchen", name: "Kitchen", devices: 4 },
    { id: "bedroom", name: "Bedroom", devices: 3 },
    { id: "bathroom", name: "Bathroom", devices: 2 },
    { id: "office", name: "Home Office", devices: 3 },
  ];

  // Mock devices data
  const mockDevices = [
    { 
      id: '1', 
      name: 'Living Room Light', 
      type: 'light', 
      status: 'on', 
      location: 'Living Room', 
      powerUsage: 12, 
      automationEnabled: true,
      icon: Lightbulb,
      color: "#f59e0b"
    },
    { 
      id: '2', 
      name: 'Kitchen Light', 
      type: 'light', 
      status: 'off', 
      location: 'Kitchen', 
      powerUsage: 0, 
      automationEnabled: true,
      icon: Lightbulb,
      color: "#f59e0b"
    },
    { 
      id: '3', 
      name: 'Smart TV', 
      type: 'entertainment', 
      status: 'on', 
      location: 'Living Room', 
      powerUsage: 120, 
      automationEnabled: false,
      icon: Tv,
      color: "#3b82f6"
    },
    { 
      id: '4', 
      name: 'Temperature Sensor', 
      type: 'sensor', 
      status: 'on', 
      location: 'Bedroom', 
      powerUsage: 2, 
      automationEnabled: true,
      icon: Thermometer,
      color: "#10b981"
    },
    { 
      id: '5', 
      name: 'WiFi Router', 
      type: 'network', 
      status: 'on', 
      location: 'Office', 
      powerUsage: 8, 
      automationEnabled: false,
      icon: Wifi,
      color: "#6366f1"
    },
    { 
      id: '6', 
      name: 'Smart Thermostat', 
      type: 'climate', 
      status: 'on', 
      location: 'Living Room', 
      powerUsage: 5, 
      automationEnabled: true,
      icon: Thermometer,
      color: "#10b981"
    },
    { 
      id: '7', 
      name: 'Office Computer', 
      type: 'computer', 
      status: 'off', 
      location: 'Office', 
      powerUsage: 0, 
      automationEnabled: false,
      icon: Laptop,
      color: "#8b5cf6"
    },
    { 
      id: '8', 
      name: 'Bedroom Lamp', 
      type: 'light', 
      status: 'off', 
      location: 'Bedroom', 
      powerUsage: 0, 
      automationEnabled: true,
      icon: LampFloor,
      color: "#f59e0b"
    },
    { 
      id: '9', 
      name: 'Refrigerator', 
      type: 'appliance', 
      status: 'on', 
      location: 'Kitchen', 
      powerUsage: 150, 
      automationEnabled: false,
      icon: Refrigerator,
      color: "#ec4899"
    },
    { 
      id: '10', 
      name: 'Coffee Maker', 
      type: 'appliance', 
      status: 'off', 
      location: 'Kitchen', 
      powerUsage: 0, 
      automationEnabled: true,
      icon: Coffee,
      color: "#ec4899"
    },
    { 
      id: '11', 
      name: 'Air Conditioner', 
      type: 'climate', 
      status: 'on', 
      location: 'Bedroom', 
      powerUsage: 900, 
      automationEnabled: true,
        icon: PlugZap,
      color: "#0ea5e9"
    },
  ];

  // Filter devices based on room selection
  const filteredDevices = roomFilter === "all" 
    ? mockDevices 
    : mockDevices.filter(device => {
        const roomName = rooms.find(r => r.id === roomFilter)?.name;
        return device.location === roomName;
      });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Smart Devices
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and control your connected devices
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search devices..." 
              className="w-[200px] pl-8" 
            />
          </div>
          
          <Button variant="outline" size="icon" onClick={() => setView(view === "grid" ? "list" : "grid")}>
            {view === "grid" ? (
              <ListFilter className="h-4 w-4 text-amber-500" />
            ) : (
              <LayoutGrid className="h-4 w-4 text-amber-500" />
            )}
          </Button>
          
          <Button onClick={() => setIsAddingDevice(true)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Room sidebar */}
        <div className="md:col-span-3 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Rooms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0">
              <Button 
                variant={roomFilter === "all" ? "default" : "ghost"} 
                className={`w-full justify-start rounded-none ${roomFilter === "all" ? "bg-gradient-to-r from-amber-500 to-orange-600" : ""}`}
                onClick={() => setRoomFilter("all")}
              >
                <Home className="mr-2 h-4 w-4" />
                All Rooms
                <Badge variant="outline" className="ml-auto">{mockDevices.length}</Badge>
              </Button>
              
              {rooms.map(room => (
                <Button 
                  key={room.id}
                  variant={roomFilter === room.id ? "default" : "ghost"} 
                  className={`w-full justify-start rounded-none ${roomFilter === room.id ? "bg-gradient-to-r from-amber-500 to-orange-600" : ""}`}
                  onClick={() => setRoomFilter(room.id)}
                >
                  <Home className="mr-2 h-4 w-4" />
                  {room.name}
                  <Badge variant="outline" className="ml-auto">{room.devices}</Badge>
                </Button>
              ))}
            </CardContent>
            <CardFooter className="pt-3">
              <Button variant="outline" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Room
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Active Devices</span>
                </div>
                <span className="font-medium">{mockDevices.filter(d => d.status === "on").length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Inactive Devices</span>
                </div>
                <span className="font-medium">{mockDevices.filter(d => d.status === "off").length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm">Automated Devices</span>
                </div>
                <span className="font-medium">{mockDevices.filter(d => d.automationEnabled).length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm">Current Usage</span>
                </div>
                <span className="font-medium">
                  {mockDevices.reduce((sum, device) => sum + device.powerUsage, 0) / 1000} kW
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Devices grid/list */}
        <div className="md:col-span-9 lg:col-span-10">
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDevices.map(device => {
                const DeviceIcon = device.icon;
                return (
                  <Card key={device.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-3 items-center">
                          <div className={`p-2 rounded-full bg-${device.color.replace('#', '')}/10`}>
                            <DeviceIcon className="h-5 w-5" style={{ color: device.color }} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{device.name}</CardTitle>
                            <CardDescription className="text-xs">{device.location}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={device.status === "on" ? "default" : "outline"}>
                          {device.status === "on" ? "ON" : "OFF"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Power Usage</span>
                          <span className="font-medium">{device.powerUsage} W</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Auto Schedule</span>
                          </div>
                          <Switch checked={device.automationEnabled} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex space-x-2 pt-0">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3.5 w-3.5 mr-1.5" />
                        Settings
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        variant={device.status === "on" ? "destructive" : "default"}
                      >
                        {device.status === "on" ? "Turn Off" : "Turn On"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
              
              <Card className="border-dashed flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Add New Device</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Connect a new smart device to your VoltGuard network
                </p>
                <Button onClick={() => setIsAddingDevice(true)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  Add Device
                </Button>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
                <CardDescription>
                  Manage all your smart devices from one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredDevices.map(device => {
                    const DeviceIcon = device.icon;
                    return (
                      <div key={device.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full bg-${device.color.replace('#', '')}/10`}>
                            <DeviceIcon className="h-5 w-5" style={{ color: device.color }} />
                          </div>
                          <div>
                            <h4 className="font-medium">{device.name}</h4>
                            <p className="text-sm text-muted-foreground">{device.location} • {device.powerUsage} W</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={device.status === "on" ? "default" : "outline"}>
                            {device.status === "on" ? "ON" : "OFF"}
                          </Badge>
                          <Switch checked={device.status === "on"} />
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Add device dialog */}
      <Dialog open={isAddingDevice} onOpenChange={setIsAddingDevice}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Connect a new smart device to your VoltGuard network.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input id="device-name" placeholder="Enter device name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-type">Device Type</Label>
              <select id="device-type" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option>Light</option>
                <option>Sensor</option>
                <option>Appliance</option>
                <option>Entertainment</option>
                <option>Climate Control</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-location">Location</Label>
              <select id="device-location" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                {rooms.map(room => (
                  <option key={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingDevice(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              Add Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}