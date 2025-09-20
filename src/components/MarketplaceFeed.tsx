import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Heart, Bookmark, Share2 } from 'lucide-react';
import { coaches } from '@/data/coaches';
import { Coach } from '@/types/coaching';

interface MarketplaceFeedProps {
  onOpenProfile: (coachId: string) => void;
  onBookSession: (coachId: string) => void;
}

const MarketplaceFeed = ({ onOpenProfile, onBookSession }: MarketplaceFeedProps) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Coaches', 'Psicólogos'];

  const FeedItem = ({ coach }: { coach: Coach }) => (
    <div className="relative min-h-screen w-full flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${coach.avatar})` }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-video-overlay" />
      
      {/* Top overlay with category and actions */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
        <div className="flex items-center space-x-2">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
            {coach.role}
          </span>
          <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
            {coach.category}
          </span>
        </div>
        
        <div className="flex flex-col items-center space-y-4 text-white">
          <Button variant="video" size="icon" className="rounded-full">
            <Heart className="h-6 w-6" />
          </Button>
          <Button variant="video" size="icon" className="rounded-full">
            <Bookmark className="h-6 w-6" />
          </Button>
          <Button variant="video" size="icon" className="rounded-full">
            <Share2 className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mt-2 rounded-full border-2 border-white p-0 hover:scale-110 transition-transform"
            onClick={() => onOpenProfile(coach.id)}
          >
            <img
              src={coach.avatar}
              alt={coach.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          </Button>
        </div>
      </div>
      
      {/* Bottom content */}
      <div className="relative z-10 p-6 space-y-3 text-white">
        <h2 className="text-xl font-bold">{coach.name}</h2>
        <p className="text-base opacity-90">{coach.headline}</p>
        <div className="flex items-center space-x-3 text-sm">
          <span className="flex items-center">
            ⭐ {coach.rating}
          </span>
          <span>|</span>
          <span>{coach.priceHintS1}</span>
          {coach.badges.length > 0 && (
            <>
              <span>|</span>
              <span>{coach.badges[0]}</span>
            </>
          )}
        </div>
        <Button
          variant="hero"
          size="lg"
          className="w-full rounded-full py-4 text-base font-semibold"
          onClick={() => onBookSession(coach.id)}
        >
          Sesión de onboarding (S1)
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-border p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Busca por objetivo: ascenso, hábitos, ansiedad leve…"
            className="pl-10 rounded-full border-2 bg-muted/50 focus:bg-white transition-colors"
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              className={`rounded-full transition-all duration-200 ${
                selectedCategory === category 
                  ? "bg-primary text-white" 
                  : "hover:bg-secondary"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Feed Container */}
      <div className="flex-1 overflow-y-auto snap-y snap-mandatory">
        {coaches.map((coach) => (
          <div key={coach.id} className="snap-start">
            <FeedItem coach={coach} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceFeed;