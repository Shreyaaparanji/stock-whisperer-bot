
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, BrainCircuit, RefreshCcw, ArrowLeft } from 'lucide-react';
import { getModelLoadingStatus, initializeAIModels } from '@/utils/aiModel';
import { Link } from 'react-router-dom';

const AIStatus = () => {
  const [modelStatus, setModelStatus] = useState({
    sentiment: 'not_loaded',
    generation: 'not_loaded'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const status = getModelLoadingStatus();
      setModelStatus(status);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await initializeAIModels();
    } catch (error) {
      console.error("Error refreshing models:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'loaded':
        return { label: 'Loaded', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'loading':
        return { label: 'Loading...', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      default:
        return { label: 'Not Loaded', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const getOverallProgress = () => {
    if (modelStatus.sentiment === 'loaded' && modelStatus.generation === 'loaded') {
      return 100;
    } else if (modelStatus.sentiment === 'loaded' || modelStatus.generation === 'loaded') {
      return 50;
    } else if (modelStatus.sentiment === 'loading' || modelStatus.generation === 'loading') {
      return 25;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-blue-600" />
              AI Model Status
            </CardTitle>
            <CardDescription>
              Monitor the loading status of Hugging Face models used by Stock Whisperer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Overall Progress</span>
                <span>{getOverallProgress()}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">Sentiment Analysis Model</div>
                  <Badge variant="outline" className={getStatusDetails(modelStatus.sentiment).color}>
                    {getStatusDetails(modelStatus.sentiment).label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Used for analyzing sentiment in market-related text and news.
                </p>
                <div className="text-xs text-gray-400">Model: finiteautomata/bertweet-base-sentiment-analysis</div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">Text Generation Model</div>
                  <Badge variant="outline" className={getStatusDetails(modelStatus.generation).color}>
                    {getStatusDetails(modelStatus.generation).label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Used for generating responses to user queries.
                </p>
                <div className="text-xs text-gray-400">Model: Xenova/distilgpt2</div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing || (modelStatus.sentiment === 'loading' || modelStatus.generation === 'loading')}
                className="w-full"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh Models
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>About the AI Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Stock Whisperer uses Hugging Face Transformers.js to run machine learning models directly in your browser. This means:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 mb-4">
              <li>All AI processing happens on your device - no data is sent to external servers</li>
              <li>The models are downloaded once when you first use the feature</li>
              <li>Processing speed depends on your device's capabilities</li>
              <li>The sentiment analysis model specializes in financial text analysis</li>
              <li>Text generation is handled by a lightweight model optimized for browser environments</li>
            </ul>
            <p className="text-sm text-gray-600">
              The models may take some time to initially load, but will be cached for faster access in future sessions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIStatus;
