export interface VideoGeneration {
  id: string;
  prompt: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  style: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  processingTime?: number;
  error?: string;
}

export interface GenerationRequest {
  prompt: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  style: string;
  advancedSettings?: {
    seed?: number;
    guidanceScale?: number;
    negativePrompt?: string;
  };
}

export interface GenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  videoUrl?: string;
  estimatedTime?: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  style: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  category: 'cinematic' | 'documentary' | 'artistic' | 'commercial' | 'nature' | 'abstract';
}

export type VideoStyle = 
  | 'cinematic'
  | 'documentary' 
  | 'artistic'
  | 'commercial'
  | 'nature'
  | 'abstract'
  | 'vintage'
  | 'futuristic';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';