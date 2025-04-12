
import { pipeline, env } from '@huggingface/transformers';

// Configure the library to use WebGPU acceleration if available
env.useBrowserCache = true;
env.allowLocalModels = false;

// Models to be used
const SENTIMENT_MODEL = 'finiteautomata/bertweet-base-sentiment-analysis';
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
    return result[0];
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return { label: 'neutral', score: 0.5 };
  }
};

/**
 * Generate stock market related text response
 */
export const generateStockResponse = async (prompt: string) => {
  try {
    // Prepare a stock-focused prompt
    const enhancedPrompt = `As a stock market expert, ${prompt}`;
    
    if (!generationPipeline) {
      if (modelLoadStatus.generation === 'not_loaded') {
        modelLoadStatus.generation = 'loading';
        generationPipeline = await pipeline('text-generation', TEXT_GENERATION_MODEL);
        modelLoadStatus.generation = 'loaded';
      } else if (modelLoadStatus.generation === 'loading') {
        return "I'm currently loading my knowledge base. Please try again in a moment.";
      }
    }
    
    const result = await generationPipeline(enhancedPrompt, {
      max_length: 100,
      temperature: 0.7,
      top_p: 0.9,
    });
    
    // Clean up the generated text
    let generatedText = result[0].generated_text;
    generatedText = generatedText.replace(enhancedPrompt, '').trim();
    
    return generatedText || "I don't have enough information to provide a good answer to that question.";
  } catch (error) {
    console.error('Error in text generation:', error);
    return "I'm having trouble processing your request right now. Let me get back to you.";
  }
};

/**
 * Process chat message and get AI-enhanced response
 */
export const processMessage = async (message: string) => {
  try {
    // Analyze sentiment of the user's message
    const sentiment = await analyzeSentiment(message);
    
    // Generate response based on user query
    const responseText = await generateStockResponse(message);
    
    // Extract potential stock symbols from message
    const stockSymbolRegex = /\b[A-Z]{1,5}(?:\.NS)?\b/g;
    const potentialSymbols = message.match(stockSymbolRegex) || [];
    
    return {
      text: responseText,
      sentiment: sentiment,
      detectedSymbols: potentialSymbols,
      usedAI: true
    };
  } catch (error) {
    console.error('Error processing message with AI:', error);
    return {
      text: "I apologize, but I'm having trouble analyzing your request right now. Could you please try again?",
      sentiment: { label: 'neutral', score: 0.5 },
      detectedSymbols: [],
      usedAI: false
    };
  }
};

// Preload the models when this module is imported
initializeAIModels().catch(console.error);

export const getModelLoadingStatus = () => modelLoadStatus;

