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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Wifi,
  Router,
  Smartphone,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Users,
  Activity,
  Bell,
  Fingerprint,
  Globe,
  Server,
  Database
} from "lucide-react";

export default function Security() {
  const [securityLevel, setSecurityLevel] = useState("High");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [networkMonitoring, setNetworkMonitoring] = useState(true);

  // Mock security data
  const securityStatus = {
    overallScore: 92,
    lastScan: "2 hours ago",
    threatsBlocked: 15,
    vulnerabilities: 1,
    connectedDevices: 8,
    suspiciousActivity: 0
  };

  const connectedDevices = [
    { id: 1, name: "Smart Thermostat", ip: "192.168.1.101", status: "secure", lastSeen: "Online", trust: "high" },
    { id: 2, name: "Security Camera 1", ip: "192.168.1.102", status: "secure", lastSeen: "Online", trust: "high" },
    { id: 3, name: "Smart Lock", ip: "192.168.1.103", status: "secure", lastSeen: "Online", trust: "high" },
    { id: 4, name: "WiFi Router", ip: "192.168.1.1", status: "secure", lastSeen: "Online", trust: "high" },
    { id: 5, name: "Smart TV", ip: "192.168.1.105", status: "warning", lastSeen: "Online", trust: "medium" },
    { id: 6, name: "Unknown Device", ip: "192.168.1.234", status: "danger", lastSeen: "5 min ago", trust: "low" },
    { id: 7, name: "Energy Monitor", ip: "192.168.1.106", status: "secure", lastSeen: "Online", trust: "high" },
    { id: 8, name: "Smart Lights Hub", ip: "192.168.1.107", status: "secure", lastSeen: "Online", trust: "high" }
  ];

  const securityLogs = [
    {
      id: 1,
      type: "info",
      event: "Device Connected",
      description: "Smart Thermostat connected to network",
      timestamp: "2024-01-15 14:30:25",
      severity: "low"
    },
    {
      id: 2,
      type: "warning",
      event: "Unusual Activity",
      description: "Multiple failed login attempts from Smart TV",
      timestamp: "2024-01-15 13:45:12",
      severity: "medium"
    },
    {
      id: 3,
      type: "error",
      event: "Unknown Device",
      description: "Unrecognized device attempting to connect",
      timestamp: "2024-01-15 12:20:45",
      severity: "high"
    },
    {
      id: 4,
      type: "success",
      event: "Security Update",
      description: "Firmware updated for Security Camera 1",
      timestamp: "2024-01-15 11:15:30",
      severity: "low"
    }
  ];

  const firewallRules = [
    { id: 1, rule: "Block external access to smart devices", status: "active", priority: "high" },
    { id: 2, rule: "Allow VPN connections only", status: "active", priority: "high" },
    { id: 3, rule: "Monitor unusual data transfers", status: "active", priority: "medium" },
    { id: 4, rule: "Block suspicious IP addresses", status: "active", priority: "high" },
    { id: 5, rule: "Restrict IoT device communications", status: "active", priority: "medium" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "secure":
        return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <ShieldAlert className="h-4 w-4 text-amber-500" />;
      case "danger":
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure":
        return "text-emerald-600 dark:text-emerald-400";
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      case "danger":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-slate-500";
    }
  };

  const getTrustBadge = (trust: string) => {
    switch (trust) {
      case "high":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Trusted</Badge>;
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Monitored</Badge>;
      case "low":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Untrusted</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "info":
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
            Security Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Protect your smart home with advanced security monitoring
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button className="bg-gradient-to-r from-red-600 to-pink-500">
            <Shield className="mr-2 h-4 w-4" />
            Run Security Scan
          </Button>
          
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-red-700 dark:text-red-300 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-500" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {securityStatus.overallScore}/100
            </div>
            <p className="text-xs text-red-600/80 dark:text-red-400/80">
              Last scan: {securityStatus.lastScan}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-orange-700 dark:text-orange-300 flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-orange-500" />
              Threats Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {securityStatus.threatsBlocked}
            </div>
            <p className="text-xs text-orange-600/80 dark:text-orange-400/80">
              This week
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-700 dark:text-amber-300 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {securityStatus.vulnerabilities}
            </div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
              Requires attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-violet-700 dark:text-violet-300 flex items-center">
              <Wifi className="mr-2 h-5 w-5 text-violet-500" />
              Connected Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-700 dark:text-violet-300">
              {securityStatus.connectedDevices}
            </div>
            <p className="text-xs text-violet-600/80 dark:text-violet-400/80">
              Active connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Features Toggle */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-red-500" />
            Security Features
          </CardTitle>
          <CardDescription>
            Configure your home security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-3">
                <Fingerprint className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Enhanced login security</p>
                </div>
              </div>
              <Button
                variant={twoFactorEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={twoFactorEnabled ? "bg-gradient-to-r from-emerald-600 to-green-500" : ""}
              >
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-purple-500" />
                <div>
                  <h4 className="font-medium">Auto-Lock</h4>
                  <p className="text-sm text-muted-foreground">Automatic system locking</p>
                </div>
              </div>
              <Button
                variant={autoLockEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoLockEnabled(!autoLockEnabled)}
                className={autoLockEnabled ? "bg-gradient-to-r from-purple-600 to-violet-500" : ""}
              >
                {autoLockEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-cyan-500" />
                <div>
                  <h4 className="font-medium">Network Monitoring</h4>
                  <p className="text-sm text-muted-foreground">Real-time traffic analysis</p>
                </div>
              </div>
              <Button
                variant={networkMonitoring ? "default" : "outline"}
                size="sm"
                onClick={() => setNetworkMonitoring(!networkMonitoring)}
                className={networkMonitoring ? "bg-gradient-to-r from-cyan-600 to-blue-500" : ""}
              >
                {networkMonitoring ? "Active" : "Inactive"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-red-500" />
                <div>
                  <h4 className="font-medium">Security Level</h4>
                  <p className="text-sm text-muted-foreground">Current protection level</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:bg-gradient-to-r dark:from-red-900 dark:to-pink-900 dark:text-red-300">
                {securityLevel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Security Information */}
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices" className="flex items-center">
            <Router className="mr-2 h-4 w-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="firewall" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Firewall
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Security Logs
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center">
            <Key className="mr-2 h-4 w-4" />
            Access Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5 text-blue-500" />
                Connected Devices
              </CardTitle>
              <CardDescription>
                Monitor and manage all devices connected to your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connectedDevices.map(device => (
                  <div key={device.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(device.status)}
                      <div>
                        <h4 className="font-medium text-sm">{device.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {device.ip} • {device.lastSeen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getTrustBadge(device.trust)}
                      <Badge variant={device.status === "secure" ? "default" : device.status === "warning" ? "secondary" : "destructive"}>
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-500" />
                Firewall Rules
              </CardTitle>
              <CardDescription>
                Active security rules protecting your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {firewallRules.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <div>
                        <h4 className="font-medium text-sm">{rule.rule}</h4>
                        <p className="text-xs text-muted-foreground">
                          Priority: {rule.priority}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      {rule.status}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4 bg-gradient-to-r from-red-600 to-pink-500">
                <Settings className="mr-2 h-4 w-4" />
                Configure Firewall
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-purple-500" />
                Security Event Logs
              </CardTitle>
              <CardDescription>
                Recent security events and system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityLogs.map(log => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 rounded-md border">
                    {getLogIcon(log.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{log.event}</h4>
                        <Badge variant={log.severity === "high" ? "destructive" : log.severity === "medium" ? "secondary" : "default"}>
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View All Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5 text-amber-500" />
                Access Control
              </CardTitle>
              <CardDescription>
                Manage user access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="admin-pass">Admin Password</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input id="admin-pass" type="password" placeholder="Enter current password" className="flex-1" />
                    <Button variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="guest-access">Guest Network Access</Label>
                  <div className="flex items-center justify-between mt-2 p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium text-sm">Guest WiFi</h4>
                      <p className="text-xs text-muted-foreground">Allow temporary access for visitors</p>
                    </div>
                    <Button variant="outline">
                      <Wifi className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Remote Access</Label>
                  <div className="flex items-center justify-between mt-2 p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium text-sm">VPN Access</h4>
                      <p className="text-xs text-muted-foreground">Secure remote connection to your home network</p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500">
                      <Globe className="mr-2 h-4 w-4" />
                      Setup VPN
                    </Button>
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
