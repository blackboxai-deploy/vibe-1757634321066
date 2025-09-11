'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoGeneration } from '@/types/video';
import { formatDuration } from '@/lib/video-utils';

interface VideoHistoryProps {
  videos: VideoGeneration[];
}

export default function VideoHistory({ videos }: VideoHistoryProps) {
  const getStatusColor = (status: VideoGeneration['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: VideoGeneration['status']) => {
    switch (status) {
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

  if (videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <div className="h-6 w-6 rounded bg-muted-foreground/20"></div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">No videos yet</p>
            <p className="text-xs text-muted-foreground">
              Your generated videos will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Videos ({videos.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videos.slice(0, 10).map((video) => (
          <div
            key={video.id}
            className="border rounded-lg p-3 space-y-3 hover:shadow-sm transition-shadow"
          >
            {/* Status and timestamp */}
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                <div className={`h-2 w-2 rounded-full ${getStatusColor(video.status)}`}></div>
                {getStatusText(video.status)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(video.createdAt).toLocaleTimeString()}
              </span>
            </div>

            {/* Prompt preview */}
            <p className="text-sm line-clamp-2" title={video.prompt}>
              {video.prompt}
            </p>

            {/* Video details */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {formatDuration(video.duration)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {video.aspectRatio}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {video.style}
              </Badge>
            </div>

            {/* Actions */}
            {video.status === 'completed' && video.videoUrl && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => window.open(video.videoUrl, '_blank')}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = video.videoUrl!;
                    link.download = `video_${video.id}.mp4`;
                    link.click();
                  }}
                >
                  Download
                </Button>
              </div>
            )}

            {video.status === 'processing' && (
              <div className="text-xs text-muted-foreground">
                Processing... This may take several minutes.
              </div>
            )}

            {video.status === 'failed' && video.error && (
              <div className="text-xs text-red-600">
                Error: {video.error}
              </div>
            )}
          </div>
        ))}

        {videos.length > 10 && (
          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              View All Videos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}