import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, Sparkles, BarChart2, TrendingUp, Globe, Loader2, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getBotResponse } from '@/utils/stockData';
import { processMessage, getModelLoadingStatus, initializeAIModels } from '@/utils/aiModel';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'prediction';
  sentimentScore?: number;
  detectedSymbols?: string[];
  trendPrediction?: {
    symbol: string;
    timeframe: string;
    prediction: string;
    generatedAt: string;
  } | null;
}

interface ChatInterfaceProps {
  onStockMentioned?: (symbol: string) => void;
  onMarketSelect?: (market: 'US' | 'India') => void;
}

const ChatInterface = ({ onStockMentioned, onMarketSelect }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm the enhanced Stock Whisperer Bot powered by AI. I can provide real-time data, historical analysis, and sentiment scores for both US and Indian markets. Ask me about a stock like AAPL, MSFT, RELIANCE.NS, or TCS.NS!",
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
  const [modelStatus, setModelStatus] = useState<{sentiment: string, generation: string}>({
    sentiment: 'not_loaded',
    generation: 'not_loaded'
  });
  const [usingAI, setUsingAI] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const suggestions = [
    { text: "US Market Analysis", action: () => handleSuggestionClick("Tell me about the US market") },
    { text: "Indian Market Analysis", action: () => handleSuggestionClick("What's happening in the Indian market?") },
    { text: "Apple Sentiment", action: () => handleSuggestionClick("What's the sentiment for Apple stock?") },
    { text: "Reliance Analysis", action: () => handleSuggestionClick("Analyze Reliance Industries") },
    { text: "Explain Sentiment Scores", action: () => handleSuggestionClick("How do you calculate sentiment scores?") }
  ];

  useEffect(() => {
    const checkModelStatus = () => {
      const status = getModelLoadingStatus();
      setModelStatus(status);
      
      if (status.sentiment === 'loading' || status.generation === 'loading') {
        setTimeout(checkModelStatus, 2000);
      }
      
      if (status.sentiment === 'loaded' && status.generation === 'loaded' && 
          (modelStatus.sentiment !== 'loaded' || modelStatus.generation !== 'loaded')) {
        toast({
          title: "AI Models Loaded",
          description: "Enhanced AI capabilities are now available!",
          duration: 3000
        });
      }
    };
    
    initializeAIModels().then(() => {
      checkModelStatus();
    });
    
    const interval = setInterval(checkModelStatus, 5000);
    return () => clearInterval(interval);
  }, [modelStatus, toast]);

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

  const handleSendMessage = async (overrideText?: string) => {
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

    const marketMentions = [
      { market: 'US', patterns: [/\bus market\b/i, /\bamerican market\b/i, /\bus stocks\b/i] },
      { market: 'India', patterns: [/\bindian market\b/i, /\bindia market\b/i, /\bnifty\b/i, /\bsensex\b/i] }
    ];

    for (const market of marketMentions) {
      for (const pattern of market.patterns) {
        if (pattern.test(messageText)) {
          onMarketSelect?.(market.market as 'US' | 'India');
          break;
        }
      }
    }

    try {
      let botResponse;
      let detectedSymbols: string[] = [];
      let sentimentScore: number | undefined;
      let trendPrediction = null;
      
      if (usingAI && modelStatus.sentiment === 'loaded' && modelStatus.generation === 'loaded') {
        const aiResponse = await processMessage(messageText);
        botResponse = aiResponse.text;
        sentimentScore = aiResponse.sentiment?.score;
        detectedSymbols = aiResponse.detectedSymbols || [];
        trendPrediction = aiResponse.trendPrediction;
        
        detectedSymbols.forEach(symbol => {
          onStockMentioned?.(symbol);
        });
      } else {
        botResponse = getBotResponse(messageText);
        
        const stockMentions = [
          { symbol: 'AAPL', patterns: [/\baapl\b/i, /\bapple\b/i], market: 'US' },
          { symbol: 'MSFT', patterns: [/\bmsft\b/i, /\bmicrosoft\b/i], market: 'US' },
          { symbol: 'GOOGL', patterns: [/\bgoogl\b/i, /\bgoogle\b/i, /\balphabet\b/i], market: 'US' },
          { symbol: 'AMZN', patterns: [/\bamzn\b/i, /\bamazon\b/i], market: 'US' },
          { symbol: 'META', patterns: [/\bmeta\b/i, /\bfacebook\b/i, /\bfb\b/i], market: 'US' },
          { symbol: 'TSLA', patterns: [/\btsla\b/i, /\btesla\b/i], market: 'US' },
          
          { symbol: 'RELIANCE.NS', patterns: [/\breliance\b/i, /\bril\b/i], market: 'India' },
          { symbol: 'TCS.NS', patterns: [/\btcs\b/i, /\btata consultancy\b/i], market: 'India' },
          { symbol: 'HDFCBANK.NS', patterns: [/\bhdfc bank\b/i, /\bhdfcbank\b/i], market: 'India' },
          { symbol: 'INFY.NS', patterns: [/\binfosys\b/i, /\binfy\b/i], market: 'India' },
          { symbol: 'BAJAJ-AUTO.NS', patterns: [/\bbajaj auto\b/i, /\bbajaj-auto\b/i], market: 'India' }
        ];

        for (const stock of stockMentions) {
          for (const pattern of stock.patterns) {
            if (pattern.test(messageText)) {
              onStockMentioned?.(stock.symbol);
              onMarketSelect?.(stock.market as 'US' | 'India');
              detectedSymbols.push(stock.symbol);
              break;
            }
          }
        }
      }
      
      const botReply: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        sentimentScore,
        detectedSymbols,
        trendPrediction
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, botReply]);
        
        if (trendPrediction) {
          const predictionMessage: Message = {
            id: messages.length + 3,
            text: trendPrediction.prediction,
            sender: 'bot',
            timestamp: new Date(),
            type: 'prediction',
            detectedSymbols: [trendPrediction.symbol],
            trendPrediction
          };
          
          setTimeout(() => {
            setMessages(prev => [...prev, predictionMessage]);
          }, 500);
        } else {
          const shouldAddSuggestion = Math.random() > 0.5;
          
          if (shouldAddSuggestion) {
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
        }
        
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error processing message:", error);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: messages.length + 2,
          text: "I'm having trouble processing your request. Let me try again.",
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const aiModeAvailable = modelStatus.sentiment === 'loaded' && modelStatus.generation === 'loaded';

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
          <Badge variant="outline" className={`ml-1 ${
            aiModeAvailable 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {aiModeAvailable ? (
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI-Enhanced
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading AI Models...
              </span>
            )}
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
              ) : message.type === 'prediction' ? (
                <div className="max-w-[90%] p-2 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp size={12} className="text-purple-500" />
                    <span className="text-xs font-medium text-purple-500">
                      {message.trendPrediction?.timeframe || 'Short-term'} Prediction for {message.trendPrediction?.symbol}
                    </span>
                    <Calendar size={10} className="ml-1 text-purple-400" />
                    <span className="text-xs text-purple-400">
                      {new Date(message.trendPrediction?.generatedAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
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
                  
                  {message.detectedSymbols && message.detectedSymbols.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.detectedSymbols.map((symbol, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-100">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {message.sentimentScore !== undefined && (
                    <div className="mt-1 text-xs flex items-center gap-1">
                      <span className={`font-medium ${
                        message.sentimentScore >= 0.6 ? 'text-stock-green' : 
                        message.sentimentScore >= 0.4 ? 'text-amber-500' : 
                        'text-stock-red'
                      }`}>
                        Sentiment: {message.sentimentScore.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
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
            placeholder="Ask about stocks, future trends, sentiment analysis, or market predictions..."
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
        <div className="w-full mt-2 flex justify-end">
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${aiModeAvailable ? 'hover:bg-blue-50' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => aiModeAvailable && setUsingAI(!usingAI)}
          >
            {usingAI ? 'Using AI Mode' : 'Using Basic Mode'} {!aiModeAvailable && '(Loading...)'}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
