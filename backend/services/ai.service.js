import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  static async generateText(prompt) {
    const apiKey = process.env.GEMMA_API_KEY;
    const apiUrl = process.env.GEMMA_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';

    if (!apiKey) {
      throw new Error('Missing Gemma API Key');
    }

    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'google/gemma-3-27b-it',
          messages: [
            {
              role: 'system',
              content: 'You are a professional nutritionist. Return ONLY structured JSON. No explanation. No markdown.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      throw new Error('Failed to generate diet plan from AI');
    }
  }

  static async chat(messages, context = '') {
    const apiKey = process.env.GEMMA_API_KEY;
    const apiUrl = process.env.GEMMA_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';

    const systemPrompt = `
      You are an AI Health & Nutrition Coach. 
      CONTEXT: ${context || 'General nutritional advice.'}
      
      INSTRUCTIONS:
      - Provide expert, supportive, and concise advice.
      - Base your answers on the provided nutritional protocol context.
      - If NO active protocol exists (context is empty), acknowledge the user's stored Bio-Identity/Goal and explain how you can help them once a plan is active.
      - Keep responses under 4 sentences to save on tokens.
      - Never give medical advice, only nutritional and lifestyle suggestions.
    `;

    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'google/gemma-3-27b-it',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          temperature: 0.8,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI Chat Service Error:', error.response?.data || error.message);
      throw new Error('AI Coach is temporarily unavailable');
    }
  }
}
