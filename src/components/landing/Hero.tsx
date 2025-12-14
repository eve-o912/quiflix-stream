import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/quiflix-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Logo */}
        <div className="animate-fade-up mb-8" style={{ animationDelay: "0.1s" }}>
          <img
            src={logo}
            alt="Quiflix Logo"
            className="w-48 md:w-64 lg:w-80 mx-auto animate-float aspect-square object-contain"
          />
        </div>

        {/* Tagline */}
        <h1
          className="animate-fade-up font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-6"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <span className="text-gradient-gold">Own. Host. Earn.</span>
        </h1>

        <p
          className="animate-fade-up text-lg md:text-xl lg:text-2xl text-foreground/80 max-w-3xl mx-auto mb-8 font-light"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          The Web3-powered platform transforming African cinema through
          NFT-based community distribution
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ animationDelay: "0.7s", opacity: 0 }}
        >
          <Button
            variant="hero"
            size="xl"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
            <ArrowRight className="ml-2" />
          </Button>
          <Button
            variant="heroOutline"
            size="xl"
            onClick={() => document.getElementById('why-nfts')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-up mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          style={{ animationDelay: "0.9s", opacity: 0 }}
        >
          {[
            { value: "100%", label: "Transparent Revenue" },
            { value: "NFT", label: "Powered Distribution" },
            { value: "∞", label: "Community Reach" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient-gold">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;