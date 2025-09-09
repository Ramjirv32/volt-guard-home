import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, 
  Lightbulb, 
  Sparkles, 
  Award, 
  Zap, 
  Target, 
  ChevronRight, 
  ThumbsUp, 
  Plus,
  DollarSign,
  Timer,
  PiggyBank,
  LineChart,
  CheckCircle2,
  ArrowUpRight,
  BadgeCheck,
  Leaf
} from "lucide-react";

export default function EnergySavings() {
  const [activeTab, setActiveTab] = useState("goals");

  // Mock savings data
  const savingsData = {
    monthlySavings: 42.50,
    yearToDateSavings: 387.25,
    projectedAnnualSavings: 510.80,
    carbonReduction: 324.5,
    currentEfficiencyScore: 82,
    completedChallenges: 7,
    totalChallenges: 12
  };

  // Mock savings goals
  const savingsGoals = [
    { 
      id: 1, 
      name: "Reduce Peak Usage", 
      description: "Lower energy consumption during peak hours by 15%", 
      progress: 65, 
      target: "15% reduction", 
      reward: "$25 bill credit",
      icon: TrendingDown,
      color: "emerald"
    },
    { 
      id: 2, 
      name: "Smart Lighting Transition", 
      description: "Replace 90% of home lighting with energy-efficient LEDs", 
      progress: 80, 
      target: "90% conversion", 
      reward: "Free smart bulb",
      icon: Lightbulb,
      color: "amber"
    },
    { 
      id: 3, 
      name: "Standby Power Reduction", 
      description: "Reduce vampire power drain by 50%", 
      progress: 30, 
      target: "50% reduction", 
      reward: "$15 bill credit",
      icon: Zap,
      color: "purple"
    },
    { 
      id: 4, 
      name: "Monthly Budget Target", 
      description: "Keep monthly energy bill under $95", 
      progress: 90, 
      target: "$95 monthly bill", 
      reward: "Premium features unlock",
      icon: Target,
      color: "blue"
    }
  ];

  // Mock completed savings achievements
  const completedAchievements = [
    { 
      id: 1, 
      name: "Energy Pioneer", 
      description: "Reduced overall consumption by 10% in first month", 
      reward: "$15 bill credit",
      date: "August 12, 2025",
      icon: Award,
      color: "emerald"
    },
    { 
      id: 2, 
      name: "Smart Scheduler", 
      description: "Successfully configured automation for 5+ devices", 
      reward: "Extended history access",
      date: "July 28, 2025",
      icon: Timer,
      color: "indigo"
    },
    { 
      id: 3, 
      name: "Green Warrior", 
      description: "Reduced carbon footprint by 100kg in a single month", 
      reward: "Eco-badge profile enhancement",
      date: "July 15, 2025",
      icon: Leaf,
      color: "emerald"
    }
  ];

  // Mock savings tips
  const savingsTips = [
    {
      id: 1,
      title: "Optimize Thermostat Settings",
      description: "Adjust your thermostat by 1°C to save up to 10% on heating and cooling costs.",
      impact: "High",
      impactColor: "emerald",
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "Eliminate Phantom Power",
      description: "Use smart plugs to completely cut power to devices when not in use.",
      impact: "Medium",
      impactColor: "amber",
      difficulty: "Easy"
    },
    {
      id: 3,
      title: "Optimize Laundry Loads",
      description: "Wash clothes in cold water and run full loads to maximize efficiency.",
      impact: "Medium",
      impactColor: "amber",
      difficulty: "Easy"
    },
    {
      id: 4,
      title: "Install Smart Blinds",
      description: "Automate window coverings to reduce heating and cooling needs.",
      impact: "High",
      impactColor: "emerald",
      difficulty: "Medium"
    },
    {
      id: 5,
      title: "HVAC Maintenance",
      description: "Regular maintenance of your heating and cooling systems can improve efficiency by 15%.",
      impact: "High",
      impactColor: "emerald",
      difficulty: "Medium"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
          Energy Savings
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your savings and discover ways to reduce energy consumption
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-emerald-700 dark:text-emerald-300 flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-emerald-500" />
              Monthly Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${savingsData.monthlySavings.toFixed(2)}</div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Compared to last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-blue-700 dark:text-blue-300 flex items-center">
              <PiggyBank className="mr-2 h-5 w-5 text-blue-500" />
              Year-to-Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">${savingsData.yearToDateSavings.toFixed(2)}</div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Total savings this year</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-purple-700 dark:text-purple-300 flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-purple-500" />
              Projected Annual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">${savingsData.projectedAnnualSavings.toFixed(2)}</div>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Estimated yearly savings</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 border-teal-200 dark:border-teal-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-teal-700 dark:text-teal-300 flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-teal-500" />
              Carbon Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{savingsData.carbonReduction} kg</div>
            <p className="text-xs text-teal-600/80 dark:text-teal-400/80">CO₂ emissions avoided</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BadgeCheck className="mr-2 h-5 w-5 text-emerald-500" />
            Efficiency Score
          </CardTitle>
          <CardDescription>
            Your home is operating at {savingsData.currentEfficiencyScore}% efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Score</span>
                <span className="font-medium">{savingsData.currentEfficiencyScore}%</span>
              </div>
              <Progress value={savingsData.currentEfficiencyScore} className="h-2" />
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-red-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Poor</span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Fair</span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Good</span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Great</span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-teal-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Excellent</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full p-4 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-1">
              Great job! Your home is energy efficient.
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              You're in the top 15% of energy-efficient homes in your area. Follow our recommendations to reach "Excellent" status.
            </p>
          </div>
        </CardFooter>
      </Card>

      <Tabs defaultValue="goals" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals" className="data-[state=active]:bg-gradient-to-r from-emerald-500 to-teal-600 data-[state=active]:text-white">
            <Target className="mr-2 h-4 w-4" />
            Savings Goals
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r from-emerald-500 to-teal-600 data-[state=active]:text-white">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="tips" className="data-[state=active]:bg-gradient-to-r from-emerald-500 to-teal-600 data-[state=active]:text-white">
            <Lightbulb className="mr-2 h-4 w-4" />
            Savings Tips
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {savingsGoals.map(goal => {
              const Icon = goal.icon;
              return (
                <Card key={goal.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Icon className="mr-2 h-5 w-5 text-emerald-500" />
                        {goal.name}
                      </CardTitle>
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Progress value={goal.progress} className="h-2" />
                    
                    <div className="flex justify-between mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Target: </span>
                        <span className="font-medium">{goal.target}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reward: </span>
                        <span className="font-medium">{goal.reward}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-6">
          <div className="grid gap-4 md:grid-cols-1">
            {completedAchievements.map(achievement => {
              const Icon = achievement.icon;
              return (
                <Card key={achievement.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{achievement.name}</h3>
                        <p className="text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                            Earned: {achievement.reward}
                          </span>
                          <span className="text-xs text-muted-foreground">{achievement.date}</span>
                        </div>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Set New Goals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create personalized energy saving challenges to unlock more achievements
                </p>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tips" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {savingsTips.map(tip => (
              <Card key={tip.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{tip.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge 
                        variant={tip.impactColor === "emerald" ? "default" : "secondary"} 
                        className={`text-xs ${
                          tip.impactColor === "emerald" 
                            ? "bg-emerald-500 text-white" 
                            : tip.impactColor === "amber" 
                            ? "bg-amber-500 text-white" 
                            : "bg-slate-500 text-white"
                        }`}
                      >
                        {tip.impact} Impact
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tip.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
                <CardFooter className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ThumbsUp className="mr-2 h-3.5 w-3.5" />
                    Helpful
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ArrowUpRight className="mr-2 h-3.5 w-3.5" />
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Get Personalized Recommendations</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes your usage patterns to provide custom energy-saving tips tailored to your home.
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  Generate Tips
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
