
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getBotResponse } from '@/utils/stockData';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onStockMentioned?: (symbol: string) => void;
}

const ChatInterface = ({ onStockMentioned }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm the Stock Whisperer Bot. I can provide stock predictions and market insights. Ask me about a stock like AAPL or MSFT, or about general market trends!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Check for stock mentions to update the chart
    const stockMentions = [
      { symbol: 'AAPL', patterns: [/\baapl\b/i, /\bapple\b/i] },
      { symbol: 'MSFT', patterns: [/\bmsft\b/i, /\bmicrosoft\b/i] },
      { symbol: 'GOOGL', patterns: [/\bgoogl\b/i, /\bgoogle\b/i, /\balphabet\b/i] },
      { symbol: 'AMZN', patterns: [/\bamzn\b/i, /\bamazon\b/i] },
      { symbol: 'META', patterns: [/\bmeta\b/i, /\bfacebook\b/i, /\bfb\b/i] },
      { symbol: 'TSLA', patterns: [/\btsla\b/i, /\btesla\b/i] }
    ];

    for (const stock of stockMentions) {
      for (const pattern of stock.patterns) {
        if (pattern.test(input)) {
          onStockMentioned?.(stock.symbol);
          break;
        }
      }
    }

    setTimeout(() => {
      const botReply: Message = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary">
            <AvatarImage src="" />
            <AvatarFallback>
              <Bot size={16} />
            </AvatarFallback>
          </Avatar>
          <span>Stock Whisperer Bot</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Ask about stocks or market predictions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            size="icon"
            disabled={!input.trim()}
            className="chat-gradient"
          >
            <SendHorizontal size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
