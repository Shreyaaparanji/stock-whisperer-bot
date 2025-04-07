
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Frown, Meh, TrendingUp, TrendingDown, Minus, BarChart2, Clock } from 'lucide-react';
import { type StockData } from '@/utils/stockData';

interface PredictionCardProps {
  stock?: StockData;
}

const PredictionCard = ({ stock }: PredictionCardProps) => {
  if (!stock) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Stock Prediction</CardTitle>
          <CardDescription>Select a stock to view prediction</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No stock selected</p>
        </CardContent>
      </Card>
    );
  }

  const { prediction, sentiment } = stock;
  const currentPrice = stock.price;
  const targetPrice = prediction.targetPrice;
  const percentChange = ((targetPrice - currentPrice) / currentPrice) * 100;
  
  let directionIcon;
  let directionColor;
  let sentimentIcon;
  
  if (prediction.direction === 'up') {
    directionIcon = <TrendingUp className="h-6 w-6" />;
    directionColor = 'text-stock-green';
    sentimentIcon = <Smile className="h-6 w-6 text-stock-green" />;
  } else if (prediction.direction === 'down') {
    directionIcon = <TrendingDown className="h-6 w-6" />;
    directionColor = 'text-stock-red';
    sentimentIcon = <Frown className="h-6 w-6 text-stock-red" />;
  } else {
    directionIcon = <Minus className="h-6 w-6" />;
    directionColor = 'text-gray-500';
    sentimentIcon = <Meh className="h-6 w-6 text-gray-500" />;
  }

  const confidenceLevel = prediction.confidence * 100;
  let confidenceText;
  
  if (confidenceLevel >= 75) {
    confidenceText = 'High Confidence';
  } else if (confidenceLevel >= 50) {
    confidenceText = 'Moderate Confidence';
  } else {
    confidenceText = 'Low Confidence';
  }

  // Get market currency symbol
  const currencySymbol = stock.market === 'India' ? '₹' : '$';
  
  // Sentiment color based on score
  const sentimentScore = sentiment.score;
  let sentimentColor;
  let sentimentText;
  
  if (sentimentScore >= 0.6) {
    sentimentColor = 'text-stock-green';
    sentimentText = 'Bullish';
  } else if (sentimentScore >= 0.4) {
    sentimentColor = 'text-amber-500';
    sentimentText = 'Neutral';
  } else {
    sentimentColor = 'text-stock-red';
    sentimentText = 'Bearish';
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{stock.symbol} Prediction</span>
          <span className="flex items-center gap-1">{sentimentIcon}</span>
        </CardTitle>
        <CardDescription>
          {prediction.timeFrame} price forecast
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Price:</span>
            <span className="font-medium">{currencySymbol}{currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Target Price:</span>
            <span className={`font-bold ${directionColor}`}>
              {currencySymbol}{targetPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Potential Change:</span>
            <span className={`font-medium flex items-center gap-1 ${directionColor}`}>
              {directionIcon}
              {percentChange >= 0 ? '+' : ''}
              {percentChange.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Market Sentiment:</span>
            <span className={`font-medium ${sentimentColor}`}>
              {sentimentText} ({sentimentScore.toFixed(2)})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <div className="flex items-center">
              <div className="h-2 w-24 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-2 bg-primary rounded-full" 
                  style={{ width: `${confidenceLevel}%` }}
                ></div>
              </div>
              <span className="text-sm">{confidenceText} ({confidenceLevel.toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
        <span>Based on technical & sentiment analysis</span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Real-time
        </span>
      </CardFooter>
    </Card>
  );
};

export default PredictionCard;
