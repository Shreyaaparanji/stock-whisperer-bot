
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { type StockData } from '@/utils/stockData';
import { 
  Tooltip,
  TooltipContent, 
  TooltipTrigger
} from '@/components/ui/tooltip';

interface SentimentAnalysisProps {
  stock?: StockData;
}

const SentimentAnalysis = ({ stock }: SentimentAnalysisProps) => {
  if (!stock) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Select a stock to view sentiment analysis</p>
        </CardContent>
      </Card>
    );
  }

  const { sentiment } = stock;
  const sentimentScore = sentiment.score;
  const sentimentPercentage = ((sentimentScore + 1) / 2) * 100; // Convert -1 to 1 scale to 0-100%
  
  // Determine sentiment icon and color
  let SentimentIcon;
  let sentimentColor;
  let sentimentText;
  
  if (sentimentScore >= 0.6) {
    SentimentIcon = Smile;
    sentimentColor = 'text-stock-green';
    sentimentText = 'Bullish';
  } else if (sentimentScore >= 0.4) {
    SentimentIcon = Meh;
    sentimentColor = 'text-amber-500';
    sentimentText = 'Neutral';
  } else {
    SentimentIcon = Frown;
    sentimentColor = 'text-stock-red';
    sentimentText = 'Bearish';
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Market Sentiment</span>
          <span className={`flex items-center gap-1 ${sentimentColor}`}>
            <SentimentIcon className="h-5 w-5" />
            <span>{sentimentText}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Sentiment Score</span>
              <span className={`font-medium ${sentimentColor}`}>{sentimentScore.toFixed(2)}</span>
            </div>
            <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="absolute w-full h-full flex">
                <div className="h-full bg-red-500" style={{ width: "33%" }}></div>
                <div className="h-full bg-amber-400" style={{ width: "34%" }}></div>
                <div className="h-full bg-green-500" style={{ width: "33%" }}></div>
              </div>
              <div 
                className="absolute h-full bg-black bg-opacity-20 rounded-r-full" 
                style={{ width: `${sentimentPercentage}%`, left: 0 }}
              ></div>
              <div 
                className="absolute h-4 w-1 bg-black top-1/2 -translate-y-1/2" 
                style={{ left: `${sentimentPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Analysis</span>
            </div>
            <p className="text-sm text-gray-600">{sentiment.analysis}</p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Recent News Sentiment</span>
            </div>
            <div className="space-y-2">
              {sentiment.newsItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-2 rounded-md">
                  <div className="flex items-start justify-between">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs font-medium line-clamp-2 cursor-help">{item.title}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                      item.sentiment === 'positive' ? 'bg-green-100 text-green-700' : 
                      item.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-500">{item.source}</span>
                    <span className="text-[10px] text-gray-500">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
