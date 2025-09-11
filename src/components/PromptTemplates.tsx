'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio, VideoStyle } from '@/types/video';
import { PROMPT_TEMPLATES } from '@/lib/video-utils';

interface PromptTemplatesProps {
  onTemplateSelect: (prompt: string, style: VideoStyle, duration: number, aspectRatio: AspectRatio) => void;
}

export default function PromptTemplates({ onTemplateSelect }: PromptTemplatesProps) {
  const categories = [...new Set(PROMPT_TEMPLATES.map(template => template.category))];

  return (
    <div className="space-y-6 mb-6 p-4 border rounded-lg bg-muted/30">
      <div>
        <h3 className="text-lg font-semibold mb-2">Template Gallery</h3>
        <p className="text-sm text-muted-foreground">
          Choose from our curated templates or use them as inspiration for your own videos
        </p>
      </div>
      
      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h4 className="font-medium capitalize flex items-center gap-2">
            <Badge variant="outline">{category}</Badge>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROMPT_TEMPLATES
              .filter(template => template.category === category)
              .map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {template.duration}s
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {template.style}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.aspectRatio}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onTemplateSelect(
                          template.prompt,
                          template.style as VideoStyle,
                          template.duration,
                          template.aspectRatio
                        )}
                        className="h-7 px-2 text-xs"
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}