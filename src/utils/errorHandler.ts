
export const handleChatError = (error: any): string => {
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

  return errorMessage;
};
