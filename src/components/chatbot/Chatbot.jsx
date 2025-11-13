import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, AlertCircle } from 'lucide-react';
import openAIService from '../../services/openai/openaiService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your RFID Jewelry Management Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAIConnected, setIsAIConnected] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Check OpenAI availability on mount
  useEffect(() => {
    const checkAIConnection = async () => {
      const available = openAIService.isAvailable();
      setIsAIConnected(available);
    };
    checkAIConnection();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    const userInput = inputMessage;
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      // Prepare conversation history (exclude the initial welcome message)
      const conversationHistory = messages.filter(msg => msg.id !== 1).slice(-10);
      
      // Get response from OpenAI
      const response = await openAIService.generateResponse(userInput, conversationHistory);
      
      // Update AI connection status based on response
      if (!response.isFallback && !isAIConnected) {
        setIsAIConnected(true);
      }
      
      // Show error if fallback was used
      if (response.isFallback && response.error) {
        setError(response.error.includes('API key') 
          ? 'OpenAI API key not configured. Using fallback mode.' 
          : `Connection issue: ${response.error}`);
        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000);
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          isFallback: response.isFallback,
        },
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('Unexpected error. Using fallback mode...');
      
      // Use fallback response
      const fallbackResponse = generateBotResponse(userInput);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          text: fallbackResponse,
          sender: 'bot',
          timestamp: new Date(),
          isFallback: true,
        },
      ]);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you with your RFID jewelry management system. What would you like to know?";
    }

    // Dashboard queries
    if (message.includes('dashboard') || message.includes('stats') || message.includes('summary')) {
      return "Your dashboard shows real-time metrics including total products, sold products, net weight, and revenue. You can also view RFID tag statistics and weight by category. Is there a specific metric you'd like to know more about?";
    }

    // Product/Inventory queries
    if (message.includes('product') || message.includes('inventory') || message.includes('stock')) {
      return "You can manage your products through the Inventory section. You can add new products, view product lists, edit product details, and browse the product catalog. Would you like help with a specific inventory task?";
    }

    // RFID queries
    if (message.includes('rfid') || message.includes('tag')) {
      return "RFID tags help you track your jewelry items efficiently. You can add new RFID tags, view all tags, and see unused tags in the RFID Hub section. Need help with RFID management?";
    }

    // Invoice/Sales queries
    if (message.includes('invoice') || message.includes('sale') || message.includes('revenue')) {
      return "You can create and manage invoices in the Invoices section. Track sales, manage customer information, and generate reports. What would you like to do with invoices?";
    }

    // Reports queries
    if (message.includes('report') || message.includes('analytics') || message.includes('data')) {
      return "You can access various reports including stock movement, RFID usage, daily balance, stock verification, daily activity, stock summary, and stock transfer reports. Which report would you like to generate?";
    }

    // Help/Support
    if (message.includes('help') || message.includes('support') || message.includes('guide')) {
      return "I can help you with:\n• Dashboard navigation\n• Product and inventory management\n• RFID tag management\n• Invoice creation and management\n• Generating reports\n• System features\n\nWhat would you like to know more about?";
    }

    // Default response
    const responses = [
      "I understand. Could you provide more details about what you're looking for?",
      "That's interesting! Let me help you with that. Can you be more specific?",
      "I'm here to assist you. What specific feature or task would you like help with?",
      "Thanks for your question! I can help you navigate the system or answer questions about features. What would you like to know?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickActions = [
    { text: 'Show Dashboard Stats', action: 'dashboard' },
    { text: 'How to Add Products?', action: 'add-product' },
    { text: 'RFID Tag Help', action: 'rfid' },
    { text: 'Create Invoice', action: 'invoice' },
  ];

  const handleQuickAction = (action) => {
    let message = '';
    switch (action) {
      case 'dashboard':
        message = 'Show me dashboard statistics';
        break;
      case 'add-product':
        message = 'How do I add products?';
        break;
      case 'rfid':
        message = 'Help me with RFID tags';
        break;
      case 'invoice':
        message = 'How do I create an invoice?';
        break;
      default:
        message = action;
    }
    setInputMessage(message);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0077D4] to-[#D60000] text-white shadow-2xl hover:shadow-[0_8px_32px_0_rgba(0,119,212,0.4)] hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-bounce-slow"
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
          {messages.filter(m => m.sender === 'bot' && !m.read).length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
              {messages.filter(m => m.sender === 'bot' && !m.read).length}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 md:w-[420px] lg:w-[450px] transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[600px] sm:h-[650px]'
          } flex flex-col bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0077D4] to-[#D60000] p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">RFID Assistant</h3>
                <p className="text-xs text-white/80 flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${isAIConnected ? 'bg-green-300' : 'bg-yellow-300'}`}></span>
                  <span>{isAIConnected ? 'AI Powered • Online' : 'Fallback Mode • Online'}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={minimizeChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] sm:max-w-[75%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-[#0077D4] to-[#D60000]'
                            : 'bg-gradient-to-br from-[#8B3D8B] to-[#AA55AA]'
                        }`}
                      >
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className="flex flex-col">
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-br from-[#0077D4] to-[#D60000] text-white rounded-tr-sm'
                              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-tl-sm shadow-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                        </div>
                        <span
                          className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-2 ${
                            message.sender === 'user' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B3D8B] to-[#AA55AA] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {isAIConnected ? 'AI is thinking...' : 'Processing...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                        <p className="text-xs text-yellow-800 dark:text-yellow-200">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Quick actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.action)}
                        className="px-3 py-1.5 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gradient-to-r hover:from-[#0077D4]/10 hover:to-[#D60000]/10 hover:border-[#0077D4]/30 dark:hover:border-[#0077D4]/50 transition-all text-gray-700 dark:text-gray-300"
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2.5 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50 focus:border-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2.5 bg-gradient-to-br from-[#0077D4] to-[#D60000] text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;

