import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Film } from "lucide-react";

const MyFilms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-16 pt-16">
        <div className="px-8 py-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-8 text-4xl font-bold text-foreground">My Films</h1>
            
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-24">
                <Film className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-semibold text-foreground">No films yet</h3>
                <p className="text-muted-foreground">Your purchased films will appear here</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyFilms;
