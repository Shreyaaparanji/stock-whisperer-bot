
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type StockData } from '@/utils/stockData';

interface StockChartProps {
  stock?: StockData;
}

const StockChart = ({ stock }: StockChartProps) => {
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
  
  // Format data to show only every 7th date label to avoid overcrowding
  const formattedData = data.map((item, index) => ({
    ...item,
    displayDate: index % 7 === 0 || index === data.length - 1 ? item.date : ''
  }));

  // Add predicted point
  const finalData = [...formattedData];
  if (predictedPrice) {
    finalData.push({
      date: 'Prediction',
      displayDate: 'Prediction',
      price: predictedPrice
    });
  }

  // Find min and max for better chart scaling
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(Math.max(...prices), predictedPrice) * 1.05;

  return (
    <Card className="h-[400px] w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>{stock.name} ({stock.symbol}) Price Chart</span>
          <span 
            className={`text-base ${stock.change >= 0 ? 'text-stock-green' : 'text-stock-red'}`}
          >
            ${stock.price.toFixed(2)} {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
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
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
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
            {stock.prediction && (
              <ReferenceLine 
                x={data.length - 1} 
                stroke="#888" 
                strokeDasharray="3 3"
                label={{ value: "Current", position: "insideBottomLeft", fill: "#888", fontSize: 11 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        
        {stock.prediction && (
          <div className="mt-2 text-sm text-center">
            <span className="mr-1">Prediction ({stock.prediction.timeFrame}):</span>
            <span className={isPredictionUp ? 'prediction-up font-semibold' : isPredictionDown ? 'prediction-down font-semibold' : ''}>
              ${stock.prediction.targetPrice.toFixed(2)}
            </span>
            <span className="ml-1 text-muted-foreground">
              (Confidence: {(stock.prediction.confidence * 100).toFixed(0)}%)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockChart;
