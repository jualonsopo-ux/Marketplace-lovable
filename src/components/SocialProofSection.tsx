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
        className={`h-3 w-3 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <section className="notion-card p-5 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Valoraciones</h3>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="notion-metric text-center">
          <p className="text-2xl font-semibold text-foreground">{rating}</p>
          <p className="text-muted-foreground text-xs">Valoración media</p>
          <div className="flex justify-center space-x-0.5 mt-1">
            {renderStars(Math.floor(rating))}
          </div>
        </div>
        <div className="notion-metric text-center">
          <p className="text-2xl font-semibold text-foreground">{showUpRate}</p>
          <p className="text-muted-foreground text-xs">Show-up S1</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {reviews.slice(0, 3).map((review, index) => (
          <div key={index} className="bg-muted/30 p-3 rounded-lg border border-border/40">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-foreground text-sm">{review.name}</span>
              <div className="flex space-x-0.5">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">"{review.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialProofSection;