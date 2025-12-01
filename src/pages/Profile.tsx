import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Copy, Film, Trophy, Download, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
    };
    getUser();
  }, [navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('custodial_wallets')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const copyAddress = () => {
    if (wallet?.wallet_address) {
      navigator.clipboard.writeText(wallet.wallet_address);
      toast.success("Address copied to clipboard");
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (profileLoading || walletLoading || !userId) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="ml-16 pt-16">
          <div className="px-8 py-8">
            <div className="mx-auto max-w-6xl">
              <Skeleton className="h-10 w-32 mb-6" />
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                <Skeleton className="h-96 lg:col-span-1" />
                <div className="space-y-6 lg:col-span-2">
                  <div className="grid gap-6 sm:grid-cols-3">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-16 pt-16">
        <div className="px-8 py-8">
          <div className="mx-auto max-w-6xl">
            <Button
              variant="ghost"
              className="mb-6 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="mb-8">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {profile?.full_name || 'QuiFlix User'}
                  </h1>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Manage your QuiFlix account and view your digital film collection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {wallet ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    Wallet Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    No Wallet
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Wallet Details */}
              <Card className="border-border bg-card lg:col-span-1">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded bg-primary/20 p-2">
                      <Film className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Wallet Details</h2>
                  </div>

                  {wallet ? (
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Address</p>
                        <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                          <code className="flex-1 text-sm text-foreground">
                            {formatAddress(wallet.wallet_address)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={copyAddress}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Click to copy full address</p>
                      </div>

                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Network</p>
                        <div className="rounded-lg bg-secondary p-2 text-sm text-foreground capitalize">
                          {wallet.network} Network
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Balance</p>
                        <div className="rounded-lg bg-secondary p-3">
                          <p className="text-lg font-semibold text-foreground">0.0000 ETH</p>
                          <p className="text-xs text-muted-foreground">Connect to view balance</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">No wallet connected</p>
                      <Button
                        onClick={() => navigate('/auth')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats and Collection */}
              <div className="space-y-6 lg:col-span-2">
                <div className="grid gap-6 sm:grid-cols-3">
                  <Card className="border-border bg-card text-center">
                    <CardContent className="p-6">
                      <Film className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-3xl font-bold text-foreground">0</p>
                      <p className="text-sm text-muted-foreground">Films Owned</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card text-center">
                    <CardContent className="p-6">
                      <Trophy className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-3xl font-bold text-foreground">0</p>
                      <p className="text-sm text-muted-foreground">NFTs Collected</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card text-center">
                    <CardContent className="p-6">
                      <Download className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-3xl font-bold text-foreground">0</p>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                    </CardContent>
                  </Card>
                </div>

                {/* My Film Collection */}
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <h2 className="mb-2 text-xl font-semibold text-foreground">
                      My Film Collection
                    </h2>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Films you own and can watch anytime
                    </p>

                    <div className="flex flex-col items-center justify-center py-12">
                      <Film className="mb-4 h-16 w-16 text-muted-foreground/50" />
                      <h3 className="mb-2 text-lg font-semibold text-foreground">No films yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Start building your collection by purchasing films
                      </p>
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => navigate('/browse')}
                      >
                        Browse Films
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="rounded bg-primary/20 p-2">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
                    </div>

                    <div className="space-y-2">
                      <button className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 p-4 text-left transition-colors hover:bg-secondary">
                        <span className="flex items-center gap-2 text-foreground">
                          <User className="h-4 w-4" />
                          Edit Profile
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>

                      <button className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 p-4 text-left transition-colors hover:bg-secondary">
                        <span className="flex items-center gap-2 text-foreground">
                          <Download className="h-4 w-4" />
                          Download Data
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>

                      <button className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 p-4 text-left transition-colors hover:bg-secondary">
                        <span className="flex items-center gap-2 text-foreground">
                          Preferences
                        </span>
                        <span className="text-sm text-muted-foreground">Soon</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
