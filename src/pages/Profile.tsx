import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Copy, Film, Trophy, Download, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  
  const walletAddress = "0x39bA...34E7";
  const ensName = "quieve.eth";
  const email = "everlynewangui30021@gmail.com";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied to clipboard");
  };

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
                  <h1 className="text-3xl font-bold text-foreground">{ensName}</h1>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <p className="text-sm text-muted-foreground">
                    Manage your QuiFlix account and view your digital film collection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  Wallet Connected
                </span>
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

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Address</p>
                      <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                        <code className="flex-1 text-sm text-foreground">{walletAddress}</code>
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
                      <div className="space-y-2">
                        <div className="rounded-lg bg-secondary p-2 text-sm text-foreground">
                          Lisk Network
                        </div>
                        <div className="rounded-lg bg-secondary p-2 text-sm text-foreground">
                          Base Network
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Balance</p>
                      <div className="rounded-lg bg-secondary p-3">
                        <p className="text-lg font-semibold text-foreground">0.0000 ETH</p>
                        <p className="text-xs text-muted-foreground">Balance updates automatically</p>
                      </div>
                    </div>
                  </div>
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
