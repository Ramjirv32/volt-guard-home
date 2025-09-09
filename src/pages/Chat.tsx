import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SendIcon, Bot, User } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      content: "Hello! I'm VoltGuard Assistant. How can I help you with your smart home today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("energy") || lowerMessage.includes("usage") || lowerMessage.includes("consumption")) {
      return "Your energy usage this month is 324 kWh, which is 12% lower than last month. Great job at saving energy!";
    }
    
    if (lowerMessage.includes("device") || lowerMessage.includes("light") || lowerMessage.includes("plug")) {
      return "You have 8 devices connected. 3 devices are currently active: Living Room Light, Kitchen Light, and Smart TV.";
    }
    
    if (lowerMessage.includes("setting") || lowerMessage.includes("configure")) {
      return "You can configure your device settings in the Settings page. Would you like me to guide you there?";
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "I can help with monitoring your energy usage, controlling devices, and answering questions about your smart home system. What specific help do you need?";
    }
    
    if (lowerMessage.includes("saving") || lowerMessage.includes("tips") || lowerMessage.includes("reduce")) {
      return "Here are some energy saving tips: 1) Turn off lights when not in use, 2) Use smart scheduling for high-consumption devices, 3) Upgrade to energy-efficient appliances, 4) Use motion sensors for automatic control.";
    }
    
    return "I'm not sure I understand. Could you rephrase your question? I can help with energy usage, device control, or system settings.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Virtual Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Get help with your smart home system
          </p>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5" /> VoltGuard Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh] overflow-y-auto mb-4 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
                      {message.sender === "user" ? (
                        <>
                          <AvatarImage src={user?.photoURL || ""} />
                          <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder-logo.svg" />
                          <AvatarFallback>AI</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder-logo.svg" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <Separator className="my-4" />
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Suggested Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue("What's my energy usage this month?");
                  setTimeout(handleSendMessage, 100);
                }}
                disabled={isTyping}
              >
                What's my energy usage this month?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue("Which devices are currently active?");
                  setTimeout(handleSendMessage, 100);
                }}
                disabled={isTyping}
              >
                Which devices are currently active?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue("Give me energy saving tips");
                  setTimeout(handleSendMessage, 100);
                }}
                disabled={isTyping}
              >
                Give me energy saving tips
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue("How do I configure device settings?");
                  setTimeout(handleSendMessage, 100);
                }}
                disabled={isTyping}
              >
                How do I configure device settings?
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chat;
