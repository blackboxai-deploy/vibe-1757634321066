'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import VideoGenerationForm from '@/components/VideoGenerationForm';
import VideoHistory from '@/components/VideoHistory';
import { VideoGeneration } from '@/types/video';

export default function GeneratePage() {
  const [recentVideos, setRecentVideos] = useState<VideoGeneration[]>([]);

  const handleGenerationStart = (_id: string) => {
    toast.success('Video generation started!', {
      description: 'We\'ll notify you when your video is ready.',
    });
  };

  const handleGenerationComplete = (id: string, videoUrl: string) => {
    toast.success('Video generated successfully!', {
      description: 'Your video is ready to download.',
      action: {
        label: 'View',
        onClick: () => window.open(videoUrl, '_blank'),
      },
    });

    // Update recent videos list
    setRecentVideos(prev => {
      const updatedVideos = prev.map(video =>
        video.id === id
          ? { ...video, status: 'completed' as const, videoUrl, updatedAt: new Date() }
          : video
      );
      return updatedVideos;
    });
  };

  const handleError = (error: string) => {
    toast.error('Generation failed', {
      description: error,
    });
  };

  return (
    <div className="py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Generate AI Video</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create stunning videos from your imagination using advanced AI technology. 
          Simply describe what you want to see and let our AI bring it to life.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main generation form */}
        <div className="lg:col-span-2">
          <VideoGenerationForm
            onGenerationStart={handleGenerationStart}
            onGenerationComplete={handleGenerationComplete}
            onError={handleError}
          />
        </div>

        {/* History sidebar */}
        <div className="lg:col-span-1">
          <VideoHistory videos={recentVideos} />
        </div>
      </div>
    </div>
  );
}