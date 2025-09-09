"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { logout } from "@/store/slices/authSlice"
import { toggleTheme } from "@/store/slices/settingsSlice"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  BarChart3,
  LayoutDashboard,
  LineChart,
  PlugZap,
  BatteryCharging,
  Shield,
  Activity,
  Sparkles,
  MoreHorizontal
} from "lucide-react"

export function BottomBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { unreadCount } = useSelector((state: RootState) => state.notifications)
  const { theme } = useSelector((state: RootState) => state.settings)

  // Main navigation items for bottom bar (limited to most important)
  const bottomNavItems = [
    { path: "/dashboard", label: "Home", icon: LayoutDashboard },
    { path: "/energy-usage", label: "Usage", icon: BatteryCharging },
    { path: "/analytics", label: "Analytics", icon: LineChart },
    { path: "/smart-devices", label: "Devices", icon: PlugZap },
    { path: "/assistant", label: "Assistant", icon: MessageCircle },
  ]

  // Additional items for the "More" menu
  const moreItems = [
    { path: "/energy-savings", label: "Energy Savings", icon: Sparkles },
    { path: "/monitoring", label: "Monitoring", icon: Activity },
    { path: "/security", label: "Security", icon: Shield },
    { path: "/settings", label: "Settings", icon: Settings },
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

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Top Header for branding and notifications */}
      <div className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* VoltGuard Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500">
                <BatteryCharging className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                VoltGuard
              </span>
            </Link>
            
            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-emerald-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => dispatch(toggleTheme())}>
                    {getThemeIcon()}
                    <span className="ml-2">Toggle Theme</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t">
        <div className="grid grid-cols-6 h-16">
          {/* Main Navigation Items */}
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 px-2 py-2 transition-all duration-200",
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-1 rounded-lg transition-all duration-200",
                  active && "bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium truncate max-w-full">
                  {item.label}
                </span>
              </Link>
            )
          })}
          
          {/* More Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center space-y-1 h-full w-full rounded-none text-muted-foreground hover:text-foreground"
              >
                <div className="p-1 rounded-lg">
                  <MoreHorizontal className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mb-2">
              <DropdownMenuLabel>More Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {moreItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                
                return (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center w-full",
                        active && "bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}
