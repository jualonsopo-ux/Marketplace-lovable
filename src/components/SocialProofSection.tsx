import { Star } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

interface SocialProofSectionProps {
  rating: number;
  showUpRate: string;
  reviews: Review[];
}

const SocialProofSection = ({ rating, showUpRate, reviews }: SocialProofSectionProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <section className="bg-card rounded-xl shadow-md border border-border/50 p-6 space-y-6">
      <h3 className="text-xl font-bold">Valoraciones</h3>
      
      {/* Stats */}
      <div className="flex justify-around text-center">
        <div className="space-y-1">
          <p className="text-4xl font-bold text-foreground">{rating}</p>
          <p className="text-muted-foreground text-sm">Valoración media</p>
          <div className="flex justify-center space-x-1">
            {renderStars(Math.floor(rating))}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-bold text-foreground">{showUpRate}</p>
          <p className="text-muted-foreground text-sm">Show-up S1</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-gradient-card p-4 rounded-xl border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">{review.name}</span>
              <div className="flex space-x-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-muted-foreground italic leading-relaxed">"{review.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialProofSection;