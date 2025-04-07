
// Sample stock data for demonstration purposes
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  prediction: {
    direction: 'up' | 'down' | 'neutral';
    targetPrice: number;
    confidence: number;
    timeFrame: string;
  };
  historicalData: { date: string; price: number }[];
}

export const popularStocks: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.63,
    change: 1.25,
    changePercent: 0.69,
    prediction: {
      direction: 'up',
      targetPrice: 195.50,
      confidence: 0.78,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(180, 2, 150)
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 418.24,
    change: -2.31,
    changePercent: -0.55,
    prediction: {
      direction: 'up',
      targetPrice: 440.00,
      confidence: 0.65,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(380, 5, 150)
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 157.73,
    change: 0.42,
    changePercent: 0.27,
    prediction: {
      direction: 'up',
      targetPrice: 175.00,
      confidence: 0.72,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(140, 2, 150)
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.15,
    change: -1.05,
    changePercent: -0.59,
    prediction: {
      direction: 'up',
      targetPrice: 190.00,
      confidence: 0.68,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(160, 3, 150)
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 472.01,
    change: 5.63,
    changePercent: 1.21,
    prediction: {
      direction: 'up',
      targetPrice: 500.00,
      confidence: 0.81,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(430, 6, 150)
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 177.50,
    change: -2.95,
    changePercent: -1.63,
    prediction: {
      direction: 'neutral',
      targetPrice: 180.00,
      confidence: 0.55,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(190, 4, 150)
  }
];

// Generate random historical data
function generateMockHistoricalData(
  basePrice: number, 
  volatility: number, 
  days: number
): { date: string; price: number }[] {
  const data = [];
  let currentPrice = basePrice;
  const today = new Date();

  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Add some randomness to price
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = Math.max(0, currentPrice + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2))
    });
  }

  return data;
}

export function searchStocks(query: string): StockData[] {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  return popularStocks.filter(
    stock => 
      stock.symbol.toLowerCase().includes(normalizedQuery) || 
      stock.name.toLowerCase().includes(normalizedQuery)
  );
}

export function getStockBySymbol(symbol: string): StockData | undefined {
  return popularStocks.find(stock => stock.symbol === symbol);
}

// Predefined bot responses
export const botResponses = [
  {
    pattern: /apple|aapl/i,
    response: "Based on my analysis, Apple (AAPL) shows strong fundamentals with potential upside. Their consistent innovation in product lines and services suggests continued growth. I predict a target price of $195.50 in the next 3 months with 78% confidence."
  },
  {
    pattern: /microsoft|msft/i,
    response: "Microsoft (MSFT) appears well-positioned for growth due to their cloud business expansion and strategic AI investments. My analysis indicates a target price of $440.00 in the next 3 months with 65% confidence."
  },
  {
    pattern: /google|alphabet|googl/i,
    response: "Alphabet (GOOGL) shows positive momentum from their advertising business recovery and AI advancements. My prediction points to a target price of $175.00 over the next 3 months with 72% confidence."
  },
  {
    pattern: /amazon|amzn/i,
    response: "Amazon (AMZN) demonstrates continued e-commerce dominance and AWS growth potential. I project a target price of $190.00 in the next 3 months with 68% confidence based on market trends and company performance."
  },
  {
    pattern: /meta|fb|facebook/i,
    response: "Meta Platforms (META) is showing strong performance with their advertising business rebound and metaverse investments. I predict a target price of $500.00 in the next 3 months with 81% confidence."
  },
  {
    pattern: /tesla|tsla/i,
    response: "Tesla (TSLA) faces both opportunities and challenges in the current market. My analysis suggests a neutral outlook with a target price of $180.00 in the next 3 months with 55% confidence due to increased EV competition and production concerns."
  },
  {
    pattern: /market|outlook|general|overall/i,
    response: "The overall market outlook appears cautiously optimistic with potential volatility due to interest rate policies and global economic factors. Technology and AI-related sectors may outperform over the next quarter, while traditional retail and energy sectors face challenges."
  },
  {
    pattern: /prediction|forecast|estimate/i,
    response: "When making predictions, I analyze historical data patterns, company fundamentals, market trends, and sector performance. Keep in mind that all predictions involve uncertainty and should be considered as one input among many for investment decisions."
  },
  {
    pattern: /help|how|what can you do/i,
    response: "I'm the Stock Whisperer Bot! You can ask me about stock predictions for popular companies (like AAPL, MSFT, GOOGL), market trends, or search for specific stocks. I provide price targets based on historical data analysis."
  }
];

export function getBotResponse(userMessage: string): string {
  for (const item of botResponses) {
    if (item.pattern.test(userMessage)) {
      return item.response;
    }
  }
  
  return "I don't have specific information about that stock or topic yet. You can ask about popular stocks like Apple (AAPL), Microsoft (MSFT), Google (GOOGL), Amazon (AMZN), Meta (META), or Tesla (TSLA), or about general market trends.";
}
