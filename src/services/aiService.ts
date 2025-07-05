
export const sendMessageToAI = async (messageText: string): Promise<string> => {
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

  // Extract the assistant's message from the flat response
  let assistantText;
  try {
    assistantText = data.message;
    console.log('🎯 Assistant text (from data.message):', assistantText);
  } catch (extractionError) {
    console.error('❌ Error extracting text from response:', extractionError);
    console.log('Available response structure:', data);
  }
  
  if (!assistantText) {
    console.warn('⚠️ No text found at data.message');
    console.log('Available fields:', Object.keys(data));
    console.log('Full response object:', data);
  }

  const finalAssistantText = assistantText || 'I apologize, but I received an unexpected response format.';
  console.log('✅ Final assistant message:', finalAssistantText);

  return finalAssistantText;
};
