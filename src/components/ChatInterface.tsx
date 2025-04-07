
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, Sparkles, BarChart2, TrendingUp, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getBotResponse } from '@/utils/stockData';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

interface ChatInterfaceProps {
  onStockMentioned?: (symbol: string) => void;
  onMarketSelect?: (market: 'US' | 'India') => void;
}

const ChatInterface = ({ onStockMentioned, onMarketSelect }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm the enhanced Stock Whisperer Bot. I can provide real-time data, historical analysis, and sentiment scores for both US and Indian markets. Ask me about a stock like AAPL, MSFT, RELIANCE.NS, or TCS.NS!",
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: 2,
      text: "Try asking about sentiment analysis or specific market insights.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'suggestion'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions that will appear as clickable badges
  const suggestions = [
    { text: "US Market Analysis", action: () => handleSuggestionClick("Tell me about the US market") },
    { text: "Indian Market Analysis", action: () => handleSuggestionClick("What's happening in the Indian market?") },
    { text: "Apple Sentiment", action: () => handleSuggestionClick("What's the sentiment for Apple stock?") },
    { text: "Reliance Analysis", action: () => handleSuggestionClick("Analyze Reliance Industries") },
    { text: "Explain Sentiment Scores", action: () => handleSuggestionClick("How do you calculate sentiment scores?") }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      handleSendMessage(text);
    }, 100);
  };

  const handleSendMessage = (overrideText?: string) => {
    const messageText = overrideText || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Check for stock mentions to update the chart
    const stockMentions = [
      // US market stocks
      { symbol: 'AAPL', patterns: [/\baapl\b/i, /\bapple\b/i], market: 'US' },
      { symbol: 'MSFT', patterns: [/\bmsft\b/i, /\bmicrosoft\b/i], market: 'US' },
      { symbol: 'GOOGL', patterns: [/\bgoogl\b/i, /\bgoogle\b/i, /\balphabet\b/i], market: 'US' },
      { symbol: 'AMZN', patterns: [/\bamzn\b/i, /\bamazon\b/i], market: 'US' },
      { symbol: 'META', patterns: [/\bmeta\b/i, /\bfacebook\b/i, /\bfb\b/i], market: 'US' },
      { symbol: 'TSLA', patterns: [/\btsla\b/i, /\btesla\b/i], market: 'US' },
      
      // Indian market stocks
      { symbol: 'RELIANCE.NS', patterns: [/\breliance\b/i, /\bril\b/i], market: 'India' },
      { symbol: 'TCS.NS', patterns: [/\btcs\b/i, /\btata consultancy\b/i], market: 'India' },
      { symbol: 'HDFCBANK.NS', patterns: [/\bhdfc bank\b/i, /\bhdfcbank\b/i], market: 'India' },
      { symbol: 'INFY.NS', patterns: [/\binfosys\b/i, /\binfy\b/i], market: 'India' },
      { symbol: 'BAJAJ-AUTO.NS', patterns: [/\bbajaj auto\b/i, /\bbajaj-auto\b/i], market: 'India' }
    ];

    // Check for market-specific mentions
    const marketMentions = [
      { market: 'US', patterns: [/\bus market\b/i, /\bamerican market\b/i, /\bus stocks\b/i] },
      { market: 'India', patterns: [/\bindian market\b/i, /\bindia market\b/i, /\bnifty\b/i, /\bsensex\b/i] }
    ];

    // Check for stock mentions
    for (const stock of stockMentions) {
      for (const pattern of stock.patterns) {
        if (pattern.test(messageText)) {
          onStockMentioned?.(stock.symbol);
          onMarketSelect?.(stock.market as 'US' | 'India');
          break;
        }
      }
    }

    // Check for market mentions
    for (const market of marketMentions) {
      for (const pattern of market.patterns) {
        if (pattern.test(messageText)) {
          onMarketSelect?.(market.market as 'US' | 'India');
          break;
        }
      }
    }

    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      
      // Create a suggestion message if relevant
      const shouldAddSuggestion = Math.random() > 0.5; // 50% chance to add a suggestion
      
      const botReply: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botReply]);
      
      if (shouldAddSuggestion) {
        // Add a follow-up suggestion
        const suggestionOptions = [
          "Would you like to see sentiment analysis for this stock?",
          "Can I show you historical performance comparisons?",
          "Do you want to know about related stocks in this sector?",
          "Would you like real-time updates on this stock?"
        ];
        
        const suggestion: Message = {
          id: messages.length + 3,
          text: suggestionOptions[Math.floor(Math.random() * suggestionOptions.length)],
          sender: 'bot',
          timestamp: new Date(),
          type: 'suggestion'
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, suggestion]);
        }, 500);
      }
      
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
          <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200">
            Enhanced
          </Badge>
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
              {message.type === 'suggestion' ? (
                <div className="max-w-[90%] p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles size={12} className="text-blue-500" />
                    <span className="text-xs font-medium text-blue-500">Suggestion</span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              ) : (
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
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
      <div className="px-3 py-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {suggestions.map((suggestion, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-secondary bg-white"
              onClick={suggestion.action}
            >
              {suggestion.text}
            </Badge>
          ))}
        </div>
      </div>
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Ask about stocks, sentiment analysis, or market predictions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={() => handleSendMessage()}
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
