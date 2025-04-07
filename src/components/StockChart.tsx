
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Area,
  AreaChart,
  Bar,
  BarChart,
  ComposedChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { type StockData } from '@/utils/stockData';

interface StockChartProps {
  stock?: StockData;
}

const StockChart = ({ stock }: StockChartProps) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('3M');
  const [chartType, setChartType] = useState<'line' | 'area' | 'candle'>('area');
  
  if (!stock) {
    return (
      <Card className="h-[400px] w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Stock Price Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[320px]">
          <p className="text-muted-foreground">Select a stock to view its chart</p>
        </CardContent>
      </Card>
    );
  }

  const data = stock.historicalData;
  const lastPrice = data[data.length - 1]?.price || 0;
  const predictedPrice = stock.prediction.targetPrice;
  const isPredictionUp = stock.prediction.direction === 'up';
  const isPredictionDown = stock.prediction.direction === 'down';
  
  // Filter data based on selected timeframe
  const filterDataByTimeframe = () => {
    const now = new Date();
    let filteredData = [...data];
    
    switch(timeframe) {
      case '1D':
        // Show only last day's data (or real-time if available)
        if (stock.realTimeUpdates && stock.realTimeUpdates.length > 0) {
          return stock.realTimeUpdates.map(update => ({
            date: new Date(update.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: update.price,
            displayDate: new Date(update.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        } else {
          return filteredData.slice(-1 * Math.min(8, filteredData.length));
        }
      case '1W':
        // Show last week's data
        return filteredData.slice(-1 * Math.min(5, filteredData.length));
      case '1M':
        // Show last month's data
        return filteredData.slice(-1 * Math.min(20, filteredData.length));
      case '3M':
        // Show last 3 months' data
        return filteredData.slice(-1 * Math.min(60, filteredData.length));
      case '1Y':
        // Show last year's data
        return filteredData.slice(-1 * Math.min(252, filteredData.length));
      case 'ALL':
      default:
        return filteredData;
    }
  };
  
  const chartData = filterDataByTimeframe();
  
  // Format data to show reasonable number of date labels
  const labelsToShow = Math.min(7, chartData.length);
  const labelInterval = Math.max(1, Math.floor(chartData.length / labelsToShow));
  
  const formattedData = chartData.map((item, index) => ({
    ...item,
    displayDate: index % labelInterval === 0 || index === chartData.length - 1 
      ? timeframe === '1D' 
        ? item.date 
        : new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : ''
  }));

  // Find min and max for better chart scaling
  const prices = formattedData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.98;
  const maxPrice = Math.max(Math.max(...prices), predictedPrice) * 1.02;

  // Get market currency symbol
  const currencySymbol = stock.market === 'India' ? '₹' : '$';

  // Calculate real-time update information if available
  const hasRealTimeData = stock.realTimeUpdates && stock.realTimeUpdates.length > 0;
  const lastUpdate = hasRealTimeData 
    ? new Date(stock.realTimeUpdates![stock.realTimeUpdates!.length - 1].lastUpdate) 
    : null;
  const isLiveData = hasRealTimeData && 
    ((new Date().getTime() - lastUpdate!.getTime()) / (1000 * 60) < 15);

  return (
    <Card className="h-[400px] w-full">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              {stock.name} ({stock.symbol})
              {isLiveData && (
                <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Live
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm">
              {stock.market} Market • Last updated: {
                isLiveData 
                  ? `${lastUpdate!.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'End of last trading day'
              }
            </CardDescription>
          </div>
          <div className={`text-base font-medium ${stock.change >= 0 ? 'text-stock-green' : 'text-stock-red'}`}>
            {currencySymbol}{stock.price.toFixed(2)} {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Tabs defaultValue="area" className="w-[160px]" onValueChange={(v) => setChartType(v as any)}>
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="candle">Volume</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex space-x-1 text-xs">
            {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2 py-1 rounded ${
                  timeframe === t 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[275px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11 }}
                height={40}
                tickMargin={10}
              />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${currencySymbol}${value.toFixed(0)}`}
              />
              <Tooltip 
                formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#6366F1" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6 }}
              />
              {isPredictionUp && (
                <ReferenceLine 
                  y={predictedPrice} 
                  stroke="#10B981" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Target: ${currencySymbol}${predictedPrice}`,
                    position: 'insideBottomRight',
                    fill: '#10B981',
                    fontSize: 11
                  }}
                />
              )}
              {isPredictionDown && (
                <ReferenceLine 
                  y={predictedPrice} 
                  stroke="#EF4444" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Target: ${currencySymbol}${predictedPrice}`,
                    position: 'insideBottomRight',
                    fill: '#EF4444',
                    fontSize: 11
                  }}
                />
              )}
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11 }}
                height={40}
                tickMargin={10}
              />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${currencySymbol}${value.toFixed(0)}`}
              />
              <Tooltip 
                formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#6366F1" 
                fill="url(#colorPrice)" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              {isPredictionUp && (
                <ReferenceLine 
                  y={predictedPrice} 
                  stroke="#10B981" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Target: ${currencySymbol}${predictedPrice}`,
                    position: 'insideBottomRight',
                    fill: '#10B981',
                    fontSize: 11
                  }}
                />
              )}
              {isPredictionDown && (
                <ReferenceLine 
                  y={predictedPrice} 
                  stroke="#EF4444" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Target: ${currencySymbol}${predictedPrice}`,
                    position: 'insideBottomRight',
                    fill: '#EF4444',
                    fontSize: 11
                  }}
                />
              )}
            </AreaChart>
          ) : (
            <ComposedChart
              data={formattedData.map(d => ({...d, vol: d.volume || 0}))}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11 }}
                height={40}
                tickMargin={10}
              />
              <YAxis 
                yAxisId="left"
                domain={[minPrice, maxPrice]} 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${currencySymbol}${value.toFixed(0)}`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'price') return [`${currencySymbol}${value.toFixed(2)}`, 'Price'];
                  if (name === 'vol') return [`${(value/1000).toFixed(0)}K`, 'Volume'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="vol" yAxisId="right" fill="#93C5FD" opacity={0.5} />
              <Line 
                type="monotone" 
                dataKey="price" 
                yAxisId="left"
                stroke="#6366F1" 
                strokeWidth={2}
                dot={false}
              />
              <Legend />
            </ComposedChart>
          )}
        </ResponsiveContainer>
        
        {stock.prediction && (
          <div className="mt-2 text-xs text-center flex items-center justify-center gap-2">
            <span className="mr-1">Prediction ({stock.prediction.timeFrame}):</span>
            <span className={`font-semibold flex items-center gap-1 ${
              isPredictionUp ? 'prediction-up' : 
              isPredictionDown ? 'prediction-down' : ''
            }`}>
              {isPredictionUp && <TrendingUp size={14} />}
              {isPredictionDown && <TrendingDown size={14} />}
              {currencySymbol}{stock.prediction.targetPrice.toFixed(2)}
            </span>
            <span className="text-muted-foreground">
              (Confidence: {(stock.prediction.confidence * 100).toFixed(0)}%)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockChart;
