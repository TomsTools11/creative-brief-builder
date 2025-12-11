import { CreativeBrief, ProcessedImage } from '../types';

export const generateCreativeBrief = async (images: ProcessedImage[]): Promise<CreativeBrief> => {
  try {
    const imageData = images.map((img) => ({
      base64Data: img.base64Data,
      mimeType: img.mimeType,
    }));

    const response = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images: imageData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data as CreativeBrief;

  } catch (error) {
    console.error('Analysis Failed:', error);
    throw error;
  }
};
