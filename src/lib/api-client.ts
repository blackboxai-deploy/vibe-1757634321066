import { GenerationRequest, GenerationResponse, VideoGeneration } from '@/types/video';

const API_BASE_URL = typeof window !== 'undefined' 
  ? '' 
  : 'http://localhost:3000';

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async generateVideo(request: GenerationRequest): Promise<GenerationResponse> {
    return this.request<GenerationResponse>('/generate-video', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getVideoStatus(id: string): Promise<GenerationResponse> {
    return this.request<GenerationResponse>(`/video-status/${id}`);
  }

  static async getVideos(): Promise<VideoGeneration[]> {
    return this.request<VideoGeneration[]>('/videos');
  }

  static async deleteVideo(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/videos/${id}`, {
      method: 'DELETE',
    });
  }
}

export default ApiClient;