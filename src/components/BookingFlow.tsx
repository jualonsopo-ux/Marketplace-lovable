import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Check, Calendar } from 'lucide-react';
import { Coach } from '@/types/coaching';
import { BookingData } from '@/types/coaching';

interface BookingFlowProps {
  coach: Coach;
  onBack: () => void;
  onComplete: () => void;
}

const BookingFlow = ({ coach, onBack, onComplete }: BookingFlowProps) => {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [bookingData, setBookingData] = useState<BookingData>({
    coachId: coach.id,
    name: '',
    email: '',
    consentBooking: true,
    consentMarketing: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingData.name && bookingData.email && bookingData.consentBooking) {
      setStep('confirmation');
    }
  };

  const handleInputChange = (field: keyof BookingData, value: string | boolean) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Check className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">¡Listo!</h1>
            <p className="text-muted-foreground">
              Verás el enlace de la videollamada en tu email.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button variant="hero" size="lg" className="w-full rounded-full">
              <Calendar className="h-5 w-5 mr-2" />
              Añadir al calendario
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full"
              onClick={onComplete}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Reserva tu S1</h1>
            <p className="text-sm text-muted-foreground">con {coach.name}</p>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-muted-foreground">
            Sesión de 10 minutos para explorar tu objetivo.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-md border border-border/50 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                value={bookingData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="rounded-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={bookingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent-booking"
                  checked={bookingData.consentBooking}
                  onCheckedChange={(checked) => handleInputChange('consentBooking', !!checked)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent-booking" className="text-sm leading-relaxed">
                  Usar mis datos para gestionar esta sesión
                </Label>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent-marketing"
                  checked={bookingData.consentMarketing}
                  onCheckedChange={(checked) => handleInputChange('consentMarketing', !!checked)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent-marketing" className="text-sm leading-relaxed">
                  Recibir consejos y recordatorios (opcional)
                </Label>
              </div>
            </div>

            <div className="bg-warning/10 border-l-4 border-warning rounded-lg p-4 mt-6">
              <h3 className="text-sm font-semibold text-warning-foreground mb-1">
                Garantiza tu plaza (sin cargo)
              </h3>
              <p className="text-sm text-warning-foreground/80">
                Guardamos tu tarjeta para evitar no-shows.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full rounded-full py-4 text-base font-semibold"
            disabled={!bookingData.name || !bookingData.email || !bookingData.consentBooking}
          >
            Confirmar reserva
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingFlow;