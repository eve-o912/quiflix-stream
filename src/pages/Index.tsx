import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/home');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 space-y-8">
          <div className="space-y-4 animate-fade-in">
            <Film className="w-20 h-20 mx-auto text-primary" />
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
              QuiFlix
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
              The Future of Film Streaming on Web3
            </p>
          </div>
          
          <div className="space-y-4 animate-slide-up">
            <NavLink to="/auth">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </NavLink>
            <p className="text-sm text-gray-400">
              Own, trade, and enjoy exclusive content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
