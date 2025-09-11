import { VideoGeneration } from '@/types/video';

// In-memory storage for video generations
class VideoDatabase {
  private videos: Map<string, VideoGeneration> = new Map();

  create(video: VideoGeneration): VideoGeneration {
    this.videos.set(video.id, { ...video });
    return video;
  }

  findById(id: string): VideoGeneration | null {
    const video = this.videos.get(id);
    return video ? { ...video } : null;
  }

  findAll(): VideoGeneration[] {
    return Array.from(this.videos.values())
      .map(video => ({ ...video }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  update(id: string, updates: Partial<VideoGeneration>): VideoGeneration | null {
    const existing = this.videos.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.videos.set(id, updated);
    return { ...updated };
  }

  delete(id: string): boolean {
    return this.videos.delete(id);
  }

  findByStatus(status: VideoGeneration['status']): VideoGeneration[] {
    return Array.from(this.videos.values())
      .filter(video => video.status === status)
      .map(video => ({ ...video }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  count(): number {
    return this.videos.size;
  }

  clear(): void {
    this.videos.clear();
  }

  // Utility method to clean up old failed generations (older than 24 hours)
  cleanupOldFailures(): number {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let cleanedCount = 0;

    for (const [id, video] of this.videos.entries()) {
      if (video.status === 'failed' && new Date(video.createdAt) < oneDayAgo) {
        this.videos.delete(id);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }
}

// Create a singleton instance
export const videoDb = new VideoDatabase();

// Export the class for potential testing
export { VideoDatabase };