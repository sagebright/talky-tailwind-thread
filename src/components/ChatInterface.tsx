
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';
import { Message } from '@/types/chat';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const apiUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:pr92OYzD/open_ai';
    const requestBody = { message: messageText };
    const requestHeaders = {
      'Content-Type': 'application/json',
    };

    console.log('🚀 API Request Details:');
    console.log('URL:', apiUrl);
    console.log('Method: POST');
    console.log('Headers:', requestHeaders);
    console.log('Body:', JSON.stringify(requestBody, null, 2));
    console.log('Request timestamp:', new Date().toISOString());

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response Details:');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('OK:', response.ok);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response timestamp:', new Date().toISOString());

      // Clone the response to read it multiple times
      const responseClone = response.clone();
      const responseText = await responseClone.text();
      console.log('📄 Raw Response Text:', responseText);

      if (!response.ok) {
        let errorMessage = "I'm having trouble connecting right now.";
        
        switch (response.status) {
          case 400:
            errorMessage = "There was an issue with the request format. Please try again.";
            break;
          case 401:
            errorMessage = "Authentication failed. Please check your credentials.";
            break;
          case 403:
            errorMessage = "Access denied. You don't have permission to access this service.";
            break;
          case 404:
            errorMessage = "The AI service endpoint was not found. Please contact support.";
            break;
          case 429:
            errorMessage = "Too many requests. Please wait a moment before trying again.";
            break;
          case 500:
            errorMessage = "The AI service is experiencing issues. Please try again later.";
            break;
          case 502:
          case 503:
          case 504:
            errorMessage = "The AI service is temporarily unavailable. Please try again in a few minutes.";
            break;
          default:
            errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        
        console.error('❌ HTTP Error:', response.status, response.statusText);
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📋 Parsed Response Data:', data);
        console.log('🔍 Available fields in response:', Object.keys(data));
        console.log('📝 Field types:', Object.entries(data).map(([key, value]) => `${key}: ${typeof value}`));
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.log('Raw response that failed to parse:', responseText);
        throw new Error('Received invalid response format from the AI service.');
      }

      // Extract the assistant's message
      const assistantText = data.message || data.response || data.text || data.content;
      
      if (!assistantText) {
        console.warn('⚠️ No recognizable message field found in response');
        console.log('Available fields:', Object.keys(data));
        console.log('Full response object:', data);
      }

      const finalAssistantText = assistantText || 'I apologize, but I received an unexpected response format.';
      console.log('✅ Final assistant message:', finalAssistantText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: finalAssistantText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('💥 Error in sendMessage:', error);
      console.log('Error type:', error.constructor.name);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);

      let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Network connection failed. Please check your internet connection and try again.";
        console.error('🌐 Network Error - possibly offline or CORS issue');
      } else if (error.message.includes('JSON')) {
        errorMessage = "Received invalid response from the AI service. Please try again.";
        console.error('📄 JSON Parsing Error');
      } else if (error.message.includes('Authentication') || error.message.includes('credentials')) {
        errorMessage = "Authentication failed. Please refresh the page and try again.";
        console.error('🔐 Authentication Error');
      } else if (error.message.includes('not found') || error.message.includes('404')) {
        errorMessage = "AI service endpoint not found. Please contact support.";
        console.error('🔍 404 Not Found Error');
      } else if (error.message && error.message !== 'Failed to fetch') {
        errorMessage = error.message;
      }

      const errorResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
      console.log('🏁 sendMessage function completed at:', new Date().toISOString());
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
