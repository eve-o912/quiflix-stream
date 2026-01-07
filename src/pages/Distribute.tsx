import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Share2, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Users,
  Film as FilmIcon,
  ExternalLink
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useMyApplications, useMyDistributionTokens } from '@/hooks/useDistribution';

export default function Distribute() {
  const { toast } = useToast();
  const { data: applications, isLoading: loadingApplications } = useMyApplications();
  const { data: tokens, isLoading: loadingTokens } = useMyDistributionTokens();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyTrackingLink = (trackingCode: string) => {
    const link = `${window.location.origin}/watch?ref=${trackingCode}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(trackingCode);
    toast({
      title: 'Link Copied',
      description: 'Your tracking link has been copied to clipboard.',
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const totalEarnings = tokens?.reduce((sum, t) => sum + Number(t.total_earnings), 0) || 0;
  const totalSales = tokens?.reduce((sum, t) => sum + t.total_sales, 0) || 0;

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Distribution Hub</h1>
                <p className="text-muted-foreground mt-1">
                  Earn 20% revenue from every film sale you generate
                </p>
              </div>
              <Link to="/browse">
                <Button className="bg-primary hover:bg-primary/90">
                  <FilmIcon className="h-4 w-4 mr-2" />
                  Browse Films
                </Button>
              </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Tokens
                  </CardTitle>
                  <Share2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {loadingTokens ? <Skeleton className="h-8 w-16" /> : tokens?.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Sales
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {loadingTokens ? <Skeleton className="h-8 w-16" /> : totalSales}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {loadingTokens ? <Skeleton className="h-8 w-16" /> : `$${totalEarnings.toFixed(2)}`}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="tokens" className="space-y-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="tokens">My Distribution Tokens</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
              </TabsList>

              <TabsContent value="tokens" className="space-y-4">
                {loadingTokens ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map(i => (
                      <Card key={i} className="bg-card border-border">
                        <CardContent className="p-6">
                          <Skeleton className="h-24 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : tokens && tokens.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {tokens.map(token => (
                      <Card key={token.id} className="bg-card border-border">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {token.film?.poster_url ? (
                              <img
                                src={token.film.poster_url}
                                alt={token.film.title}
                                className="w-20 h-28 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-20 h-28 bg-muted rounded-lg flex items-center justify-center">
                                <FilmIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {token.film?.title || 'Unknown Film'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Code: {token.tracking_code}
                                </p>
                              </div>
                              <div className="flex gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Sales:</span>{' '}
                                  <span className="font-medium text-foreground">{token.total_sales}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Earned:</span>{' '}
                                  <span className="font-medium text-green-500">${Number(token.total_earnings).toFixed(2)}</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyTrackingLink(token.tracking_code)}
                                className="w-full"
                              >
                                {copiedCode === token.tracking_code ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Tracking Link
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-card border-border">
                    <CardContent className="py-12 text-center">
                      <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Distribution Tokens Yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Apply to distribute films and earn revenue from every sale.
                      </p>
                      <Link to="/browse">
                        <Button className="bg-primary hover:bg-primary/90">
                          Browse Films to Distribute
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                {loadingApplications ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <Card key={i} className="bg-card border-border">
                        <CardContent className="p-6">
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <Card key={app.id} className="bg-card border-border">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              {app.film?.poster_url ? (
                                <img
                                  src={app.film.poster_url}
                                  alt={app.film.title}
                                  className="w-16 h-24 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-16 h-24 bg-muted rounded-lg flex items-center justify-center">
                                  <FilmIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {app.film?.title || 'Unknown Film'}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Applied {new Date(app.created_at).toLocaleDateString()}
                                </p>
                                {app.rejection_reason && (
                                  <p className="text-sm text-red-400 mt-2">
                                    Reason: {app.rejection_reason}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(app.status)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-card border-border">
                    <CardContent className="py-12 text-center">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Applications Yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Browse films and apply to become a distributor.
                      </p>
                      <Link to="/browse">
                        <Button className="bg-primary hover:bg-primary/90">
                          Browse Films
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* How It Works */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">How Distribution Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Apply</h4>
                    <p className="text-sm text-muted-foreground">
                      Submit your application with social proof
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Get Approved</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive your unique tracking link
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Promote</h4>
                    <p className="text-sm text-muted-foreground">
                      Share your link with your audience
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Earn</h4>
                    <p className="text-sm text-muted-foreground">
                      Get 20% from every sale you generate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
