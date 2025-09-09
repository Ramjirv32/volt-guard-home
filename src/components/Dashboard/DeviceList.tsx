import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { toggleDevice } from "@/store/slices/devicesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Thermometer, Plug, Camera, Lock, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const deviceIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  plug: Plug,
  camera: Camera,
  lock: Lock,
  sensor: Radio,
};

export function DeviceList() {
  const dispatch = useDispatch<AppDispatch>();
  const { devices } = useSelector((state: RootState) => state.devices);
  
  // Mock devices if none exist
  const displayDevices = devices.length > 0 ? devices : [
    { id: "1", name: "Living Room Light", type: "light" as const, status: "on" as const, powerUsage: 60, location: "Living Room", automationEnabled: true, lastActive: new Date().toISOString() },
    { id: "2", name: "Smart Thermostat", type: "thermostat" as const, status: "on" as const, powerUsage: 500, location: "Hallway", automationEnabled: true, lastActive: new Date().toISOString() },
    { id: "3", name: "Security Camera", type: "camera" as const, status: "idle" as const, powerUsage: 10, location: "Front Door", automationEnabled: false, lastActive: new Date().toISOString() },
    { id: "4", name: "Smart Lock", type: "lock" as const, status: "off" as const, powerUsage: 5, location: "Front Door", automationEnabled: true, lastActive: new Date().toISOString() },
  ];

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
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {displayDevices.map((device) => {
              const Icon = deviceIcons[device.type];
              return (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      device.status === "on" ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        device.status === "on" ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">{device.location}</span>
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
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">{device.powerUsage}W</span>
                    <Switch
                      checked={device.status === "on"}
                      onCheckedChange={() => handleToggle(device.id)}
                      disabled={device.type === "camera" || device.type === "sensor"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}