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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle,
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Lightbulb,
  Zap,
  Home,
  Thermometer,
  Shield,
  TrendingUp,
  Clock,
  Star,
  Sparkles,
  Brain,
  Activity,
  ChevronRight,
  Play,
  Pause
} from "lucide-react";

export default function Assistant() {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Mock conversation history
  const [conversations, setConversations] = useState([
    {
      id: 1,
      type: "assistant",
      message: "Hello! I'm your VoltGuard AI Assistant. I can help you optimize energy usage, monitor your devices, and provide insights about your smart home. How can I assist you today?",
      timestamp: "09:30 AM",
      suggestions: ["Show energy usage", "Optimize devices", "Security status"]
    },
    {
      id: 2,
      type: "user",
      message: "What's my current energy consumption?",
      timestamp: "09:31 AM"
    },
    {
      id: 3,
      type: "assistant",
      message: "Your current energy consumption is 3.2 kW. This is 15% higher than usual due to your HVAC system running more frequently. I recommend adjusting the thermostat by 2°C to save approximately $12 this week.",
      timestamp: "09:31 AM",
      suggestions: ["Adjust thermostat", "View detailed breakdown", "Set up automation"]
    }
  ]);

  // Quick action suggestions
  const quickActions = [
    {
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      title: "Optimize Lighting",
      description: "Adjust lights based on occupancy",
      action: "Turn off unused lights in 3 rooms"
    },
    {
      icon: <Thermometer className="h-5 w-5 text-blue-500" />,
      title: "Climate Control",
      description: "Optimize temperature settings",
      action: "Reduce heating by 2°C to save energy"
    },
    {
      icon: <Shield className="h-5 w-5 text-red-500" />,
      title: "Security Check",
      description: "Review security status",
      action: "All systems secure, 1 alert pending"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      title: "Energy Insights",
      description: "View consumption patterns",
      action: "Peak usage detected at 7-9 PM"
    }
  ];

  // AI capabilities
  const capabilities = [
    {
      category: "Energy Management",
      color: "from-emerald-500 to-teal-500",
      features: [
        "Real-time consumption monitoring",
        "Predictive usage analytics",
        "Cost optimization suggestions",
        "Peak hour management"
      ]
    },
    {
      category: "Smart Home Control",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Voice-activated device control",
        "Automated scheduling",
        "Scene management",
        "Integration with all devices"
      ]
    },
    {
      category: "Security & Safety",
      color: "from-red-500 to-pink-500",
      features: [
        "Threat detection & alerts",
        "Access control management",
        "Emergency response protocols",
        "Privacy protection"
      ]
    },
    {
      category: "Insights & Analytics",
      color: "from-purple-500 to-violet-500",
      features: [
        "Usage pattern analysis",
        "Efficiency recommendations",
        "Cost savings tracking",
        "Performance predictions"
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: conversations.length + 1,
      type: "user" as const,
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: conversations.length + 2,
        type: "assistant" as const,
        message: "I understand you'd like help with that. Let me analyze your current system status and provide you with the best recommendations based on your energy patterns and device performance.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ["Show details", "Apply changes", "Learn more"]
      };
      setConversations(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setMessage("Show me today's energy usage breakdown");
      }, 3000);
    }
  };

  const handleSpeakToggle = () => {
    setIsSpeaking(!isSpeaking);
    // Simulate text-to-speech
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Your intelligent energy management companion
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant={isListening ? "default" : "outline"}
            onClick={handleVoiceToggle}
            className={isListening ? "bg-gradient-to-r from-purple-600 to-pink-500" : ""}
          >
            {isListening ? <Mic className="mr-2 h-4 w-4 animate-pulse" /> : <MicOff className="mr-2 h-4 w-4" />}
            {isListening ? "Listening..." : "Voice"}
          </Button>
          
          <Button 
            variant={isSpeaking ? "default" : "outline"}
            onClick={handleSpeakToggle}
            className={isSpeaking ? "bg-gradient-to-r from-blue-600 to-cyan-500" : ""}
          >
            {isSpeaking ? <Volume2 className="mr-2 h-4 w-4 animate-pulse" /> : <VolumeX className="mr-2 h-4 w-4" />}
            {isSpeaking ? "Speaking" : "Speak"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                AI-powered suggestions for immediate improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {quickActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      {action.icon}
                      <div>
                        <h4 className="font-medium text-sm">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Action
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Conversation */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
                VoltGuard Assistant
                <Badge className="ml-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 dark:bg-gradient-to-r dark:from-emerald-900 dark:to-green-900 dark:text-emerald-300">
                  Online
                </Badge>
              </CardTitle>
              <CardDescription>
                Chat with your AI assistant for energy insights and control
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="space-y-4 h-96 overflow-y-auto mb-4 p-2">
                {conversations.map((conv) => (
                  <div key={conv.id} className={`flex ${conv.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-[80%] ${conv.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        {conv.type === 'assistant' ? (
                          <>
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                              U
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div className={`rounded-lg p-3 ${
                        conv.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{conv.message}</p>
                        <p className={`text-xs mt-1 ${conv.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                          {conv.timestamp}
                        </p>
                        
                        {conv.type === 'assistant' && conv.suggestions && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {conv.suggestions.map((suggestion, index) => (
                              <Button key={index} variant="outline" size="sm" className="text-xs h-6">
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your energy usage..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-purple-600 to-pink-500"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Capabilities Sidebar */}
        <div className="space-y-6">
          {/* AI Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-500" />
                AI Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Learning Mode</span>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data Processing</span>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Real-time</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Model Version</span>
                  <Badge variant="outline">v2.1.0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium text-emerald-600">94.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-amber-500" />
                AI Capabilities
              </CardTitle>
              <CardDescription>
                Explore what your assistant can do
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capabilities.map((capability, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className={`font-medium text-sm mb-2 bg-gradient-to-r ${capability.color} bg-clip-text text-transparent`}>
                      {capability.category}
                    </h4>
                    <ul className="space-y-1">
                      {capability.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-xs text-muted-foreground flex items-center">
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r ${capability.color}`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                Recent AI Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <div>
                    <p className="font-medium">Optimized HVAC schedule</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">Detected energy anomaly</p>
                    <p className="text-xs text-muted-foreground">12 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="font-medium">Generated savings report</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <div>
                    <p className="font-medium">Updated device preferences</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
