import { Button } from "@/components/ui/button";
import logo from "@/assets/quiflix-logo.png";
import cinemaHero from "@/assets/cinema-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cinemaHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content - Positioned on the "screen" area */}
      <div className="relative z-10 container mx-auto px-6 text-center -mt-20">
        {/* Main Headline */}
        <h1
          className="animate-fade-up font-display text-5xl md:text-6xl lg:text-8xl font-bold mb-6 text-white"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          Own Your Movie
        </h1>

        {/* Subtext */}
        <p
          className="animate-fade-up text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-4 font-light"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          Stream premium films and own NFT tickets. No wallet?
        </p>
        <p
          className="animate-fade-up text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-8 font-light"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          No problem. Buy directly and claim your NFT anytime.
        </p>

        {/* CTA Button */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.6s", opacity: 0 }}
        >
          <Button
            variant="hero"
            size="xl"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
