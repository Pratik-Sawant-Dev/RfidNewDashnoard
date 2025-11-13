/**
 * OpenAI Utility Functions
 * Helper functions for OpenAI integration
 */

/**
 * Format conversation history for API
 * @param {Array} messages - Array of message objects
 * @returns {Array} Formatted messages for OpenAI API
 */
export const formatConversationHistory = (messages) => {
  return messages
    .filter(msg => msg.sender !== 'system') // Exclude system messages
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));
};

/**
 * Truncate messages to fit token limit
 * @param {Array} messages - Array of message objects
 * @param {number} maxMessages - Maximum number of messages to keep
 * @returns {Array} Truncated messages
 */
export const truncateMessages = (messages, maxMessages = 10) => {
  return messages.slice(-maxMessages);
};

/**
 * Estimate token count (rough approximation)
 * @param {string} text - Text to estimate
 * @returns {number} Estimated token count
 */
export const estimateTokens = (text) => {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
};

/**
 * Check if API key is valid format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid format
 */
export const isValidApiKeyFormat = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  // OpenAI API keys typically start with 'sk-'
  return apiKey.startsWith('sk-') && apiKey.length > 20;
};

/**
 * Sanitize user input
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  // Remove excessive whitespace and trim
  return input.trim().replace(/\s+/g, ' ');
};

/**
 * Extract error message from API error
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const extractErrorMessage = (error) => {
  if (!error) {
    return 'Unknown error occurred';
  }

  const message = error.message || error.toString();

  // Map common error codes to user-friendly messages
  if (message.includes('401') || message.includes('Invalid API key')) {
    return 'Invalid API key. Please check your configuration.';
  }
  if (message.includes('429') || message.includes('rate limit')) {
    return 'Rate limit exceeded. Please try again in a moment.';
  }
  if (message.includes('500') || message.includes('server error')) {
    return 'OpenAI server error. Please try again later.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  return message;
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Function result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication errors
      if (error.message?.includes('401') || error.message?.includes('Invalid API key')) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

export default {
  formatConversationHistory,
  truncateMessages,
  estimateTokens,
  isValidApiKeyFormat,
  sanitizeInput,
  extractErrorMessage,
  retryWithBackoff,
};

