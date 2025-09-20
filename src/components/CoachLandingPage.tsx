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
    <div className="min-h-screen bg-muted/20">
      <main className="w-full max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={coach.avatar}
              alt={coach.name}
              className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{coach.name}</h1>
            <p className="text-muted-foreground">@{coach.handle}</p>
            <div className="flex justify-center flex-wrap gap-2">
              {coach.badges.map((badge, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex justify-center space-x-6 text-muted-foreground">
              <Button variant="ghost" size="icon" onClick={handleWhatsAppClick}>
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Sesión estratégica de 10' con {coach.name}
          </h2>
          <p className="text-muted-foreground">
            {coach.headline} Sin compromiso.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="w-full rounded-xl py-4 text-base font-semibold"
            onClick={onBookingClick}
          >
            Reservar S1 ahora
          </Button>
          <p className="text-muted-foreground text-sm">
            🔒 Stripe · ⏱️ Reserva en 60s · ❌ Sin permanencia
          </p>
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <Button
            variant="hero"
            className="flex-1 rounded-xl py-3"
            onClick={onBookingClick}
          >
            Reservar S1
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl py-3"
            onClick={handleWhatsAppClick}
          >
            Pregunta rápida
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl py-3"
            onClick={handleShareClick}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </section>

        {/* Featured Video */}
        <section>
          <VideoPlayer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
            onBookingClick={onBookingClick}
          />
        </section>

        {/* Booking Section */}
        <section id="booking_s1" className="bg-card rounded-xl shadow-md border border-border/50 p-6 space-y-4">
          <h3 className="text-xl font-bold">Reserva tu S1 (10')</h3>
          <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
            <p>Aquí se cargaría el calendario de Cal.com</p>
            <p className="text-sm mt-2">Pulsa 'Reservar' para continuar</p>
          </div>
          <Button
            variant="hero"
            size="lg"
            className="w-full rounded-xl py-4"
            onClick={onBookingClick}
          >
            Continuar con la reserva
          </Button>
        </section>

        {/* About Section */}
        <section className="bg-card rounded-xl shadow-md border border-border/50 p-6 space-y-4">
          <h3 className="text-xl font-bold">Sobre {coach.name}</h3>
          <p className="text-muted-foreground leading-relaxed">{coach.bio}</p>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Especialidades</h4>
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Idiomas</h4>
              <div className="flex flex-wrap gap-2">
                {coach.languages.map((language) => (
                  <span
                    key={language}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Ubicación</h4>
              <p className="text-muted-foreground">{coach.location}</p>
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
        <section className="text-center text-sm text-muted-foreground space-y-2">
          <p>Coaching ≠ terapia clínica. Para servicios sanitarios con psicólogos colegiados se aplican consentimientos clínicos.</p>
          <div className="space-x-4">
            <Button variant="link" className="p-0 h-auto text-sm">Privacidad</Button>
            <Button variant="link" className="p-0 h-auto text-sm">Términos</Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground border-t mt-8">
        <p>Marketplace</p>
        <div className="space-x-4 mt-2">
          <Button variant="link" className="p-0 h-auto text-sm">Marketplace</Button>
          <Button variant="link" className="p-0 h-auto text-sm">Soporte</Button>
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