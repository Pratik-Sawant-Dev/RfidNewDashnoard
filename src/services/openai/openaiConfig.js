/**
 * OpenAI Configuration
 * Centralized configuration for OpenAI integration
 */

export const openAIConfig = {
  // API Configuration
  model: 'gpt-3.5-turbo', // Options: 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'
  temperature: 0.7, // Controls randomness (0-2)
  maxTokens: 500, // Maximum tokens in response
  topP: 1, // Nucleus sampling parameter
  frequencyPenalty: 0, // Reduces repetition (-2 to 2)
  presencePenalty: 0, // Encourages new topics (-2 to 2)

  // System Prompt
  systemPrompt: `You are a helpful assistant for an RFID Jewelry Management System. 
You help users with:
- Dashboard navigation and statistics
- Product and inventory management
- RFID tag management
- Invoice creation and management
- Generating reports
- System features and functionality

Keep responses concise, friendly, and professional. Focus on helping users navigate the system efficiently.
If you don't know something specific about the system, suggest they check the relevant section or contact support.

Always be helpful and provide actionable advice.`,

  // Features
  features: {
    enableTypingIndicator: true,
    enableFallbackResponse: true,
    enableErrorRetry: true,
    maxRetries: 3,
    retryDelay: 1000, // milliseconds
  },

  // UI Settings
  ui: {
    typingDelay: 1000, // Simulated typing delay (ms)
    minTypingDelay: 500,
    maxTypingDelay: 2000,
  },
};

export default openAIConfig;

