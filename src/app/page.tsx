import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Powered by Advanced AI Technology
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Create Stunning Videos with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Magic
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your ideas into professional video content in seconds. 
            Our AI-powered video generator creates high-quality videos from simple text descriptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/generate">Start Creating</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional videos with AI
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <div className="h-6 w-6 rounded bg-white"></div>
              </div>
              <CardTitle>AI-Powered Generation</CardTitle>
              <CardDescription>
                Advanced AI models create stunning videos from your text descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• High-quality video output</li>
                <li>• Multiple aspect ratios</li>
                <li>• Various style presets</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <div className="h-6 w-6 rounded bg-white"></div>
              </div>
              <CardTitle>Professional Quality</CardTitle>
              <CardDescription>
                Cinema-grade video production with professional styling options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Cinematic styles</li>
                <li>• Documentary formats</li>
                <li>• Commercial quality</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                <div className="h-6 w-6 rounded bg-white"></div>
              </div>
              <CardTitle>Fast & Easy</CardTitle>
              <CardDescription>
                Generate videos in minutes with our intuitive interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Simple text prompts</li>
                <li>• Real-time progress</li>
                <li>• Instant downloads</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Creating professional videos has never been easier
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Describe Your Vision</h3>
            <p className="text-muted-foreground">
              Write a detailed description of the video you want to create
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Style</h3>
            <p className="text-muted-foreground">
              Select from various styles and customize duration and aspect ratio
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Your Video</h3>
            <p className="text-muted-foreground">
              AI generates your video in minutes, ready to download and share
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border">
        <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Videos?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join thousands of creators using AI to produce professional video content
        </p>
        <Button asChild size="lg" className="text-lg px-8">
          <Link href="/generate">Start Your First Video</Link>
        </Button>
      </section>
    </div>
  );
}