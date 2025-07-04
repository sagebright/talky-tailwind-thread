
import React from 'react';
import { Bot } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-2 max-w-[80%]">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="bg-white text-gray-900 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
