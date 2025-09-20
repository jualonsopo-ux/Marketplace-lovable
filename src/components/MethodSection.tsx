import { Button } from '@/components/ui/button';

interface MethodStep {
  icon: string;
  title: string;
  description: string;
  hasBooking?: boolean;
}

interface MethodSectionProps {
  steps: MethodStep[];
  onBookingClick: () => void;
}

const MethodSection = ({ steps, onBookingClick }: MethodSectionProps) => {
  return (
    <section className="space-y-6">
      <h3 className="text-xl font-bold">Nuestro método</h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-card rounded-xl shadow-md border border-border/50 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-white text-xl font-bold shadow-lg">
                {step.icon}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-lg">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                {step.hasBooking && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary font-semibold"
                    onClick={onBookingClick}
                  >
                    Reservar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="flex justify-center flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center space-x-1">
          <span>🔒</span>
          <span>Stripe</span>
        </span>
        <span className="flex items-center space-x-1">
          <span>📆</span>
          <span>Reprogramación fácil</span>
        </span>
        <span className="flex items-center space-x-1">
          <span>📈</span>
          <span>Seguimiento</span>
        </span>
      </div>
    </section>
  );
};

export default MethodSection;