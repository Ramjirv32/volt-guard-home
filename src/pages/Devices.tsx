import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDevices, toggleDevice } from "@/store/slices/devicesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Thermometer, Plug, Radio, Camera, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

const deviceIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  plug: Plug,
  sensor: Radio,
  camera: Camera,
  lock: Lock
};

const Devices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { devices, loading } = useSelector((state: RootState) => state.devices);
  const [filteredDevices, setFilteredDevices] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredDevices(devices);
    } else {
      setFilteredDevices(devices.filter(device => device.type === filter));
    }
  }, [devices, filter]);

  const handleToggle = (deviceId: string) => {
    dispatch(toggleDevice(deviceId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on":
        return "bg-energy-active text-white";
      case "idle":
        return "bg-energy-idle text-white";
      case "off":
        return "bg-energy-offline text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Device Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Control and monitor all your smart devices
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
            size="sm"
          >
            All Devices
          </Button>
          <Button 
            variant={filter === "light" ? "default" : "outline"} 
            onClick={() => setFilter("light")}
            size="sm"
          >
            <Lightbulb className="mr-1 h-4 w-4" /> Lights
          </Button>
          <Button 
            variant={filter === "plug" ? "default" : "outline"} 
            onClick={() => setFilter("plug")}
            size="sm"
          >
            <Plug className="mr-1 h-4 w-4" /> Plugs
          </Button>
          <Button 
            variant={filter === "thermostat" ? "default" : "outline"} 
            onClick={() => setFilter("thermostat")}
            size="sm"
          >
            <Thermometer className="mr-1 h-4 w-4" /> Thermostats
          </Button>
          <Button 
            variant={filter === "sensor" ? "default" : "outline"} 
            onClick={() => setFilter("sensor")}
            size="sm"
          >
            <Radio className="mr-1 h-4 w-4" /> Sensors
          </Button>
          <Button 
            variant={filter === "camera" ? "default" : "outline"} 
            onClick={() => setFilter("camera")}
            size="sm"
          >
            <Camera className="mr-1 h-4 w-4" /> Cameras
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredDevices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <p className="text-lg font-medium mb-2">No devices found</p>
                <p>No devices match your selected filter</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDevices.map(device => {
              const Icon = deviceIcons[device.type as keyof typeof deviceIcons];
              return (
                <Card key={device.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className={cn(
                          "p-2 rounded-lg mr-3",
                          device.status === "on" ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            device.status === "on" ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{device.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{device.location}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={cn("text-xs", getStatusColor(device.status))}>
                          {device.status.toUpperCase()}
                        </Badge>
                        {device.automationEnabled && (
                          <Badge variant="outline" className="text-xs">
                            Auto
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Separator className="my-3" />
                    <div className="space-y-4 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Power</span>
                        <span className="text-sm">{device.powerUsage} W</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Active</span>
                        <span className="text-sm">
                          {new Date(device.lastActive).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-medium">Control</span>
                        <Switch
                          checked={device.status === "on"}
                          onCheckedChange={() => handleToggle(device.id)}
                          disabled={device.type === "camera" || device.type === "sensor"}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Devices;
