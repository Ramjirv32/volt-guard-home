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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  X,
  Check,
  Eye,
  EyeOff,
  Settings,
  Filter
} from "lucide-react";

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      title: "High Energy Consumption",
      message: "Your HVAC system is consuming 20% more energy than usual today.",
      timestamp: "2 minutes ago",
      read: false,
      category: "energy",
      device: "HVAC System"
    },
    {
      id: 2,
      type: "success",
      title: "Energy Goal Achieved",
      message: "You've successfully reduced energy consumption by 15% this week!",
      timestamp: "1 hour ago",
      read: false,
      category: "achievement",
      device: null
    },
    {
      id: 3,
      type: "error",
      title: "Device Offline",
      message: "Smart Thermostat has been offline for 30 minutes.",
      timestamp: "2 hours ago",
      read: true,
      category: "device",
      device: "Smart Thermostat"
    },
    {
      id: 4,
      type: "info",
      title: "Firmware Update Available",
      message: "Update available for your Energy Monitor. Install now for improved accuracy.",
      timestamp: "4 hours ago",
      read: true,
      category: "system",
      device: "Energy Monitor"
    },
    {
      id: 5,
      type: "warning",
      title: "Peak Hours Alert",
      message: "Entering peak energy hours (6-9 PM). Consider reducing usage to save costs.",
      timestamp: "6 hours ago",
      read: true,
      category: "energy",
      device: null
    },
    {
      id: 6,
      type: "security",
      title: "New Device Connected",
      message: "A new device 'Smart Coffee Maker' has been added to your network.",
      timestamp: "1 day ago",
      read: true,
      category: "security",
      device: "Smart Coffee Maker"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "security":
        return <Shield className="h-5 w-5 text-purple-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Success</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Error</Badge>;
      case "security":
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Security</Badge>;
      case "info":
      default:
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Info</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "energy":
        return "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20";
      case "device":
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20";
      case "security":
        return "border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20";
      case "achievement":
        return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20";
      case "system":
        return "border-l-slate-500 bg-slate-50/50 dark:bg-slate-950/20";
      default:
        return "border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (selectedTab === "all") return true;
    if (selectedTab === "unread") return !notif.read;
    return notif.category === selectedTab;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your energy system alerts and achievements
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            onClick={markAllAsRead}
            variant="outline"
            disabled={unreadCount === 0}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button className="bg-gradient-to-r from-violet-600 to-purple-500">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-violet-700 dark:text-violet-300 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-violet-500" />
              Total Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-700 dark:text-violet-300">
              {notifications.length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-700 dark:text-amber-300 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-500" />
              Unread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {unreadCount}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-emerald-700 dark:text-emerald-300 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {notifications.filter(n => n.category === "achievement").length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-red-700 dark:text-red-300 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {notifications.filter(n => n.type === "warning" || n.type === "error").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Tabs and List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Unread
          </TabsTrigger>
          <TabsTrigger value="energy" className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Energy
          </TabsTrigger>
          <TabsTrigger value="device" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="achievement" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Notifications</span>
                <Badge variant="secondary">{filteredNotifications.length} items</Badge>
              </CardTitle>
              <CardDescription>
                {selectedTab === "all" && "All your system notifications and updates"}
                {selectedTab === "unread" && "Notifications you haven't read yet"}
                {selectedTab === "energy" && "Energy consumption and efficiency alerts"}
                {selectedTab === "device" && "Device status and connectivity updates"}
                {selectedTab === "security" && "Security alerts and system access logs"}
                {selectedTab === "achievement" && "Your energy savings milestones and goals"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 ${getCategoryColor(notification.category)} ${
                        !notification.read ? "ring-1 ring-violet-200 dark:ring-violet-800" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <div className="flex items-center space-x-2">
                                {getNotificationBadge(notification.type)}
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{notification.timestamp}</span>
                                {notification.device && (
                                  <>
                                    <span>•</span>
                                    <span>{notification.device}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Read
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
