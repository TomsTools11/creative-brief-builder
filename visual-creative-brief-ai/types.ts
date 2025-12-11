export interface ProcessedImage {
  id: string;
  name: string;
  url: string; // Base64 for display
  base64Data: string; // Raw base64 data for API (stripped prefix)
  mimeType: string;
  size: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string[];
  accent: string;
}

export interface Typography {
  style: string;
  hierarchy: string;
}

export interface VisualStyle {
  colorPalette: ColorPalette;
  typography: Typography;
  layoutPatterns: string[];
  visualMotifs: string[];
}

export interface BrandVoice {
  tone: string;
  personality: string[];
  emotionalAppeal: string;
}

export interface Messaging {
  keyThemes: string[];
  callToActionStyle: string;
  valueProposition: string;
}

export interface TargetAudience {
  inferredDemographic: string;
  psychographics: string[];
}

export interface Recommendations {
  doThis: string[];
  avoidThis: string[];
  contentIdeas: string[];
}

export interface CreativeBrief {
  meta: {
    analyzedAt: string;
    imageCount: number;
  };
  visualStyle: VisualStyle;
  brandVoice: BrandVoice;
  messaging: Messaging;
  targetAudience: TargetAudience;
  recommendations: Recommendations;
}

export type AppState = 'upload' | 'analyzing' | 'results' | 'error';
