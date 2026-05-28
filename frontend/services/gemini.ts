import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client.
// The API key is expected to be provided by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

/**
 * Sends text to Gemini for spelling and grammar correction.
 * @param text The input text to correct.
 * @returns The corrected text.
 */
export async function correctText(text: string): Promise<string> {
  if (!text.trim()) return '';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: `You are a highly precise spell-checking and grammatical correction agent.
Accept any paragraph of text provided by the user.
Perform a rigorous check for spelling mistakes, grammatical errors, and incorrect punctuation.
Auto-correct all detected errors.
Output ONLY the corrected paragraph. Do not add any conversational filler (such as "Here is your corrected text:").
Maintain the user's original tone, context, and meaning. Do not rewrite sentences unless they are completely broken.`,
        temperature: 0.1, // Low temperature for more deterministic, focused output
      },
    });

    return response.text || '';
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to correct text. Please try again.");
  }
}
