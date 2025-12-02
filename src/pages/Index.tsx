import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Play, Sparkles, Shield, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { supabase } from "@/integrations/supabase/client";
import { HeroCarousel } from "@/components/HeroCarousel";
import logo from "@/assets/quiflix-logo.png";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/home');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 bg-gradient-to-b from-background to-transparent">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="QuiFlix" className="h-8" />
          </div>
          <NavLink to="/auth">
            <Button variant="outline" className="border-primary/50 bg-background/30 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground">
              Sign In
            </Button>
          </NavLink>
        </div>
      </nav>

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="relative border-t border-border bg-card/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              The Future of <span className="text-primary">Film Ownership</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Own, trade, and enjoy exclusive content on the blockchain
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
              <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Stream Instantly</h3>
              <p className="text-muted-foreground">
                Buy and watch films instantly. No waiting, no limits. Your library, your rules.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
              <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Own NFT Tickets</h3>
              <p className="text-muted-foreground">
                Collect limited edition NFT tickets. Trade them, hold them, or unlock exclusive perks.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
              <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                <Coins className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Earn as a Creator</h3>
              <p className="text-muted-foreground">
                Filmmakers earn directly from sales and resales. Cut out the middleman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="container relative mx-auto px-6 text-center">
          <Film className="mx-auto mb-6 h-16 w-16 text-primary" />
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Ready to Start?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Join thousands of film lovers and creators on the next generation streaming platform.
          </p>
          <NavLink to="/auth">
            <Button size="lg" className="text-lg px-10 py-6">
              Get Started Free
            </Button>
          </NavLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 QuiFlix. Built on Web3.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
