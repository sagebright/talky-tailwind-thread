
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';
import { useChat } from '@/hooks/useChat';

const ChatInterface = () => {
  const { messages, isLoading, messagesEndRef, sendMessage } = useChat();

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
