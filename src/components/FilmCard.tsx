import { Star, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface FilmCardProps {
  title: string;
  image: string;
  views: number;
  rating: number;
  onBuyDirect: () => void;
}

export const FilmCard = ({ title, image, views, rating, onBuyDirect }: FilmCardProps) => {
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
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onBuyDirect}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Buy Direct
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-border text-foreground hover:bg-secondary"
            onClick={onBuyDirect}
          >
            Buy Direct
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
