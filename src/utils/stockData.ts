// Stock data utilities with enhanced real-time, historical data and sentiment analysis
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: 'US' | 'India';
  sentiment: {
    score: number; // -1.0 to 1.0 (negative to positive)
    analysis: string;
    newsItems: {
      title: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      source: string;
      date: string;
    }[];
  };
  prediction: {
    direction: 'up' | 'down' | 'neutral';
    targetPrice: number;
    confidence: number;
    timeFrame: string;
  };
  historicalData: { date: string; price: number; volume?: number }[];
  realTimeUpdates?: {
    lastUpdate: string;
    price: number;
    change: number;
  }[];
}

// Add popular US stocks
const usStocks: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.63,
    change: 1.25,
    changePercent: 0.69,
    market: 'US',
    sentiment: {
      score: 0.65,
      analysis: 'Overall positive sentiment with strong consumer demand for new products',
      newsItems: [
        {
          title: 'Apple reports record quarterly revenue',
          sentiment: 'positive',
          source: 'MarketWatch',
          date: '2025-03-15'
        },
        {
          title: 'New iPhone models face supply chain constraints',
          sentiment: 'negative',
          source: 'Bloomberg',
          date: '2025-03-27'
        },
        {
          title: 'Apple expands AI capabilities in latest software update',
          sentiment: 'positive',
          source: 'TechCrunch',
          date: '2025-04-02'
        }
      ]
    },
    prediction: {
      direction: 'up',
      targetPrice: 195.50,
      confidence: 0.78,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(180, 2, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(182.63, 10)
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 418.24,
    change: -2.31,
    changePercent: -0.55,
    market: 'US',
    sentiment: {
      score: 0.72,
      analysis: 'Strong positive sentiment due to cloud business growth and AI investments',
      newsItems: [
        {
          title: 'Microsoft cloud revenue exceeds expectations',
          sentiment: 'positive',
          source: 'Reuters',
          date: '2025-03-18'
        },
        {
          title: 'Microsoft expands AI partnership with OpenAI',
          sentiment: 'positive',
          source: 'CNBC',
          date: '2025-03-30'
        },
        {
          title: 'Analysts raise Microsoft price targets',
          sentiment: 'positive',
          source: 'Barron\'s',
          date: '2025-04-05'
        }
      ]
    },
    prediction: {
      direction: 'up',
      targetPrice: 440.00,
      confidence: 0.65,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(380, 5, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(418.24, 10)
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 157.73,
    change: 0.42,
    changePercent: 0.27,
    market: 'US',
    sentiment: {
      score: 0.58,
      analysis: 'Moderately positive with advertising revenue recovery and AI advancements',
      newsItems: [
        {
          title: 'Google AI outperforms competitors in benchmark tests',
          sentiment: 'positive',
          source: 'TechRadar',
          date: '2025-03-12'
        },
        {
          title: 'Antitrust concerns weigh on Alphabet',
          sentiment: 'negative',
          source: 'Wall Street Journal',
          date: '2025-03-24'
        },
        {
          title: 'YouTube ad revenue grows 15% year-over-year',
          sentiment: 'positive',
          source: 'Advertising Age',
          date: '2025-04-01'
        }
      ]
    },
    prediction: {
      direction: 'up',
      targetPrice: 175.00,
      confidence: 0.72,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(140, 2, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(157.73, 10)
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.15,
    change: -1.05,
    changePercent: -0.59,
    market: 'US',
    sentiment: {
      score: 0.68,
      analysis: 'Positive outlook with strong e-commerce sales and AWS growth',
      newsItems: [
        {
          title: 'Amazon Web Services announces new data centers',
          sentiment: 'positive',
          source: 'Data Center Knowledge',
          date: '2025-03-10'
        },
        {
          title: 'Amazon faces regulatory scrutiny over marketplace practices',
          sentiment: 'negative',
          source: 'The Information',
          date: '2025-03-25'
        },
        {
          title: 'Amazon Prime membership hits record levels',
          sentiment: 'positive',
          source: 'Digital Commerce 360',
          date: '2025-04-01'
        }
      ]
    },
    prediction: {
      direction: 'up',
      targetPrice: 190.00,
      confidence: 0.68,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(160, 3, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(178.15, 10)
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 472.01,
    change: 5.63,
    changePercent: 1.21,
    market: 'US',
    sentiment: {
      score: 0.81,
      analysis: 'Very positive sentiment with advertising business rebound and metaverse investments',
      newsItems: [
        {
          title: 'Meta reports strong growth in advertising revenue',
          sentiment: 'positive',
          source: 'Marketing Dive',
          date: '2025-03-15'
        },
        {
          title: 'Meta unveils new VR headset with advanced features',
          sentiment: 'positive',
          source: 'UploadVR',
          date: '2025-03-28'
        },
        {
          title: 'Analysts predict continued growth for Meta',
          sentiment: 'positive',
          source: 'Investor\'s Business Daily',
          date: '2025-04-03'
        }
      ]
    },
    prediction: {
      direction: 'up',
      targetPrice: 500.00,
      confidence: 0.81,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(430, 6, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(472.01, 10)
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 177.50,
    change: -2.95,
    changePercent: -1.63,
    market: 'US',
    sentiment: {
      score: 0.55,
      analysis: 'Neutral sentiment with opportunities and challenges in the EV market',
      newsItems: [
        {
          title: 'Tesla announces record vehicle deliveries',
          sentiment: 'positive',
          source: 'Electrek',
          date: '2025-03-12'
        },
        {
          title: 'Tesla faces increased competition from legacy automakers',
          sentiment: 'negative',
          source: 'Automotive News',
          date: '2025-03-24'
        },
        {
          title: 'Tesla expands charging infrastructure network',
          sentiment: 'positive',
          source: 'Teslarati',
          date: '2025-04-01'
        }
      ]
    },
    prediction: {
      direction: 'neutral',
      targetPrice: 180.00,
      confidence: 0.55,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(190, 4, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(177.50, 10)
  }
];

// Add popular Indian stocks
const indianStocks: StockData[] = [
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries Ltd.',
    price: 2876.45,
    change: 24.75,
    changePercent: 0.87,
    market: 'India',
    sentiment: {
      score: 0.68,
      analysis: 'Positive outlook with digital business growth and energy transition plans',
      newsItems: [
        {
          title: 'Reliance expands renewable energy capacity',
          sentiment: 'positive',
          source: 'Economic Times',
          date: '2025-03-22'
        },
        {
          title: 'Jio Platforms announces strategic partnership',
          sentiment: 'positive',
          source: 'Business Standard',
          date: '2025-03-28'
        },
        {
          title: 'Reliance Retail reports 12% growth in quarterly revenue',
          sentiment: 'positive',
          source: 'Mint',
          date: '2025-04-03'
        }
      ]
    },
    prediction: {
      direction: 'up',
      targetPrice: 3050.00,
      confidence: 0.73,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(2800, 40, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(2876.45, 10)
  },
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services Ltd.',
    price: 3825.60,
    change: -15.40,
    changePercent: -0.40,
    market: 'India',
    sentiment: {
      score: 0.54,
      analysis: 'Neutral to positive sentiment with steady growth in digital transformation services',
      newsItems: [
        {
          title: 'TCS wins multi-year IT deal with European bank',
          sentiment: 'positive',
          source: 'Financial Express',
          date: '2025-03-19'
        },
        {
          title: 'IT sector faces headwinds amid global uncertainty',
          sentiment: 'negative',
          source: 'Mint',
          date: '2025-03-25'
        },
        {
          title: 'TCS announces strategic cloud partnership',
          sentiment: 'positive',
          source: 'Business Today',
          date: '2025-04-04'
        }
      ]
    },
    prediction: {
      direction: 'neutral',
      targetPrice: 3850.00,
      confidence: 0.58,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(3800, 50, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(3825.60, 10)
  },
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank Ltd.',
    price: 1675.85,
    change: 12.50,
    changePercent: 0.75,
    market: 'India',
    sentiment: {
      score: 0.71,
      analysis: 'Strong positive sentiment with robust loan growth and asset quality',
      newsItems: [
        {
          title: 'HDFC Bank expands digital banking initiatives',
          sentiment: 'positive',
          source: 'Economic Times',
          date: '2025-03-20'
        },
        {
          title: 'HDFC Bank reports strong quarterly earnings',
          sentiment: 'positive',
          source: 'Business Standard',
          date: '2025-03-31'
        },
        {
          title: 'HDFC Bank launches new credit card with enhanced rewards',
          sentiment: 'positive',
          source: 'LiveMint',
          date: '2025-04-06'
        }
      ]
    },
    prediction: {
      direction: 'up',
      targetPrice: 1780.00,
      confidence: 0.76,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(1600, 25, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(1675.85, 10)
  },
  {
    symbol: 'INFY.NS',
    name: 'Infosys Ltd.',
    price: 1543.20,
    change: -8.75,
    changePercent: -0.56,
    market: 'India',
    sentiment: {
      score: 0.52,
      analysis: 'Neutral sentiment with concerns about margin pressure offset by deal momentum',
      newsItems: [
        {
          title: 'Infosys wins digital transformation deal with global retailer',
          sentiment: 'positive',
          source: 'Economic Times',
          date: '2025-03-15'
        },
        {
          title: 'IT sector faces talent retention challenges',
          sentiment: 'negative',
          source: 'Business Today',
          date: '2025-03-28'
        },
        {
          title: 'Infosys expands AI and automation capabilities',
          sentiment: 'positive',
          source: 'Financial Express',
          date: '2025-04-02'
        }
      ]
    },
    prediction: {
      direction: 'neutral',
      targetPrice: 1560.00,
      confidence: 0.62,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(1500, 30, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(1543.20, 10)
  },
  {
    symbol: 'BAJAJ-AUTO.NS',
    name: 'Bajaj Auto Ltd.',
    price: 7625.40,
    change: 86.25,
    changePercent: 1.14,
    market: 'India',
    sentiment: {
      score: 0.63,
      analysis: 'Positive sentiment with strong domestic sales and export recovery',
      newsItems: [
        {
          title: 'Bajaj Auto launches new electric vehicle model',
          sentiment: 'positive',
          source: 'Mint',
          date: '2025-03-18'
        },
        {
          title: 'Two-wheeler exports show signs of recovery',
          sentiment: 'positive',
          source: 'Business Standard',
          date: '2025-03-29'
        },
        {
          title: 'Rising raw material costs impact auto sector margins',
          sentiment: 'negative',
          source: 'Financial Express',
          date: '2025-04-05'
        }
      ]
    },
    prediction: {
      direction: 'up',
      targetPrice: 7950.00,
      confidence: 0.67,
      timeFrame: '3 months'
    },
    historicalData: generateMockHistoricalData(7500, 100, 150, true),
    realTimeUpdates: generateMockRealTimeUpdates(7625.40, 10)
  }
];

// Combine all stocks
export const popularStocks: StockData[] = [...usStocks, ...indianStocks];

// Generate more realistic historical data with volume
function generateMockHistoricalData(
  basePrice: number, 
  volatility: number, 
  days: number,
  includeVolume: boolean = false
): { date: string; price: number; volume?: number }[] {
  const data = [];
  let currentPrice = basePrice;
  const today = new Date();
  
  // Create some trend patterns
  const trendCycles = Math.floor(days / 30); // roughly monthly cycles
  const trendDirection: number[] = [];
  
  for (let i = 0; i < trendCycles; i++) {
    // Generate trend biases for each cycle (-1 to 1)
    trendDirection.push(Math.random() * 2 - 1);
  }

  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Get current trend cycle
    const currentCycle = Math.floor((days - i) / 30);
    const trendBias = trendDirection[Math.min(currentCycle, trendDirection.length - 1)];
    
    // Add some randomness to price with trend bias
    let randomFactor = Math.random() - 0.5;
    // Bias the random factor with the trend direction
    randomFactor = randomFactor + (trendBias * 0.3);
    
    const change = randomFactor * volatility;
    currentPrice = Math.max(0.1, currentPrice + change);
    
    // For weekends, skip price updates (markets closed)
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const entry: { date: string; price: number; volume?: number } = {
        date: date.toISOString().split('T')[0],
        price: parseFloat(currentPrice.toFixed(2))
      };
      
      // Add volume if requested
      if (includeVolume) {
        // Base volume + random factor + higher volume on big price moves
        const baseVolume = Math.abs(basePrice) * 1000;
        const volumeVariation = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
        const priceImpact = Math.abs(change) > volatility/2 ? 1.5 : 1;
        entry.volume = Math.round(baseVolume * volumeVariation * priceImpact);
      }
      
      data.push(entry);
    }
  }

  return data;
}

// Generate mock real-time data updates
function generateMockRealTimeUpdates(
  currentPrice: number,
  minutes: number
): { lastUpdate: string; price: number; change: number }[] {
  const updates = [];
  let price = currentPrice;
  const now = new Date();
  
  for (let i = minutes; i >= 0; i--) {
    const updateTime = new Date(now);
    updateTime.setMinutes(now.getMinutes() - i);
    
    // Small variations for real-time updates
    const change = (Math.random() - 0.5) * 0.2;
    price = parseFloat((price + change).toFixed(2));
    
    updates.push({
      lastUpdate: updateTime.toISOString(),
      price: price,
      change: change
    });
  }
  
  return updates;
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

export function getStocksByMarket(market: 'US' | 'India'): StockData[] {
  return popularStocks.filter(stock => stock.market === market);
}

// Enhanced bot responses with sentiment analysis and Indian market knowledge
export const botResponses = [
  // US market stock responses
  {
    pattern: /apple|aapl/i,
    response: "Based on my analysis, Apple (AAPL) shows strong fundamentals with positive sentiment (score: 0.65). Recent news about record quarterly revenue and expanded AI capabilities is promising, though there are some supply chain concerns. Technical indicators suggest a target price of $195.50 in the next 3 months with 78% confidence."
  },
  {
    pattern: /microsoft|msft/i,
    response: "Microsoft (MSFT) has very positive market sentiment (score: 0.72) due to cloud business growth and strategic AI investments. Recent reports show cloud revenue exceeding expectations, and they've expanded their AI partnerships. Technical analysis indicates a target price of $440.00 in the next 3 months with 65% confidence."
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
  
  // Indian market stock responses
  {
    pattern: /reliance|reliance industries|ril/i,
    response: "Reliance Industries (RELIANCE.NS) shows positive sentiment (score: 0.68) with strong growth in digital business and energy transition plans. Recent expansion in renewable energy capacity and Jio Platforms' strategic partnerships are positive indicators. Technical analysis suggests a target price of ₹3050.00 in the next 3 months with 73% confidence."
  },
  {
    pattern: /tcs|tata consultancy/i,
    response: "Tata Consultancy Services (TCS.NS) has a neutral to positive sentiment (score: 0.54) with steady growth in digital transformation services. While they've secured new IT deals and strategic partnerships, the IT sector faces headwinds amid global uncertainty. My analysis indicates a target price of ₹3850.00 in the next 3 months with 58% confidence."
  },
  {
    pattern: /hdfc bank|hdfcbank/i,
    response: "HDFC Bank (HDFCBANK.NS) demonstrates strong positive sentiment (score: 0.71) with robust loan growth and excellent asset quality. Their digital banking initiatives and strong quarterly earnings support a bullish outlook. Technical indicators point to a target price of ₹1780.00 in the next 3 months with 76% confidence."
  },
  {
    pattern: /infosys|infy/i,
    response: "Infosys (INFY.NS) shows neutral sentiment (score: 0.52) with concerns about margin pressure offset by deal momentum. While they've won new digital transformation deals and expanded AI capabilities, the IT sector faces talent retention challenges. My analysis suggests a target price of ₹1560.00 in the next 3 months with 62% confidence."
  },
  {
    pattern: /bajaj auto|bajaj-auto/i,
    response: "Bajaj Auto (BAJAJ-AUTO.NS) has positive sentiment (score: 0.63) with strong domestic sales and signs of export recovery. The launch of new electric vehicle models is a positive indicator, though rising raw material costs may impact margins. Technical analysis points to a target price of ₹7950.00 in the next 3 months with 67% confidence."
  },
  
  // Market analysis responses
  {
    pattern: /us market|american market/i,
    response: "The US market outlook appears cautiously optimistic with potential volatility due to interest rate policies and global economic factors. Technology and AI-related sectors continue to outperform, while traditional retail faces challenges. Market sentiment is moderately positive overall, with particular strength in semiconductor, cloud computing, and renewable energy sectors."
  },
  {
    pattern: /indian market|india market|nifty|sensex/i,
    response: "The Indian market shows resilience despite global uncertainties, supported by strong domestic consumption and government infrastructure spending. The Nifty and Sensex have been trading near all-time highs with positive momentum. IT, banking, and renewable energy sectors show particular promise, while consumer staples provide defensive positioning amid potential volatility."
  },
  
  // Sentiment analysis explanation
  {
    pattern: /sentiment|sentiment analysis|sentiment score/i,
    response: "My sentiment analysis derives scores ranging from -1.0 (extremely negative) to 1.0 (extremely positive) based on news coverage, social media trends, analyst reports, and corporate announcements. Scores above 0.6 indicate strong positive sentiment, 0.4-0.6 suggest neutral to positive sentiment, while below 0.4 signals caution. These scores factor into my overall price predictions but should be considered alongside fundamentals and technical analysis."
  },
  
  // General help
  {
    pattern: /help|how|what can you do/i,
    response: "I'm the enhanced Stock Whisperer Bot! I can provide real-time data, historical analysis, and sentiment scores for both US and Indian markets. Ask me about stocks like Apple (AAPL), Microsoft (MSFT), Reliance (RELIANCE.NS), or TCS (TCS.NS). I analyze news sentiment, technical patterns, and market trends to provide predictions with confidence levels."
  }
];

// Enhanced response generation with sentiment analysis inclusion
export function getBotResponse(userMessage: string): string {
  // Check for specific stock mentions first
  for (const item of botResponses) {
    if (item.pattern.test(userMessage)) {
      return item.response;
    }
  }

  // Handle general sentiment analysis questions
  if (/sentiment analysis|news sentiment|how.*sentiment/i.test(userMessage)) {
    return "I analyze news sentiment by processing recent financial news articles, social media trends, and analyst reports. My sentiment score ranges from -1.0 (extremely negative) to 1.0 (extremely positive) and helps predict potential stock movement based on market perception. Would you like sentiment analysis for a specific stock?";
  }

  // Handle real-time data questions
  if (/real-?time|live|current prices?/i.test(userMessage)) {
    return "I can provide real-time price data for stocks with frequent updates throughout trading sessions. Would you like me to show real-time data for a specific stock? Just mention the stock symbol or company name.";
  }

  // Handle questions about data sources
  if (/data source|where.*data|how accurate/i.test(userMessage)) {
    return "My stock data and predictions are generated from a combination of historical price patterns, technical indicators, fundamental analysis, and sentiment scoring from financial news. For a real application, this would be connected to market data providers like Alpha Vantage, Yahoo Finance, or Bloomberg API.";
  }
  
  // Handle market comparison questions
  if (/compare|difference|us vs india|india vs us/i.test(userMessage)) {
    return "The US and Indian stock markets have different characteristics. The US market is generally more tech-heavy and globally integrated, while the Indian market is experiencing rapid growth with strong domestic consumption drivers. US markets are more liquid, while Indian markets often show higher volatility but also higher growth potential in emerging sectors.";
  }

  // Default response if no pattern matches
  return "I don't have specific information about that stock or topic yet. You can ask about popular US stocks like Apple (AAPL), Microsoft (MSFT), or Indian stocks like Reliance Industries (RELIANCE.NS), TCS (TCS.NS), or HDFC Bank (HDFCBANK.NS). I can provide real-time data, historical analysis, and sentiment scores to help with investment decisions.";
}
