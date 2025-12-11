import { GoogleGenAI, Type } from '@google/genai';
import { CreativeBrief, ProcessedImage } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const generateCreativeBrief = async (images: ProcessedImage[]): Promise<CreativeBrief> => {
  try {
    const parts = images.map((img) => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64Data,
      },
    }));

    // Add the prompt as the last part
    const promptText = `
      Analyze these marketing assets to create a comprehensive creative brief.
      Extract the visual style, brand voice, messaging strategy, and target audience.
      Provide actionable recommendations for future content creation that aligns with this style.
      
      For the color palette, return specific Hex codes found in the images.
      For typography, describe the style (e.g., 'Modern Sans-Serif', 'Classic Serif').
    `;

    // We add the text prompt to the parts array
    const contents = {
        parts: [
            ...parts,
            { text: promptText }
        ]
    }

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
        throw new Error("No response generated");
    }

    const data = JSON.parse(textResponse);
    
    // Attach metadata
    return {
      ...data,
      meta: {
        analyzedAt: new Date().toISOString(),
        imageCount: images.length,
      },
    };

  } catch (error) {
    console.error('Gemini Analysis Failed:', error);
    throw error;
  }
};
