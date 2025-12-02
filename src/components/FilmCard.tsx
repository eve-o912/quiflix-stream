import { useState } from "react";
import { Star, Wallet, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { PurchaseDialog } from "./PurchaseDialog";
import { TrailerModal } from "./TrailerModal";

interface FilmCardProps {
  id: number;
  title: string;
  image: string;
  views: number;
  rating: number;
  price: string;
  trailerUrl?: string;
}

export const FilmCard = ({ id, title, image, views, rating, price, trailerUrl }: FilmCardProps) => {
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  
  return (
    <Card className="group overflow-hidden border-border bg-card transition-all hover:shadow-neon">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm text-foreground">{rating}</span>
          </div>
        </div>
        
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{views}</span>
          <span>•</span>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => setShowTrailer(true)}
          >
            <Play className="mr-2 h-4 w-4" />
            Trailer
          </Button>
          <Button 
            className="flex-1"
            onClick={() => setShowPurchaseDialog(true)}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
        </div>
        
        <TrailerModal
          open={showTrailer}
          onOpenChange={setShowTrailer}
          filmTitle={title}
          trailerUrl={trailerUrl}
        />
        
        <PurchaseDialog
          open={showPurchaseDialog}
          onOpenChange={setShowPurchaseDialog}
          filmId={id}
          filmTitle={title}
          price={price}
        />
      </CardContent>
    </Card>
  );
};
