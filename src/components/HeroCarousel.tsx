import { useState, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const featuredFilms = [
  {
    id: 1,
    title: "Neon Dreams",
    tagline: "Where reality meets the digital frontier",
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&h=1080&fit=crop",
    genre: "Sci-Fi Thriller",
  },
  {
    id: 2,
    title: "Ocean's Edge",
    tagline: "Some secrets are meant to stay buried",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop",
    genre: "Mystery Drama",
  },
  {
    id: 3,
    title: "Mind Palace",
    tagline: "The greatest prison is the one you build yourself",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
    genre: "Psychological Thriller",
  },
  {
    id: 4,
    title: "Crimson Sky",
    tagline: "When the world ends, hope begins",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop",
    genre: "Action Adventure",
  },
  {
    id: 5,
    title: "Silent Echo",
    tagline: "Every voice leaves a trace",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop",
    genre: "Documentary",
  },
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % featuredFilms.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + featuredFilms.length) % featuredFilms.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const currentFilm = featuredFilms[currentIndex];

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Images */}
      {featuredFilms.map((film, index) => (
        <div
          key={film.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === currentIndex 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105"
          }`}
        >
          <img
            src={film.image}
            alt={film.title}
            className="h-full w-full object-cover"
          />
          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
      ))}

      {/* Film Info */}
      <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center">
        <div className="container mx-auto px-8 md:px-16">
          <div className="max-w-2xl space-y-6">
            <div 
              className={`transition-all duration-500 ${
                isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
            >
              <span className="mb-2 inline-block rounded-full bg-primary/20 px-4 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                {currentFilm.genre}
              </span>
              <h2 className="mb-4 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
                {currentFilm.title}
              </h2>
              <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
                {currentFilm.tagline}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gap-2 text-lg">
                  <Play className="h-5 w-5 fill-current" />
                  Watch Now
                </Button>
                <Button size="lg" variant="outline" className="text-lg border-foreground/20 bg-background/30 backdrop-blur-sm hover:bg-background/50">
                  More Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/30 p-3 text-foreground backdrop-blur-sm transition-all hover:bg-background/50 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/30 p-3 text-foreground backdrop-blur-sm transition-all hover:bg-background/50 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Film Thumbnails */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3">
          {featuredFilms.map((film, index) => (
            <button
              key={film.id}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 700);
                }
              }}
              className={`group relative overflow-hidden rounded-lg transition-all duration-300 ${
                index === currentIndex 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={film.image}
                alt={film.title}
                className="h-14 w-24 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-background/40 transition-opacity ${
                index === currentIndex ? "opacity-0" : "group-hover:opacity-0"
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/30">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / featuredFilms.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
