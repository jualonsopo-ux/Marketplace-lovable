import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Share2, Star } from 'lucide-react';
import { Coach } from '@/types/coaching';

interface CoachProfileProps {
  coach: Coach;
  onBack: () => void;
  onBookSession: (coachId: string) => void;
}

const CoachProfile = ({ coach, onBack, onBookSession }: CoachProfileProps) => {
  return (
    <div className="min-h-screen bg-muted/30 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative w-full h-52">
          <img
            src={coach.avatar}
            alt={coach.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-video-overlay" />
          
          {/* Header Actions */}
          <Button
            variant="video"
            size="icon"
            className="absolute top-4 left-4 rounded-full"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <Button variant="video" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="video" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative bg-white rounded-t-3xl -mt-6 px-6 pt-8 pb-6 shadow-lg">
          <div className="flex flex-col items-center -mt-16">
            <img
              src={coach.avatar}
              alt={coach.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <h1 className="text-2xl font-bold mt-4 text-center">{coach.name}</h1>
            <p className="text-muted-foreground">@{coach.handle}</p>
            
            <div className="flex items-center space-x-6 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground">{coach.rating}</span>
              </div>
              <span>💬 <strong className="text-foreground">{coach.reviewsCount}</strong> Reseñas</span>
              {coach.badges.includes('🎓 Certificado') && (
                <span>🎓 Certificado</span>
              )}
            </div>
            
            <Button
              variant="hero"
              size="lg"
              className="w-full mt-6 rounded-full py-4 text-base font-semibold"
              onClick={() => onBookSession(coach.id)}
            >
              Sesión de onboarding (10')
            </Button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white px-6 pb-6 space-y-8">
        {/* About Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Sobre mí</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">{coach.bio}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {coach.specialties.map((specialty) => (
              <span
                key={specialty}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Idiomas: {coach.languages.join(', ')} | Ubicación: {coach.location}
          </p>
        </section>

        {/* Method Section */}
        <section>
          <h2 className="text-xl font-bold mb-6">Cómo trabajaremos juntos</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-white text-lg font-bold shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">S1 — Onboarding (10')</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Exploramos tu objetivo y confirmamos encaje.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary font-semibold"
                  onClick={() => onBookSession(coach.id)}
                >
                  Reservar S1
                </Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground text-lg font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">S2 — Diagnóstico (20–30')</h3>
                <p className="text-muted-foreground text-sm">
                  Plan y métricas claras. Opción de pago al reservar.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground text-lg font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">S3 — Sesión de trabajo (30'+)</h3>
                <p className="text-muted-foreground text-sm">
                  Ejecución y seguimiento. Paquetes disponibles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Reseñas ({coach.reviews.length})</h2>
          <div className="space-y-4">
            {coach.reviews.map((review, index) => (
              <div key={index} className="bg-gradient-card p-4 rounded-xl border border-border/50 shadow-sm">
                <p className="text-foreground mb-2 leading-relaxed">"{review.text}"</p>
                <p className="text-xs font-semibold text-muted-foreground">— {review.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {coach.faq.map((item, index) => (
              <div key={index} className="bg-gradient-card p-4 rounded-xl border border-border/50 shadow-sm">
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-border shadow-lg">
        <Button
          variant="hero"
          size="lg"
          className="w-full rounded-full py-4 text-base font-semibold"
          onClick={() => onBookSession(coach.id)}
        >
          Sesión de onboarding (10')
        </Button>
      </div>
    </div>
  );
};

export default CoachProfile;