
import React, { useState } from 'react';
import StockSearch from '@/components/StockSearch';
import StockChart from '@/components/StockChart';
import ChatInterface from '@/components/ChatInterface';
import PredictionCard from '@/components/PredictionCard';
import SentimentAnalysis from '@/components/SentimentAnalysis';
import { getStockBySymbol, getStocksByMarket, type StockData } from '@/utils/stockData';
import { ChartBar, Sparkles, BarChart2, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<StockData | undefined>();
  const [selectedMarket, setSelectedMarket] = useState<'US' | 'India'>('US');

  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
    setSelectedMarket(stock.market);
  };

  const handleStockMentioned = (symbol: string) => {
    const stock = getStockBySymbol(symbol);
    if (stock) {
      setSelectedStock(stock);
      setSelectedMarket(stock.market);
    }
  };
  
  const handleMarketSelect = (market: 'US' | 'India') => {
    setSelectedMarket(market);
    
    // If no stock is selected or the current stock is not from the selected market,
    // select the first stock from the newly selected market
    if (!selectedStock || selectedStock.market !== market) {
      const marketStocks = getStocksByMarket(market);
      if (marketStocks.length > 0) {
        setSelectedStock(marketStocks[0]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-stock-blue text-white py-4 px-6 shadow-md">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-stock-lightblue" />
              <h1 className="text-2xl font-bold">Stock Whisperer</h1>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span className="text-sm">AI-Powered Stock Predictions + Sentiment Analysis</span>
              </div>
              <Tabs defaultValue={selectedMarket} onValueChange={(v) => handleMarketSelect(v as 'US' | 'India')}>
                <TabsList className="h-8 bg-blue-800">
                  <TabsTrigger 
                    value="US" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> US Market
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="India" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Indian Market
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Market Selection for Mobile */}
        <div className="md:hidden mb-4">
          <Tabs defaultValue={selectedMarket} onValueChange={(v) => handleMarketSelect(v as 'US' | 'India')}>
            <TabsList className="w-full">
              <TabsTrigger value="US" className="flex-1">US Market</TabsTrigger>
              <TabsTrigger value="India" className="flex-1">Indian Market</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <StockSearch onSelectStock={handleSelectStock} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Chart and Prediction Section */}
          <div className="xl:col-span-2 space-y-6">
            <StockChart stock={selectedStock} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <PredictionCard stock={selectedStock} />
              </div>
              <div className="md:col-span-1">
                <SentimentAnalysis stock={selectedStock} />
              </div>
              <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-2">Investment Insights</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {selectedStock 
                    ? `${selectedStock.name} (${selectedStock.symbol}) shows ${
                        selectedStock.prediction.direction === 'up' 
                          ? 'positive momentum with strong fundamentals' 
                          : selectedStock.prediction.direction === 'down'
                            ? 'concerning trends with potential downside risk'
                            : 'mixed signals with unclear directional bias'
                      }.`
                    : 'Select a stock to see detailed investment insights and recommendations.'}
                </p>
                {selectedStock && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      <span className="block text-gray-500 mb-1">Risk Level</span>
                      <span className="font-medium">
                        {selectedStock.prediction.confidence > 0.7 
                          ? 'Lower' 
                          : selectedStock.prediction.confidence > 0.5 
                            ? 'Moderate' 
                            : 'Higher'}
                      </span>
                    </div>
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      <span className="block text-gray-500 mb-1">Suggested Action</span>
                      <span className="font-medium">
                        {selectedStock.prediction.direction === 'up' 
                          ? 'Consider Buy' 
                          : selectedStock.prediction.direction === 'down'
                            ? 'Consider Sell'
                            : 'Hold/Monitor'}
                      </span>
                    </div>
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      <span className="block text-gray-500 mb-1">News Sentiment</span>
                      <span className={`font-medium ${
                        selectedStock.sentiment.score >= 0.6 ? 'text-stock-green' : 
                        selectedStock.sentiment.score >= 0.4 ? 'text-amber-500' : 
                        'text-stock-red'
                      }`}>
                        {selectedStock.sentiment.score >= 0.6 ? 'Positive' : 
                         selectedStock.sentiment.score >= 0.4 ? 'Neutral' : 
                         'Negative'}
                      </span>
                    </div>
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      <span className="block text-gray-500 mb-1">Market</span>
                      <span className="font-medium">{selectedStock.market}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="xl:col-span-1 h-[700px]">
            <ChatInterface 
              onStockMentioned={handleStockMentioned} 
              onMarketSelect={handleMarketSelect}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <p className="font-medium mb-1">Disclaimer</p>
          <p>
            The Stock Whisperer Bot provides predictions and sentiment analysis for demonstration purposes only. 
            All predictions are based on historical data and simulated analysis. 
            This application does not provide actual financial advice. 
            Always consult a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </main>

      <footer className="bg-gray-100 border-t py-6 mt-8">
        <div className="container max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Stock Whisperer Bot - Enhanced with real-time data, historical analysis, and sentiment scoring
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
