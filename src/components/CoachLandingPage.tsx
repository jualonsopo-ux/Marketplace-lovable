import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Share2, Instagram } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import AccordionFAQ from '@/components/AccordionFAQ';
import ServicesSection from '@/components/ServicesSection';
import SocialProofSection from '@/components/SocialProofSection';
import MethodSection from '@/components/MethodSection';
import Modal from '@/components/Modal';
import StickyCTA from '@/components/StickyCTA';
import { Coach } from '@/types/coaching';

interface CoachLandingPageProps {
  coach: Coach;
  onBookingClick: () => void;
}

const CoachLandingPage = ({ coach, onBookingClick }: CoachLandingPageProps) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    actions: any[];
  }>({
    isOpen: false,
    title: '',
    content: '',
    actions: []
  });

  const showModal = (title: string, content: string, actions: any[]) => {
    setModalState({ isOpen: true, title, content, actions });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/34612345678?text=Hola, vengo de tu perfil`, '_blank');
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: coach.name,
        text: coach.headline,
        url: window.location.href
      });
    } else {
      showModal(
        'Compartir Perfil',
        'Copia el siguiente enlace para compartir el perfil:',
        [
          {
            label: 'Copiar Enlace',
            action: () => {
              navigator.clipboard.writeText(window.location.href);
              closeModal();
            }
          },
          { label: 'Cerrar', action: closeModal, variant: 'secondary' }
        ]
      );
    }
  };

  // Mock data for the new sections
  const services = [
    {
      id: 's1_onboarding',
      type: 'S1' as const,
      title: 'Sesión de Onboarding (10\')',
      duration: 10,
      price: 0,
      currency: 'EUR',
      badge: 'Gratis'
    },
    {
      id: 's2_diagnostico',
      type: 'S2' as const,
      title: 'Sesión de Diagnóstico (30\')',
      duration: 30,
      price: 49,
      currency: 'EUR'
    },
    {
      id: 'package_pro',
      type: 'package' as const,
      title: 'Paquete de 5 Sesiones',
      duration: 250,
      price: 200,
      currency: 'EUR',
      badge: '⭐ Popular'
    }
  ];

  const methodSteps = [
    {
      icon: '🧭',
      title: 'S1 — Onboarding (10\')',
      description: 'Entendemos tu objetivo y confirmamos encaje.',
      hasBooking: true
    },
    {
      icon: '🧪',
      title: 'S2 — Diagnóstico (20–30\')',
      description: 'Plan de acción y métricas de éxito.'
    },
    {
      icon: '🚀',
      title: 'S3 — Trabajo (30\'+)',
      description: 'Ejecución y seguimiento. Paquetes disponibles.'
    }
  ];

  const reviews = [
    {
      name: 'Ana G.',
      rating: 5,
      text: `${coach.name} me ayudó a ver el problema desde otra perspectiva.`,
      date: '2024-05-20'
    },
    {
      name: 'Carlos M.',
      rating: 5,
      text: 'Muy profesional y empático. Sus consejos me han ayudado mucho.',
      date: '2024-05-18'
    },
    {
      name: 'Elena P.',
      rating: 5,
      text: 'Justo lo que necesitaba para organizar mis ideas. ¡Súper recomendado!',
      date: '2024-05-15'
    }
  ];

  const faqItems = [
    { question: '¿La S1 tiene coste?', answer: 'Gratis o precio reducido según profesional. Se muestra antes de reservar.' },
    { question: '¿Puedo reprogramar?', answer: 'Sí, hasta 24h antes salvo política del profesional.' },
    { question: '¿Cómo sé si el coaching es para mí?', answer: 'La sesión S1 está diseñada para eso. En 10 minutos, evaluamos tu situación y si el coaching te puede ayudar.' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">{/* Header */}
        <header className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <img
              src={coach.avatar}
              alt={coach.name}
              className="rounded-full w-full h-full object-cover border-2 border-border shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">{coach.name}</h1>
            <p className="text-muted-foreground text-sm">@{coach.handle}</p>
            <div className="flex justify-center flex-wrap gap-2">
              {coach.badges.map((badge, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-md border border-primary/20"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex justify-center space-x-4 text-muted-foreground pt-2">
              <Button variant="ghost" size="icon" onClick={handleWhatsAppClick}>
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center space-y-4 py-2">
          <h2 className="text-xl md:text-2xl font-semibold leading-tight text-foreground">
            Sesión estratégica de 10' con {coach.name}
          </h2>
          <p className="text-muted-foreground text-sm">
            {coach.headline} Sin compromiso.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="w-full rounded-lg py-3 text-sm font-medium"
            onClick={onBookingClick}
          >
            Reservar S1 ahora
          </Button>
          <p className="text-muted-foreground text-xs">
            🔒 Stripe · ⏱️ Reserva en 60s · ❌ Sin permanencia
          </p>
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col md:flex-row gap-2">
          <Button
            variant="default"
            className="flex-1 rounded-lg py-2.5 text-sm"
            onClick={onBookingClick}
          >
            Reservar S1
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-lg py-2.5 text-sm"
            onClick={handleWhatsAppClick}
          >
            Pregunta rápida
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-lg py-2.5 text-sm"
            onClick={handleShareClick}
          >
            <Share2 className="h-3 w-3 mr-1.5" />
            Compartir
          </Button>
        </section>

        {/* Featured Video */}
        <section>
          <div className="notion-card overflow-hidden">
            <VideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
              onBookingClick={onBookingClick}
            />
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking_s1" className="notion-card p-5 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Reserva tu S1 (10')</h3>
          <div className="text-center text-muted-foreground py-6 border border-dashed border-border rounded-lg bg-muted/20">
            <p className="text-sm">Aquí se cargaría el calendario de Cal.com</p>
            <p className="text-xs mt-1">Pulsa 'Reservar' para continuar</p>
          </div>
          <Button
            variant="hero"
            size="lg"
            className="w-full rounded-lg py-3 text-sm"
            onClick={onBookingClick}
          >
            Continuar con la reserva
          </Button>
        </section>

        {/* About Section */}
        <section className="notion-card p-5 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Sobre {coach.name}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{coach.bio}</p>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground mb-2 text-sm">Especialidades</h4>
              <div className="flex flex-wrap gap-1.5">
                {coach.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-xs border border-border/50"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2 text-sm">Idiomas</h4>
              <div className="flex flex-wrap gap-1.5">
                {coach.languages.map((language) => (
                  <span
                    key={language}
                    className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-xs border border-border/50"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1 text-sm">Ubicación</h4>
              <p className="text-muted-foreground text-sm">{coach.location}</p>
            </div>
          </div>
        </section>

        {/* Method Section */}
        <MethodSection steps={methodSteps} onBookingClick={onBookingClick} />

        {/* Social Proof */}
        <SocialProofSection
          rating={coach.rating}
          showUpRate={`${Math.round(coach.showUpRate * 100)}%`}
          reviews={reviews}
        />

        {/* Services */}
        <ServicesSection services={services} onBookingClick={onBookingClick} />

        {/* FAQ */}
        <AccordionFAQ items={faqItems} />

        {/* Compliance */}
        <section className="text-center text-xs text-muted-foreground space-y-2 py-4">
          <p>Coaching ≠ terapia clínica. Para servicios sanitarios con psicólogos colegiados se aplican consentimientos clínicos.</p>
          <div className="space-x-4">
            <Button variant="link" className="p-0 h-auto text-xs">Privacidad</Button>
            <Button variant="link" className="p-0 h-auto text-xs">Términos</Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground border-t border-border/60">
        <p>Marketplace</p>
        <div className="space-x-4 mt-2">
          <Button variant="link" className="p-0 h-auto text-xs">Marketplace</Button>
          <Button variant="link" className="p-0 h-auto text-xs">Soporte</Button>
        </div>
      </footer>

      {/* Sticky CTA */}
      <StickyCTA onBookingClick={onBookingClick} targetElementId="booking_s1" />

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        content={modalState.content}
        actions={modalState.actions}
      />
    </div>
  );
};

export default CoachLandingPage;