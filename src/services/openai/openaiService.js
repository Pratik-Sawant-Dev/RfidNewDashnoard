/**
 * OpenAI Service
 * Handles all OpenAI API interactions for the chatbot
 */

import { retryWithBackoff, extractErrorMessage, sanitizeInput } from './openaiUtils.js';

class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-3.5-turbo'; // Can be changed to gpt-4 or other models
    this.systemPrompt = `You are a helpful assistant for an RFID Jewelry Management System. 
You help users with:
- Dashboard navigation and statistics
- Product and inventory management
- RFID tag management
- Invoice creation and management
- Generating reports
- System features and functionality

Keep responses concise, friendly, and professional. Focus on helping users navigate the system efficiently.
If you don't know something specific about the system, suggest they check the relevant section or contact support.

Always be helpful and provide actionable advice.`;
  }

  /**
   * Validate API key
   */
  validateApiKey() {
    if (!this.apiKey) {
      console.error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
      return false;
    }
    return true;
  }

  /**
   * Send message to OpenAI API
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @returns {Promise<string>} - AI response
   */
  async sendMessage(message, conversationHistory = []) {
    if (!this.validateApiKey()) {
      throw new Error('OpenAI API key is not configured');
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      throw new Error('Message cannot be empty');
    }

    // Retry with exponential backoff
    return retryWithBackoff(async () => {
      return this._sendMessageRequest(sanitizedMessage, conversationHistory);
    });
  }

  /**
   * Internal method to send message request
   * @private
   */
  async _sendMessageRequest(message, conversationHistory = []) {
    try {
      // Build conversation messages with proper formatting
      const messages = [
        { role: 'system', content: this.systemPrompt },
      ];

      // Add conversation history (last 10 messages for context)
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        });
      });

      // Add current user message
      messages.push({ role: 'user', content: message });

      console.log('Sending request to OpenAI API...', {
        model: this.model,
        messageCount: messages.length,
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: false, // Set to false for complete response
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `OpenAI API error: ${response.statusText}`;
        console.error('OpenAI API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      console.log('OpenAI API Response:', {
        model: data.model,
        usage: data.usage,
        hasChoices: data.choices && data.choices.length > 0,
      });
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const responseText = data.choices[0].message.content.trim();
        return responseText;
      } else {
        throw new Error('No response content from OpenAI');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('401') || error.message.includes('Invalid API key')) {
        throw new Error('Invalid OpenAI API key. Please check your .env file.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('500')) {
        throw new Error('OpenAI server error. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      // Re-throw with extracted error message
      throw new Error(extractErrorMessage(error));
    }
  }

  /**
   * Generate a response with fallback to local responses
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<{text: string, isFallback: boolean, error?: string}>} - AI or fallback response
   */
  async generateResponse(message, conversationHistory = []) {
    try {
      const response = await this.sendMessage(message, conversationHistory);
      return {
        text: response,
        isFallback: false,
      };
    } catch (error) {
      console.error('Failed to get OpenAI response:', error);
      // Return fallback response with error info
      return {
        text: this.getFallbackResponse(message),
        isFallback: true,
        error: error.message,
      };
    }
  }

  /**
   * Fallback response generator when OpenAI is unavailable
   * @param {string} message - User's message
   * @returns {string} - Fallback response
   */
  getFallbackResponse(message) {
    const msg = message.toLowerCase();

    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! I'm here to help you with your RFID jewelry management system. What would you like to know?";
    }

    // Dashboard queries
    if (msg.includes('dashboard') || msg.includes('stats') || msg.includes('summary')) {
      return "Your dashboard shows real-time metrics including total products, sold products, net weight, and revenue. You can also view RFID tag statistics and weight by category. Is there a specific metric you'd like to know more about?";
    }

    // Product/Inventory queries
    if (msg.includes('product') || msg.includes('inventory') || msg.includes('stock')) {
      return "You can manage your products through the Inventory section. You can add new products, view product lists, edit product details, and browse the product catalog. Would you like help with a specific inventory task?";
    }

    // RFID queries
    if (msg.includes('rfid') || msg.includes('tag')) {
      return "RFID tags help you track your jewelry items efficiently. You can add new RFID tags, view all tags, and see unused tags in the RFID Hub section. Need help with RFID management?";
    }

    // Invoice/Sales queries
    if (msg.includes('invoice') || msg.includes('sale') || msg.includes('revenue')) {
      return "You can create and manage invoices in the Invoices section. Track sales, manage customer information, and generate reports. What would you like to do with invoices?";
    }

    // Reports queries
    if (msg.includes('report') || msg.includes('analytics') || msg.includes('data')) {
      return "You can access various reports including stock movement, RFID usage, daily balance, stock verification, daily activity, stock summary, and stock transfer reports. Which report would you like to generate?";
    }

    // Help/Support
    if (msg.includes('help') || msg.includes('support') || msg.includes('guide')) {
      return "I can help you with:\n• Dashboard navigation\n• Product and inventory management\n• RFID tag management\n• Invoice creation and management\n• Generating reports\n• System features\n\nWhat would you like to know more about?";
    }

    // Default response
    return "I understand. I'm currently experiencing connection issues with the AI service, but I can still help! Could you try rephrasing your question or check your internet connection?";
  }

  /**
   * Check if OpenAI service is available
   * @returns {boolean}
   */
  isAvailable() {
    return this.validateApiKey();
  }
}

// Create and export singleton instance
const openAIService = new OpenAIService();
export default openAIService;

