'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GenerationRequest, GenerationStatus, AspectRatio, VideoStyle } from '@/types/video';
import { ASPECT_RATIOS, VIDEO_STYLES, DURATION_OPTIONS, getEstimatedProcessingTime } from '@/lib/video-utils';
import ApiClient from '@/lib/api-client';
import PromptTemplates from './PromptTemplates';

interface VideoGenerationFormProps {
  onGenerationStart: (id: string) => void;
  onGenerationComplete: (id: string, videoUrl: string) => void;
  onError: (error: string) => void;
}

export default function VideoGenerationForm({
  onGenerationStart,
  onGenerationComplete,
  onError,
}: VideoGenerationFormProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(6);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [style, setStyle] = useState<VideoStyle>('cinematic');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [, setCurrentGenerationId] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      onError('Please enter a video description');
      return;
    }

    const request: GenerationRequest = {
      prompt: prompt.trim(),
      duration,
      aspectRatio,
      style,
    };

    try {
      setStatus('generating');
      setProgress(0);
      
      const estimatedProcessingTime = getEstimatedProcessingTime(duration, style);
      setEstimatedTime(estimatedProcessingTime);
      
      const response = await ApiClient.generateVideo(request);
      setCurrentGenerationId(response.id);
      onGenerationStart(response.id);
      
      // Start polling for status
      pollGenerationStatus(response.id, estimatedProcessingTime);
      
    } catch (error) {
      setStatus('error');
      onError(error instanceof Error ? error.message : 'Failed to start video generation');
      resetForm();
    }
  };

  const pollGenerationStatus = async (id: string, estimatedTime: number) => {
    const startTime = Date.now();
    const maxPollingTime = Math.max(estimatedTime * 1000, 300000); // At least 5 minutes
    
    const poll = async () => {
      try {
        const response = await ApiClient.getVideoStatus(id);
        const elapsed = Date.now() - startTime;
        const progressPercentage = Math.min((elapsed / maxPollingTime) * 100, 95);
        
        setProgress(progressPercentage);
        
        if (response.status === 'completed' && response.videoUrl) {
          setStatus('success');
          setProgress(100);
          onGenerationComplete(id, response.videoUrl);
          setTimeout(resetForm, 2000);
        } else if (response.status === 'failed') {
          setStatus('error');
          onError('Video generation failed');
          resetForm();
        } else if (response.status === 'processing' || response.status === 'pending') {
          // Continue polling
          if (elapsed < maxPollingTime) {
            setTimeout(poll, 10000); // Poll every 10 seconds
          } else {
            setStatus('error');
            onError('Video generation timed out');
            resetForm();
          }
        }
      } catch (error) {
        setStatus('error');
        onError('Failed to check generation status');
        resetForm();
      }
    };
    
    // Start polling after initial delay
    setTimeout(poll, 5000);
  };

  const resetForm = () => {
    setStatus('idle');
    setProgress(0);
    setCurrentGenerationId(null);
    setEstimatedTime(0);
  };

  const handleTemplateSelect = (templatePrompt: string, templateStyle: VideoStyle, templateDuration: number, templateAspectRatio: AspectRatio) => {
    setPrompt(templatePrompt);
    setStyle(templateStyle);
    setDuration(templateDuration);
    setAspectRatio(templateAspectRatio);
    setShowTemplates(false);
  };

  const isGenerating = status === 'generating';
  const characterCount = prompt.length;
  const maxCharacters = 500;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate AI Video</CardTitle>
        <CardDescription>
          Describe your vision and let AI create a stunning video for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt Templates Button */}
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTemplates(!showTemplates)}
              className="mb-4"
            >
              {showTemplates ? 'Hide Templates' : 'Browse Templates'}
            </Button>
            {showTemplates && (
              <PromptTemplates onTemplateSelect={handleTemplateSelect} />
            )}
          </div>

          {/* Video Description */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Video Description</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the video you want to create... e.g., 'A serene mountain lake at sunrise with mist rising from the water'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              maxLength={maxCharacters}
              disabled={isGenerating}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Be specific and descriptive for best results</span>
              <span className={characterCount > maxCharacters * 0.9 ? 'text-orange-500' : ''}>
                {characterCount}/{maxCharacters}
              </span>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as AspectRatio)} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={style} onValueChange={(value) => setStyle(value as VideoStyle)} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_STYLES.map((styleOption) => (
                    <SelectItem key={styleOption.value} value={styleOption.value}>
                      {styleOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Settings Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div>{DURATION_OPTIONS.find(d => d.value === duration)?.description}</div>
            <div>{ASPECT_RATIOS.find(r => r.value === aspectRatio)?.description}</div>
            <div>{VIDEO_STYLES.find(s => s.value === style)?.description}</div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Generating your video... This may take up to {Math.ceil(estimatedTime / 60)} minutes.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? 'Generating Video...' : 'Generate Video'}
          </Button>
        </form>

        {/* Estimated Time Badge */}
        {!isGenerating && prompt && (
          <div className="text-center">
            <Badge variant="secondary">
              Estimated time: ~{Math.ceil(getEstimatedProcessingTime(duration, style) / 60)} minutes
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}