import { AspectRatio, VideoStyle, PromptTemplate } from '@/types/video';

export const ASPECT_RATIOS: { value: AspectRatio; label: string; description: string }[] = [
  { value: '16:9', label: '16:9', description: 'Landscape - Perfect for desktop viewing' },
  { value: '9:16', label: '9:16', description: 'Portrait - Ideal for mobile and social media' },
  { value: '1:1', label: '1:1', description: 'Square - Great for social posts' },
];

export const VIDEO_STYLES: { value: VideoStyle; label: string; description: string }[] = [
  { value: 'cinematic', label: 'Cinematic', description: 'Professional movie-like quality with dramatic lighting' },
  { value: 'documentary', label: 'Documentary', description: 'Realistic and informative style' },
  { value: 'artistic', label: 'Artistic', description: 'Creative and expressive visual style' },
  { value: 'commercial', label: 'Commercial', description: 'Polished advertising style' },
  { value: 'nature', label: 'Nature', description: 'Natural outdoor cinematography' },
  { value: 'abstract', label: 'Abstract', description: 'Experimental and surreal visuals' },
  { value: 'vintage', label: 'Vintage', description: 'Retro and nostalgic aesthetic' },
  { value: 'futuristic', label: 'Futuristic', description: 'Sci-fi and modern technology themes' },
];

export const DURATION_OPTIONS = [
  { value: 2, label: '2 seconds', description: 'Quick clip' },
  { value: 4, label: '4 seconds', description: 'Short scene' },
  { value: 6, label: '6 seconds', description: 'Standard length' },
  { value: 8, label: '8 seconds', description: 'Extended scene' },
  { value: 10, label: '10 seconds', description: 'Long form' },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'sunset-beach',
    name: 'Sunset Beach',
    description: 'Serene beach sunset with gentle waves',
    prompt: 'A beautiful golden sunset over a tranquil beach with gentle waves rolling onto the shore, warm colors painting the sky',
    style: 'cinematic',
    duration: 6,
    aspectRatio: '16:9',
    category: 'nature'
  },
  {
    id: 'city-night',
    name: 'City Night',
    description: 'Urban nighttime with neon lights',
    prompt: 'A bustling city at night with neon lights reflecting on wet streets, cars passing by with light trails',
    style: 'cinematic',
    duration: 8,
    aspectRatio: '16:9',
    category: 'commercial'
  },
  {
    id: 'coffee-pour',
    name: 'Coffee Pour',
    description: 'Slow motion coffee being poured',
    prompt: 'Slow motion shot of coffee being poured into a white ceramic cup, steam rising, cozy cafe atmosphere',
    style: 'commercial',
    duration: 4,
    aspectRatio: '9:16',
    category: 'commercial'
  },
  {
    id: 'forest-walk',
    name: 'Forest Walk',
    description: 'First person walking through forest',
    prompt: 'First person view walking through a lush green forest with sunbeams filtering through tall trees',
    style: 'nature',
    duration: 10,
    aspectRatio: '16:9',
    category: 'nature'
  },
  {
    id: 'abstract-shapes',
    name: 'Abstract Shapes',
    description: 'Colorful geometric animation',
    prompt: 'Fluid abstract shapes morphing and flowing in vibrant colors against a dark background',
    style: 'abstract',
    duration: 6,
    aspectRatio: '1:1',
    category: 'abstract'
  },
  {
    id: 'vintage-car',
    name: 'Vintage Car',
    description: 'Classic car on empty road',
    prompt: 'A vintage convertible driving down an empty desert highway during golden hour, retro film aesthetic',
    style: 'vintage',
    duration: 8,
    aspectRatio: '16:9',
    category: 'commercial'
  }
];

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

export function getEstimatedProcessingTime(duration: number, style: VideoStyle): number {
  // Base processing time increases with video duration
  let baseTime = duration * 30; // 30 seconds per second of video
  
  // Different styles have different complexity
  const styleMultiplier: Record<VideoStyle, number> = {
    cinematic: 1.5,
    documentary: 1.0,
    artistic: 1.8,
    commercial: 1.3,
    nature: 1.1,
    abstract: 2.0,
    vintage: 1.2,
    futuristic: 1.6,
  };
  
  return Math.round(baseTime * styleMultiplier[style]);
}

export function generateVideoId(): string {
  return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isValidVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getVideoFileName(prompt: string, id: string): string {
  const sanitizedPrompt = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30);
  
  return `${sanitizedPrompt}_${id}.mp4`;
}