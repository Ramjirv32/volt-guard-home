import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import api from "@/config/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ServiceStatus {
  name: string;
  status: "online" | "offline" | "degraded" | "checking";
  latency?: number;
  lastChecked: Date;
}

const StatusCheck = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "API Server", status: "checking", lastChecked: new Date() },
    { name: "Authentication", status: "checking", lastChecked: new Date() },
    { name: "Database", status: "checking", lastChecked: new Date() },
    { name: "IoT Gateway", status: "checking", lastChecked: new Date() },
    { name: "Notification Service", status: "checking", lastChecked: new Date() },
  ]);
  const [isChecking, setIsChecking] = useState(false);

  const checkServices = async () => {
    setIsChecking(true);
    
    // Update all services to checking
    setServices(prev => prev.map(service => ({
      ...service,
      status: "checking",
      lastChecked: new Date()
    })));
    
    try {
      // Check API Server
      let newServices = [...services];
      
      try {
        const startTime = Date.now();
        const response = await api.get('/api/health');
        const latency = Date.now() - startTime;
        
        newServices[0] = {
          ...newServices[0],
          status: "online",
          latency,
          lastChecked: new Date()
        };
        
        // Check Database status from health response
        newServices[2] = {
          ...newServices[2],
          status: response.data.database === 'Connected' ? "online" : "offline",
          lastChecked: new Date()
        };
      } catch (error) {
        newServices[0] = {
          ...newServices[0],
          status: "offline",
          lastChecked: new Date()
        };
        newServices[2] = {
          ...newServices[2],
          status: "offline",
          lastChecked: new Date()
        };
      }
      
      // For demo purposes, we'll simulate other service checks
      // Authentication Service
      await new Promise(resolve => setTimeout(resolve, 500));
      newServices[1] = {
        ...newServices[1],
        status: Math.random() > 0.1 ? "online" : "offline",
        latency: Math.floor(Math.random() * 100) + 50,
        lastChecked: new Date()
      };
      
      // IoT Gateway
      await new Promise(resolve => setTimeout(resolve, 700));
      newServices[3] = {
        ...newServices[3],
        status: Math.random() > 0.2 ? "online" : Math.random() > 0.5 ? "offline" : "degraded",
        latency: Math.floor(Math.random() * 200) + 100,
        lastChecked: new Date()
      };
      
      // Notification Service
      await new Promise(resolve => setTimeout(resolve, 600));
      newServices[4] = {
        ...newServices[4],
        status: Math.random() > 0.1 ? "online" : "degraded",
        latency: Math.floor(Math.random() * 150) + 30,
        lastChecked: new Date()
      };
      
      setServices(newServices);
    } catch (error) {
      console.error('Error checking services:', error);
      // In case of overall failure, mark all as offline
      setServices(prev => prev.map(service => ({
        ...service,
        status: "offline",
        lastChecked: new Date()
      })));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkServices();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "offline":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "checking":
        return <LoadingSpinner className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>;
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case "checking":
        return <Badge variant="outline">Checking...</Badge>;
      default:
        return null;
    }
  };

  const allServicesOperational = services.every(s => s.status === "online");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            System Status
          </h1>
          <p className="text-muted-foreground mt-1">
            Check the operational status of all services
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>System Overview</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={checkServices}
                disabled={isChecking}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between py-4">
              <div className="flex items-center mb-4 sm:mb-0">
                {allServicesOperational ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
                )}
                <span className="text-lg font-medium">
                  {allServicesOperational 
                    ? "All systems operational" 
                    : "Some systems experiencing issues"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last checked: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-l-4 border-transparent hover:bg-accent/50 transition-colors"
                     style={{
                       borderLeftColor: 
                         service.status === "online" ? "hsl(var(--success))" :
                         service.status === "offline" ? "hsl(var(--destructive))" :
                         service.status === "degraded" ? "hsl(var(--warning))" : "transparent"
                     }}
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      {getStatusIcon(service.status)}
                    </div>
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        Last checked: {service.lastChecked.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {service.latency && service.status !== "checking" && (
                      <span className="text-sm font-medium">
                        {service.latency}ms
                      </span>
                    )}
                    {getStatusBadge(service.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StatusCheck;
