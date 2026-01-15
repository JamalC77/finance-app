import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/seo.config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ArrowRight, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Insights | CFO Line - Financial Strategy & Business Growth',
  description: 'Expert insights on financial strategy, cash flow optimization, and business growth from the CFO Line team. Playbooks, case studies, and decision frameworks.',
  alternates: {
    canonical: `${siteConfig.url}/insights`,
  },
  openGraph: {
    title: 'Insights | CFO Line - Financial Strategy & Business Growth',
    description: 'Expert insights on financial strategy, cash flow optimization, and business growth.',
    url: `${siteConfig.url}/insights`,
    type: 'website',
  },
};

const categoryColors: Record<string, string> = {
  'CFO Brief': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Playbook': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Decision': 'bg-violet-500/10 text-violet-600 border-violet-500/20',
};

export default function InsightsPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">CFO Line</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="btn-shine">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 gradient-hero"></div>
          <div className="absolute inset-0 pattern-grid"></div>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              CFO Line Insights
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Financial Strategy for{" "}
              <span className="gradient-text">Growing Businesses</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Playbooks, case studies, and decision frameworks to help you
              make smarter financial decisions.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
                <p className="text-muted-foreground mb-8">
                  We're working on bringing you valuable financial insights. Check back soon!
                </p>
                <Link href="/">
                  <Button>Back to Home</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => {
                  const category = post.tags[0] || 'Insight';
                  const colorClass = categoryColors[category] || 'bg-primary/10 text-primary border-primary/20';

                  return (
                    <Link key={post.slug} href={`/insights/${post.slug}`}>
                      <Card className="h-full card-hover border-gradient bg-card overflow-hidden group">
                        {post.image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={`text-xs ${colorClass}`}>
                              {category}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {post.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(post.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.readingTime}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Start your free trial and see how CFO Line can help your business grow.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 h-14 btn-shine">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold">CFO Line</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Insights
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CFO Line. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
