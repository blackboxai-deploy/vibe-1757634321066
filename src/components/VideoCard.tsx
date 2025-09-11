'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoGeneration } from '@/types/video';
import { formatDuration } from '@/lib/video-utils';

interface VideoCardProps {
  video: VideoGeneration;
  onDelete?: (id: string) => void;
}

export default function VideoCard({ video, onDelete }: VideoCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(video.id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (!video.videoUrl) return;
    
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.download = `video_${video.id}.mp4`;
    link.click();
  };

  const getStatusColor = () => {
    switch (video.status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500 animate-pulse';
      case 'pending':
        return 'bg-yellow-500 animate-pulse';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (video.status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg line-clamp-1" title={video.prompt}>
            {video.prompt}
          </CardTitle>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-xs ml-2 flex-shrink-0"
          >
            <div className={`h-2 w-2 rounded-full ${getStatusColor()}`}></div>
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {formatDuration(video.duration)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {video.aspectRatio}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {video.style}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Video Preview */}
        <div className="mb-4">
          {video.status === 'completed' && video.videoUrl ? (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden group-hover:shadow-md transition-shadow">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/21e71da5-d7ec-4603-bc24-0ba6b1c187c8.png"
              >
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              {video.status === 'processing' && (
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Processing video...</p>
                </div>
              )}
              
              {video.status === 'pending' && (
                <div className="text-center">
                  <div className="h-8 w-8 bg-muted-foreground/20 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <p className="text-sm text-muted-foreground">Queued for processing</p>
                </div>
              )}
              
              {video.status === 'failed' && (
                <div className="text-center text-red-500">
                  <div className="h-8 w-8 border-2 border-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-sm">!</span>
                  </div>
                  <p className="text-sm">Generation failed</p>
                  {video.error && (
                    <p className="text-xs text-red-400 mt-1">{video.error}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
          {video.processingTime && (
            <div className="flex justify-between">
              <span>Processing time:</span>
              <span>{Math.round(video.processingTime / 1000)}s</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {video.status === 'completed' && video.videoUrl && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(video.videoUrl, '_blank')}
                className="flex-1"
              >
                View Full Screen
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="flex-1"
              >
                Download
              </Button>
            </>
          )}
          
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3"
            >
              {isDeleting ? '...' : 'Delete'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}