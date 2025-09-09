"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { logout } from "@/store/slices/authSlice"
import { toggleTheme } from "@/store/slices/settingsSlice"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Settings,
  Bell,
  Menu,
  LogOut,
  User,
  Sun,
  Moon,
  Zap,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  LayoutDashboard,
  Trophy,
  AlertCircle,
  HelpCircle,
  LineChart,
  PlugZap,
  Battery,
  BatteryCharging,
  Lightbulb,
  Shield,
  Activity,
  Sparkles,
} from "lucide-react"

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { unreadCount } = useSelector((state: RootState) => state.notifications)
  const { theme } = useSelector((state: RootState) => state.settings)
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Main navigation items - updated for VoltGuard focus on energy management
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Energy Overview" },
    { path: "/energy-usage", label: "Energy Usage", icon: BatteryCharging, description: "Consumption Tracking" },
    { path: "/analytics", label: "Analytics", icon: LineChart, description: "Energy Insights" },
    { path: "/smart-devices", label: "Smart Devices", icon: PlugZap, description: "Connected Devices" },
    { path: "/savings", label: "Energy Savings", icon: Sparkles, description: "Cost Optimization" },
    { path: "/monitoring", label: "Monitoring", icon: Activity, description: "Real-time Monitoring" },
    { path: "/security", label: "Security", icon: Shield, description: "Device Security" },
    { path: "/assistant", label: "AI Assistant", icon: MessageCircle, description: "Energy Saving Tips" },
    { path: "/notifications", label: "Alerts", icon: Bell, description: "System Alerts" },
    { path: "/settings", label: "Settings", icon: Settings, description: "System Settings" },
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Moon className="h-4 w-4" />
      case "dark":
        return <Sun className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }
  
  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo - Updated with stronger VoltGuard branding */}
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500">
                  <BatteryCharging className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">VoltGuard</span>
              </Link>
              
              {/* Right Section */}
              <div className="flex items-center space-x-2">
                {/* Notifications with energy-themed styling */}
                <Link to="/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-emerald-500">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                
                {/* Mobile Menu Trigger */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <div className="flex flex-col h-full">
                      {/* User Profile Section with energy efficiency status */}
                      <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-2 ring-emerald-500">
                            <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">{user?.displayName?.[0] || user?.email?.[0] || "V"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.displayName || "Energy Saver"}</p>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>
                              <p className="text-xs text-muted-foreground">Energy Efficient</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Navigation Items with energy-themed styling */}
                      <nav className="flex-1 overflow-y-auto py-4">
                        <div className="space-y-1 px-2">
                          {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium",
                                  location.pathname === item.path
                                    ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                                    : "hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <span>{item.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      </nav>
                      
                      {/* Footer Actions */}
                      <div className="border-t p-3 space-y-2">
                        <Button variant="outline" className="w-full justify-start" onClick={() => dispatch(toggleTheme())}>
                          {getThemeIcon()}
                          <span className="ml-2">Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-500" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  
  // Desktop sidebar
  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 z-40 flex flex-col border-r bg-card/95 transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[280px]"
    )}>
      {/* Logo section - enhanced for VoltGuard */}
      <div className="flex h-16 items-center px-4 border-b">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 flex-shrink-0">
            <BatteryCharging className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">VoltGuard</span>
          )}
        </Link>
      </div>
      
      {/* User profile section with energy metrics */}
      {!collapsed && (
        <div className="px-4 py-3 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-2 ring-emerald-500/70">
              <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">{user?.displayName?.[0] || user?.email?.[0] || "V"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName || "Energy Saver"}</p>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>
                <p className="text-xs text-muted-foreground">Energy Efficient</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation section with energy-focused styling */}
      <div className="flex-1 overflow-y-auto py-2">
        <TooltipProvider delayDuration={0}>
          <nav className={cn("space-y-0.5", collapsed ? "px-2" : "px-3")}>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path;
              
              return collapsed ? (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                    <p className="text-xs font-normal opacity-75">{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 mr-3" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      {item.label === "Alerts" && unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5 py-0 bg-emerald-500 text-white">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              )
            })}
          </nav>
        </TooltipProvider>
      </div>
      
      {/* Footer section with energy metrics */}
      <div className="border-t p-3">
        {/* User profile with energy saving status */}
        <div className={cn(
          "mb-3 flex",
          collapsed ? "justify-center" : "items-center space-x-3"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1 h-auto w-auto">
                <Avatar className={collapsed ? "h-8 w-8 ring-1 ring-emerald-500" : "h-8 w-8 ring-1 ring-emerald-500"}>
                  <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">{user?.displayName?.[0] || user?.email?.[0] || "V"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || "Energy Saver"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Energy Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName || "Energy Saver"}</p>
              <p className="text-xs text-muted-foreground truncate">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 align-middle"></span>
                Saving Energy
              </p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => dispatch(toggleTheme())}>
                    {getThemeIcon()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Toggle theme
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button variant="outline" className="w-full justify-start" onClick={() => dispatch(toggleTheme())}>
              {getThemeIcon()}
              <span className="ml-2">Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            </Button>
          )}
          
          {/* Collapse toggle */}
          <Button
            variant="outline"
            className={cn(collapsed ? "w-full" : "w-full justify-between")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <span>Collapse</span>
                <ChevronLeft className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
