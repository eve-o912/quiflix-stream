import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { FilmCard } from "@/components/FilmCard";
import { toast } from "sonner";

const Browse = () => {
  const films = [
    {
      id: 1,
      title: "Neon Dreams",
      image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=450&fit=crop",
      views: 0,
      rating: 0,
    },
    {
      id: 2,
      title: "Ocean's Edge",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=450&fit=crop",
      views: 0,
      rating: 0,
    },
    {
      id: 3,
      title: "Mind Palace",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop",
      views: 0,
      rating: 0,
    },
  ];

  const handleBuyDirect = () => {
    toast.info("Connect wallet to purchase film NFT");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-16 pt-16">
        <div className="px-8 py-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-8 text-4xl font-bold text-foreground">Browse Films</h1>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {films.map((film) => (
                <FilmCard
                  key={film.id}
                  title={film.title}
                  image={film.image}
                  views={film.views}
                  rating={film.rating}
                  onBuyDirect={handleBuyDirect}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <section className="border-t border-border bg-card/30 px-8 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-primary">
              What Our Users Say
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  text: "QuiFlix made it so easy to own my favorite films. The NFT experience is seamless!",
                },
                {
                  text: "I love that I can buy movies without needing a wallet setup first.",
                },
                {
                  text: "The future of streaming is here. Own what you watch!",
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card p-6 text-center"
                >
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-secondary" />
                  <p className="text-sm text-muted-foreground">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Browse;
