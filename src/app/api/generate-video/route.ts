import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest, VideoGeneration } from '@/types/video';
import { videoDb } from '@/lib/db';
import { generateVideoId } from '@/lib/video-utils';

// Custom endpoint configuration (no API keys required)
const AI_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const AI_HEADERS = {
  'customerId': 'cus_T1GW1dm0Qbl7u8',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx',
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    
    // Validate request
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (body.prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be 500 characters or less' },
        { status: 400 }
      );
    }

    if (!body.duration || body.duration < 2 || body.duration > 10) {
      return NextResponse.json(
        { error: 'Duration must be between 2 and 10 seconds' },
        { status: 400 }
      );
    }

    const validAspectRatios = ['16:9', '9:16', '1:1'];
    if (!validAspectRatios.includes(body.aspectRatio)) {
      return NextResponse.json(
        { error: 'Invalid aspect ratio' },
        { status: 400 }
      );
    }

    // Generate unique ID for this video generation
    const videoId = generateVideoId();
    const now = new Date();

    // Create video record
    const video: VideoGeneration = {
      id: videoId,
      prompt: body.prompt.trim(),
      duration: body.duration,
      aspectRatio: body.aspectRatio,
      style: body.style,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    // Save to database
    videoDb.create(video);

    // Prepare AI request
    const aiRequest = {
      model: 'replicate/google/veo-3',
      messages: [
        {
          role: 'user',
          content: `Generate a high-quality ${body.duration}-second video with ${body.aspectRatio} aspect ratio in ${body.style} style: ${body.prompt}`
        }
      ]
    };

    // Start background video generation
    generateVideoInBackground(videoId, aiRequest);

    return NextResponse.json({
      id: videoId,
      status: 'pending',
      message: 'Video generation started',
      estimatedTime: body.duration * 30, // Rough estimate: 30 seconds per second of video
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Background video generation function
async function generateVideoInBackground(videoId: string, aiRequest: any) {
  try {
    // Update status to processing
    videoDb.update(videoId, { status: 'processing' });

    // Make request to AI service
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: AI_HEADERS,
      body: JSON.stringify(aiRequest),
    });

    if (!response.ok) {
      throw new Error(`AI service responded with status ${response.status}`);
    }

    const result = await response.json();
    
    // Extract video URL from the response
    let videoUrl: string | undefined;
    
    if (result.choices?.[0]?.message?.content) {
      const content = result.choices[0].message.content;
      // Try to extract URL from the content
      const urlMatch = content.match(/(https?:\/\/[^\s]+\.mp4)/i);
      if (urlMatch) {
        videoUrl = urlMatch[1];
      } else {
        // If no URL found, assume the content itself is the URL if it looks like one
        if (content.startsWith('http') && content.includes('.mp4')) {
          videoUrl = content.trim();
        }
      }
    }

    if (videoUrl) {
      // Success - update video record
      videoDb.update(videoId, {
        status: 'completed',
        videoUrl: videoUrl,
        processingTime: Date.now() - new Date(videoDb.findById(videoId)?.createdAt || 0).getTime(),
      });
    } else {
      throw new Error('No video URL returned from AI service');
    }

  } catch (error) {
    console.error(`Background generation failed for ${videoId}:`, error);
    
    // Update video record with error
    videoDb.update(videoId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}