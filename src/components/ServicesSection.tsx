import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  type: 'S1' | 'S2' | 'S3' | 'package';
  title: string;
  duration: number;
  price: number;
  currency: string;
  badge?: string;
}

interface ServicesSectionProps {
  services: Service[];
  onBookingClick: (serviceId: string) => void;
}

const ServicesSection = ({ services, onBookingClick }: ServicesSectionProps) => {
  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Gratis';
    return `${price}€`;
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-bold">Servicios</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-card rounded-xl shadow-md border border-border/50 p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-lg">{service.title}</h4>
                <p className="text-muted-foreground text-sm">
                  Duración: {service.duration}min · Precio: {formatPrice(service.price, service.currency)}
                </p>
              </div>
              {service.badge && (
                <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                  {service.badge}
                </span>
              )}
            </div>
            
            <Button
              variant="hero"
              className="w-full rounded-xl py-3"
              onClick={() => onBookingClick(service.id)}
            >
              Reservar
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;