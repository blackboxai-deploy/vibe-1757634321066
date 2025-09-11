'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VideoCard from '@/components/VideoCard';
import { VideoGeneration } from '@/types/video';
import ApiClient from '@/lib/api-client';

export default function GalleryPage() {
  const [videos, setVideos] = useState<VideoGeneration[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm, statusFilter, styleFilter]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const videoList = await ApiClient.getVideos();
      setVideos(videoList);
    } catch (error) {
      toast.error('Failed to load videos', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = [...videos];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(video => video.status === statusFilter);
    }

    // Style filter
    if (styleFilter !== 'all') {
      filtered = filtered.filter(video => video.style === styleFilter);
    }

    setFilteredVideos(filtered);
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await ApiClient.deleteVideo(videoId);
      setVideos(prev => prev.filter(video => video.id !== videoId));
      toast.success('Video deleted successfully');
    } catch (error) {
      toast.error('Failed to delete video', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const getUniqueStyles = () => {
    const styles = [...new Set(videos.map(video => video.style))];
    return styles.sort();
  };

  const getStatusCounts = () => {
    const counts = {
      all: videos.length,
      completed: videos.filter(v => v.status === 'completed').length,
      processing: videos.filter(v => v.status === 'processing').length,
      pending: videos.filter(v => v.status === 'pending').length,
      failed: videos.filter(v => v.status === 'failed').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Video Gallery</h1>
          <p className="text-muted-foreground mb-8">Browse your generated videos</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="aspect-video bg-muted rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Video Gallery</h1>
        <p className="text-muted-foreground">
          Browse and manage your AI-generated videos ({statusCounts.all} total)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search videos by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
              <SelectItem value="processing">Processing ({statusCounts.processing})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="failed">Failed ({statusCounts.failed})</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {getUniqueStyles().map((style) => (
                <SelectItem key={style} value={style} className="capitalize">
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={loadVideos} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <div className="h-8 w-8 rounded bg-muted-foreground/20"></div>
          </div>
          {videos.length === 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-4">
                Start creating your first AI video to see it here
              </p>
              <Button onClick={() => window.location.href = '/generate'}>
                Create Your First Video
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2">No matching videos</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDelete={handleDeleteVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
}