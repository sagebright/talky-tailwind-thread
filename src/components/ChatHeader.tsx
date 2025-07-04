
import React from 'react';
import { Bot } from 'lucide-react';

const ChatHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-gray-900">AI Assistant</h1>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
