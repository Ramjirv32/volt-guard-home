import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDevices, addDevice, deleteDevice, toggleDevice } from "@/store/slices/devicesSlice";
import { Navbar } from "@/components/Layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Settings, Lightbulb, Thermometer, Plug, Camera, Lock, Radio, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const deviceIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  plug: Plug,
  camera: Camera,
  lock: Lock,
  sensor: Radio,
};

export default function Devices() {
  const dispatch = useDispatch<AppDispatch>();
  const { devices, loading } = useSelector((state: RootState) => state.devices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "light" as const,
    location: "",
    sensorId: "",
  });

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    await dispatch(addDevice({
      ...newDevice,
      status: "off",
      powerUsage: 0,
      automationEnabled: false,
      lastActive: new Date().toISOString(),
    }));

    setIsAddDialogOpen(false);
    setNewDevice({ name: "", type: "light", location: "", sensorId: "" });
  };

  const handleToggle = (deviceId: string) => {
    dispatch(toggleDevice(deviceId));
  };

  const handleDelete = (deviceId: string) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      dispatch(deleteDevice(deviceId));
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      on: "bg-energy-active text-white",
      idle: "bg-energy-idle text-white",
      off: "bg-muted text-muted-foreground",
    };
    return colors[status as keyof typeof colors] || colors.off;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Device Management</h1>
            <p className="text-muted-foreground mt-1">
              Control and configure your smart home devices
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogDescription>
                  Connect a new smart device to your home network
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Living Room Light"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Device Type</Label>
                  <Select
                    value={newDevice.type}
                    onValueChange={(value) => setNewDevice({ ...newDevice, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="thermostat">Thermostat</SelectItem>
                      <SelectItem value="plug">Smart Plug</SelectItem>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="lock">Smart Lock</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Living Room"
                    value={newDevice.location}
                    onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sensorId">Sensor ID (Optional)</Label>
                  <Input
                    id="sensorId"
                    placeholder="e.g., PZEM-004T-01"
                    value={newDevice.sensorId}
                    onChange={(e) => setNewDevice({ ...newDevice, sensorId: e.target.value })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDevice} className="bg-gradient-primary hover:opacity-90">
                  Add Device
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Device Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Devices</CardTitle>
            <CardDescription>
              Manage your connected smart home devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Power Usage</TableHead>
                  <TableHead>Automation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No devices connected. Add your first device to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((device) => {
                    const Icon = deviceIcons[device.type];
                    return (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              device.status === "on" ? "bg-primary/10" : "bg-muted"
                            )}>
                              <Icon className={cn(
                                "h-4 w-4",
                                device.status === "on" ? "text-primary" : "text-muted-foreground"
                              )} />
                            </div>
                            <div>
                              <p className="font-medium">{device.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{device.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{device.location}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(device.status)}>
                            {device.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{device.powerUsage}W</TableCell>
                        <TableCell>
                          <Switch
                            checked={device.automationEnabled}
                            disabled
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggle(device.id)}
                              disabled={device.type === "camera" || device.type === "sensor"}
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(device.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Automation Rules</CardTitle>
            <CardDescription>
              Set up automatic actions based on device behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-OFF when idle</p>
                  <p className="text-sm text-muted-foreground">
                    Turn off devices automatically after 10 minutes of inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Away mode</p>
                  <p className="text-sm text-muted-foreground">
                    Turn off all non-essential devices when nobody is home
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Energy saving mode</p>
                  <p className="text-sm text-muted-foreground">
                    Optimize device usage to minimize energy consumption
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}