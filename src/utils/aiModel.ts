
import { pipeline, env } from '@huggingface/transformers';
import { getStockBySymbol } from './stockData';

// Configure the library to use WebGPU acceleration if available
env.useBrowserCache = true;
env.allowLocalModels = false;

// Models to be used - switching to more reliable models that work better in the browser
const SENTIMENT_MODEL = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
const TEXT_GENERATION_MODEL = 'Xenova/distilgpt2'; // Using a small model for browser compatibility

// Initialize pipelines - these will be loaded on-demand
let sentimentPipeline: any = null;
let generationPipeline: any = null;

// Status tracking
let modelLoadStatus = {
  sentiment: 'not_loaded',
  generation: 'not_loaded'
};

/**
 * Initialize the AI models (can be called early to preload models)
 */
export const initializeAIModels = async () => {
  try {
    console.log('Starting AI model initialization...');
    
    // Load sentiment analysis model
    if (!sentimentPipeline) {
      modelLoadStatus.sentiment = 'loading';
      sentimentPipeline = await pipeline('sentiment-analysis', SENTIMENT_MODEL);
      modelLoadStatus.sentiment = 'loaded';
      console.log('Sentiment model loaded successfully');
    }
    
    // Load text generation model
    if (!generationPipeline) {
      modelLoadStatus.generation = 'loading';
      generationPipeline = await pipeline('text-generation', TEXT_GENERATION_MODEL);
      modelLoadStatus.generation = 'loaded';
      console.log('Generation model loaded successfully');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing AI models:', error);
    return { success: false, error };
  }
};

/**
 * Analyze sentiment of text
 */
export const analyzeSentiment = async (text: string) => {
  try {
    if (!sentimentPipeline) {
      if (modelLoadStatus.sentiment === 'not_loaded') {
        modelLoadStatus.sentiment = 'loading';
        sentimentPipeline = await pipeline('sentiment-analysis', SENTIMENT_MODEL);
        modelLoadStatus.sentiment = 'loaded';
      } else if (modelLoadStatus.sentiment === 'loading') {
        return { label: 'neutral', score: 0.5 }; // Default while loading
      }
    }
    
    const result = await sentimentPipeline(text);
    // Normalize the sentiment score to a -1 to 1 range
    let normalizedScore = 0.5;
    if (result[0].label === 'POSITIVE') {
      normalizedScore = 0.5 + (result[0].score / 2);
    } else if (result[0].label === 'NEGATIVE') {
      normalizedScore = 0.5 - (result[0].score / 2);
    }
    
    return { 
      label: result[0].label.toLowerCase(), 
      score: normalizedScore 
    };
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return { label: 'neutral', score: 0.5 };
  }
};

/**
 * Generate stock market related text response with future trend analysis
 */
export const generateStockResponse = async (prompt: string) => {
  try {
    // Prepare a stock-focused prompt with trend analysis emphasis
    const enhancedPrompt = `As a stock market expert focusing on future trends and predictions, ${prompt}`;
    
    if (!generationPipeline) {
      if (modelLoadStatus.generation === 'not_loaded') {
        modelLoadStatus.generation = 'loading';
        generationPipeline = await pipeline('text-generation', TEXT_GENERATION_MODEL);
        modelLoadStatus.generation = 'loaded';
      } else if (modelLoadStatus.generation === 'loading') {
        return "I'm currently loading my predictive models. Please try again in a moment.";
      }
    }
    
    const result = await generationPipeline(enhancedPrompt, {
      max_length: 150, // Increased for more detailed predictions
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.2, // Reduce repetition in predictions
    });
    
    // Clean up the generated text
    let generatedText = result[0].generated_text;
    generatedText = generatedText.replace(enhancedPrompt, '').trim();
    
    return generatedText || "I don't have enough information to provide a prediction for that query.";
  } catch (error) {
    console.error('Error in text generation:', error);
    return "I'm having trouble with my predictive models right now. Let me get back to you.";
  }
};

/**
 * Generate future market trend prediction based on real-time data, sentiment and historical patterns
 */
export const predictFutureTrends = async (stockSymbol: string, timeframe: string = 'short-term') => {
  try {
    // Get real-time stock data for the symbol
    const stockData = await getStockBySymbol(stockSymbol);
    
    if (!stockData) {
      throw new Error(`Could not fetch data for ${stockSymbol}`);
    }
    
    // Create a prompt specifically for trend prediction using real data
    const predictionPrompt = `
      Based on current data for ${stockSymbol} (${stockData.name}):
      - Current price: ${stockData.price}
      - Recent change: ${stockData.change > 0 ? '+' : ''}${stockData.change} (${stockData.changePercent}%)
      - Market sentiment score: ${stockData.sentiment.score.toFixed(2)}
      - ${stockData.sentiment.analysis}
      
      Predict ${timeframe} future trends for ${stockSymbol} considering the above metrics, technical analysis patterns, and recent market conditions.
    `;
    
    const prediction = await generateStockResponse(predictionPrompt);
    
    return {
      symbol: stockSymbol,
      timeframe: timeframe,
      prediction: prediction,
      generatedAt: new Date().toISOString(),
      currentPrice: stockData.price,
      recentChange: stockData.change,
      sentimentScore: stockData.sentiment.score
    };
  } catch (error) {
    console.error('Error in trend prediction:', error);
    return {
      symbol: stockSymbol,
      timeframe: timeframe,
      prediction: "Unable to generate trend prediction due to data access issues.",
      generatedAt: new Date().toISOString(),
    };
  }
};

/**
 * Process chat message and get AI-enhanced response with trend predictions
 * using real-time market data
 */
export const processMessage = async (message: string) => {
  try {
    // Analyze sentiment of the user's message
    const sentiment = await analyzeSentiment(message);
    
    // Extract potential stock symbols from message
    const stockSymbolRegex = /\b[A-Z]{1,5}(?:\.NS)?\b/g;
    const potentialSymbols = message.match(stockSymbolRegex) || [];
    
    // Check if any symbols exist in our data
    let validSymbols = [];
    for (const symbol of potentialSymbols) {
      const stockExists = await getStockBySymbol(symbol);
      if (stockExists) {
        validSymbols.push(symbol);
      }
    }
    
    // Enhance prompt with real-time data if available
    let enhancedPrompt = message;
    if (validSymbols.length > 0) {
      const stockData = await getStockBySymbol(validSymbols[0]);
      if (stockData) {
        enhancedPrompt = `
          Regarding ${stockData.name} (${stockData.symbol}):
          - Current price: ${stockData.price}
          - Recent change: ${stockData.change > 0 ? '+' : ''}${stockData.change} (${stockData.changePercent}%)
          - Market sentiment: ${stockData.sentiment.score > 0.6 ? 'Positive' : stockData.sentiment.score > 0.4 ? 'Neutral' : 'Negative'}
          
          User query: ${message}
        `;
      }
    }
    
    // Generate response based on user query with enhanced data
    const responseText = await generateStockResponse(enhancedPrompt);
    
    // Check if the message is asking about future trends or predictions
    const isTrendQuery = /\b(future|trend|predict|forecast|outlook|will.*go|price.*target)\b/i.test(message);
    
    let trendPrediction = null;
    if (isTrendQuery && validSymbols.length > 0) {
      // Only generate trend prediction if explicitly asked and a symbol is detected
      const timeframeMatch = message.match(/\b(short|long|medium)\s*(?:term)?\b/i);
      const timeframe = timeframeMatch ? `${timeframeMatch[1].toLowerCase()}-term` : 'short-term';
      
      trendPrediction = await predictFutureTrends(validSymbols[0], timeframe);
    }
    
    return {
      text: responseText,
      sentiment: sentiment,
      detectedSymbols: validSymbols,
      trendPrediction: trendPrediction,
      usedAI: true,
      usedRealTimeData: validSymbols.length > 0
    };
  } catch (error) {
    console.error('Error processing message with AI:', error);
    return {
      text: "I apologize, but I'm having trouble analyzing your request with the latest market data. Could you please try again?",
      sentiment: { label: 'neutral', score: 0.5 },
      detectedSymbols: [],
      trendPrediction: null,
      usedAI: false,
      usedRealTimeData: false
    };
  }
};

// Preload the models when this module is imported
initializeAIModels().catch(console.error);

export const getModelLoadingStatus = () => modelLoadStatus;
