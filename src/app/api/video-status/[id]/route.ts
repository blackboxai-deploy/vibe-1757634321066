import { NextRequest, NextResponse } from 'next/server';
import { videoDb } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Find video by ID
    const video = videoDb.findById(videoId);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Return status information
    const response = {
      id: video.id,
      status: video.status,
      videoUrl: video.videoUrl,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      processingTime: video.processingTime,
      error: video.error,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Video status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}