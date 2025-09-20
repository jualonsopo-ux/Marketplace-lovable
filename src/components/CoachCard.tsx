import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Euro, Languages } from 'lucide-react';
import type { Coach } from '@/types/coaching';

interface CoachCardProps {
  coach: Coach;
  onViewProfile?: (coachId: string) => void;
  onBook?: (coachId: string) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export function CoachCard({ coach, onViewProfile, onBook, variant = 'default' }: CoachCardProps) {
  const handleViewProfile = () => {
    onViewProfile?.(coach.id);
  };

  const handleBook = () => {
    onBook?.(coach.id);
  };

  if (variant === 'compact') {
    return (
      <Card className="notion-card hover:notion-card-hover transition-all duration-200 cursor-pointer" onClick={handleViewProfile}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={coach.avatar} alt={coach.name} />
              <AvatarFallback>{coach.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-sm truncate">{coach.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{coach.headline}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{coach.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">{coach.priceHintS1}</span>
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={(e) => {
                  e.stopPropagation();
                  handleBook();
                }}>
                  Reservar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isFeatured = variant === 'featured' || coach.badges.includes('⭐ Top');

  return (
    <Card className={`notion-card hover:notion-card-hover h-full flex flex-col transition-all duration-200 ${
      isFeatured ? 'ring-2 ring-primary/20 shadow-lg' : ''
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarImage src={coach.avatar} alt={coach.name} />
            <AvatarFallback className="text-lg">
              {coach.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg truncate">{coach.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{coach.headline}</p>
              </div>
              {isFeatured && (
                <Badge variant="default" className="flex-shrink-0">
                  ⭐ Top
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{coach.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({coach.reviewsCount})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{Math.round(coach.showUpRate * 100)}% asistencia</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {coach.bio}
        </p>
        
        <div className="space-y-3">
          {/* Specialties */}
          <div>
            <div className="flex flex-wrap gap-1.5">
              {coach.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs px-2 py-0.5">
                  {specialty}
                </Badge>
              ))}
              {coach.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{coach.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Languages and Location */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Languages className="h-3 w-3" />
              <span>{coach.languages.join(', ')}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{coach.location}</span>
            </div>
          </div>

          {/* Additional badges */}
          {coach.badges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {coach.badges.filter(badge => badge !== '⭐ Top').map((badge, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-md border border-primary/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">{coach.priceHintS1}</span>
          <span className="text-sm text-muted-foreground">/sesión</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleViewProfile}>
            Ver perfil
          </Button>
          <Button variant="default" size="sm" onClick={handleBook}>
            Reservar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}