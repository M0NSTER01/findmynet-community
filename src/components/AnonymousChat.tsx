import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, User, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  sender: 'owner' | 'finder';
  timestamp: string;
  senderName: string;
}

interface AnonymousChatProps {
  deviceId: string;
  deviceName: string;
  onClose: () => void;
}

export const AnonymousChat = ({ deviceId, deviceName, onClose }: AnonymousChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if current user owns this device
    const ownsDevice = user?.devices.some(device => device.id === deviceId);
    setIsOwner(!!ownsDevice);

    // Load existing messages for this device (simulated)
    const storedMessages = localStorage.getItem(`chat_${deviceId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Initial message from owner
      const initialMessage: Message = {
        id: '1',
        text: `Hello! Thank you for finding my ${deviceName}. Please let me know where you found it and we can arrange to meet safely.`,
        sender: 'owner',
        timestamp: new Date().toLocaleTimeString(),
        senderName: 'Device Owner'
      };
      setMessages([initialMessage]);
      localStorage.setItem(`chat_${deviceId}`, JSON.stringify([initialMessage]));
    }
  }, [deviceId, deviceName, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: isOwner ? 'owner' : 'finder',
      timestamp: new Date().toLocaleTimeString(),
      senderName: isOwner ? 'Device Owner' : 'Anonymous Finder'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${deviceId}`, JSON.stringify(updatedMessages));
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="shadow-elegant border-0 h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Anonymous Chat</CardTitle>
              <p className="text-sm text-muted-foreground">Device: {deviceName}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 mt-3 p-3 bg-accent/10 rounded-lg">
          <Shield className="w-4 h-4 text-accent" />
          <p className="text-xs text-muted-foreground">
            This chat is anonymous and secure. Messages are stored locally.
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  (isOwner && message.sender === 'owner') || 
                  (!isOwner && message.sender === 'finder')
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    (isOwner && message.sender === 'owner') || 
                    (!isOwner && message.sender === 'finder')
                      ? 'bg-primary text-primary-foreground ml-4' 
                      : 'bg-muted mr-4'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-3 h-3" />
                    <span className="text-xs font-medium opacity-80">
                      {message.senderName}
                    </span>
                    <span className="text-xs opacity-60">{message.timestamp}</span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 p-4 border-t bg-background">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};