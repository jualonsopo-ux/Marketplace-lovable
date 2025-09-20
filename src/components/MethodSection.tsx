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
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Nuestro método</h3>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="notion-card p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-lg font-medium border border-primary/20">
                {step.icon}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm text-foreground">{step.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                {step.hasBooking && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary font-medium text-xs"
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
      <div className="flex justify-center flex-wrap gap-3 text-xs text-muted-foreground pt-2">
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