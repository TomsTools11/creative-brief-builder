import { GoogleGenAI, Type } from '@google/genai';
import type { Handler } from '@netlify/functions';

interface ImageData {
  base64Data: string;
  mimeType: string;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    visualStyle: {
      type: Type.OBJECT,
      properties: {
        colorPalette: {
          type: Type.OBJECT,
          properties: {
            primary: { type: Type.STRING },
            secondary: { type: Type.ARRAY, items: { type: Type.STRING } },
            accent: { type: Type.STRING },
          },
        },
        typography: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING },
            hierarchy: { type: Type.STRING },
          },
        },
        layoutPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
        visualMotifs: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    brandVoice: {
      type: Type.OBJECT,
      properties: {
        tone: { type: Type.STRING },
        personality: { type: Type.ARRAY, items: { type: Type.STRING } },
        emotionalAppeal: { type: Type.STRING },
      },
    },
    messaging: {
      type: Type.OBJECT,
      properties: {
        keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
        callToActionStyle: { type: Type.STRING },
        valueProposition: { type: Type.STRING },
      },
    },
    targetAudience: {
      type: Type.OBJECT,
      properties: {
        inferredDemographic: { type: Type.STRING },
        psychographics: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    recommendations: {
      type: Type.OBJECT,
      properties: {
        doThis: { type: Type.ARRAY, items: { type: Type.STRING } },
        avoidThis: { type: Type.ARRAY, items: { type: Type.STRING } },
        contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
  },
};

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error: API key not configured' }),
    };
  }

  try {
    const { images } = JSON.parse(event.body || '{}') as { images: ImageData[] };

    if (!images || !Array.isArray(images) || images.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No images provided' }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const parts = images.map((img) => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64Data,
      },
    }));

    const promptText = `
      Analyze these marketing assets to create a comprehensive creative brief.
      Extract the visual style, brand voice, messaging strategy, and target audience.
      Provide actionable recommendations for future content creation that aligns with this style.

      For the color palette, return specific Hex codes found in the images.
      For typography, describe the style (e.g., 'Modern Sans-Serif', 'Classic Serif').
    `;

    const contents = {
      parts: [
        ...parts,
        { text: promptText }
      ]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        systemInstruction: "You are a world-class Creative Director and Brand Strategist. Your goal is to reverse-engineer a creative brief from existing visual assets."
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error('No response generated');
    }

    const data = JSON.parse(textResponse);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        meta: {
          analyzedAt: new Date().toISOString(),
          imageCount: images.length,
        },
      }),
    };
  } catch (error) {
    console.error('Gemini Analysis Failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to analyze images',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
