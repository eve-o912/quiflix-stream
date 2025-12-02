import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Film, DollarSign, Upload, Image, Video, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Submit = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    description: "",
    genre: "",
    duration: "",
    language: "English",
    country: "United States",
    releaseDate: "",
    castCrew: "",
    tags: [] as string[],
    purchasePrice: "10",
    secondaryPrice: "15",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch user's wallet
      const { data: walletData } = await supabase
        .from('custodial_wallets')
        .select('wallet_address')
        .eq('user_id', user.id)
        .eq('network', 'base')
        .single();

      if (walletData) {
        setWalletAddress(walletData.wallet_address);
      }
      setIsLoadingWallet(false);
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Film submitted for review!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-16 pt-16">
        <div className="px-8 py-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold text-foreground">Submit Your Film</h1>
              <p className="text-muted-foreground">
                Upload your film to QuiFlix and start earning from your creative work
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                <span className="text-sm text-muted-foreground">Connected:</span>
                {isLoadingWallet ? (
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                ) : walletAddress ? (
                  <code className="text-sm text-foreground">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </code>
                ) : (
                  <span className="text-sm text-destructive">No wallet connected</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded bg-primary/20 p-2">
                      <Film className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
                      <p className="text-sm text-muted-foreground">Tell us about your film</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-foreground">
                        Film Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter film title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="director" className="text-foreground">
                        Director <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="director"
                        placeholder="Director name"
                        value={formData.director}
                        onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your film's plot, themes, and what makes it unique..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="border-border bg-secondary text-foreground"
                    />
                  </div>

                  <div className="mt-4 grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="genre" className="text-foreground">
                        Genre <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="genre"
                        placeholder="Select genre"
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-foreground">
                        Duration (minutes) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="90"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rating" className="text-foreground">Rating</Label>
                      <Input
                        id="rating"
                        placeholder="Select rating"
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-foreground">
                        Language <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="language"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-foreground">
                        Country <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="releaseDate" className="text-foreground">Release Date</Label>
                      <Input
                        id="releaseDate"
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={formData.releaseDate}
                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="castCrew" className="text-foreground">Cast & Crew</Label>
                    <Textarea
                      id="castCrew"
                      placeholder="List main cast members and key crew..."
                      rows={3}
                      value={formData.castCrew}
                      onChange={(e) => setFormData({ ...formData, castCrew: e.target.value })}
                      className="border-border bg-secondary text-foreground"
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label className="text-foreground">Tags</Label>
                    <Input
                      placeholder="Add a tag..."
                      className="border-border bg-secondary text-foreground"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Economics */}
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded bg-primary/20 p-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Pricing & Economics</h2>
                      <p className="text-sm text-muted-foreground">Set your film's pricing and revenue sharing</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice" className="text-foreground">
                        Purchase Price (USDT/USDC) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                      <p className="text-xs text-muted-foreground">
                        Initial price viewers pay to watch and own your film
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryPrice" className="text-foreground">
                        Resale Price (USDT/USDC) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="secondaryPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.secondaryPrice}
                        onChange={(e) => setFormData({ ...formData, secondaryPrice: e.target.value })}
                        className="border-border bg-secondary text-foreground"
                      />
                      <p className="text-xs text-muted-foreground">
                        Price for secondary sales of your film NFT
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File Uploads */}
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded bg-primary/20 p-2">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">File Uploads</h2>
                      <p className="text-sm text-muted-foreground">Upload your film files and promotional materials</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-foreground">
                        Film Poster <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-12 transition-colors hover:bg-secondary">
                        <Image className="mb-2 h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-foreground">Click to upload poster</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Trailer</Label>
                      <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-12 transition-colors hover:bg-secondary">
                        <Video className="mb-2 h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-foreground">Click to upload trailer</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV up to 500MB</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">
                        Full Film <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-12 transition-colors hover:bg-secondary">
                        <Film className="mb-2 h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-foreground">Click to upload full film</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV up to 5GB</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Script (Optional)</Label>
                      <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-12 transition-colors hover:bg-secondary">
                        <FileText className="mb-2 h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-foreground">Click to upload script</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, TXT up to 50MB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" className="border-border">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit Film
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Submit;
