import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  status?: "active" | "idle" | "offline";
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  status,
  trend,
  trendValue,
}: StatsCardProps) {
  const statusColors = {
    active: "bg-energy-active",
    idle: "bg-energy-idle",
    offline: "bg-energy-offline",
  };

  const trendColors = {
    up: "text-destructive",
    down: "text-energy-active",
    stable: "text-muted-foreground",
  };

  return (
    <Card className="relative overflow-hidden card-hover">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full -mr-16 -mt-16" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          {status && (
            <Badge className={cn("h-2 w-2 p-0 rounded-full", statusColors[status], "energy-pulse")} />
          )}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && trendValue && (
          <div className={cn("text-xs mt-2", trendColors[trend])}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "stable" && "→"}
            {" "}
            {trendValue} from last hour
          </div>
        )}
      </CardContent>
    </Card>
  );
}
