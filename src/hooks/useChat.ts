
import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { sendMessageToAI } from '@/services/aiService';
import { handleChatError } from '@/utils/errorHandler';

export const useChat = () => {
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

    try {
      const assistantText = await sendMessageToAI(messageText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: assistantText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = handleChatError(error);

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

  return {
    messages,
    isLoading,
    messagesEndRef,
    sendMessage,
  };
};
