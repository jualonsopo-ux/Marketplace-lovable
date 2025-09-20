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
      <h3 className="text-lg font-semibold text-foreground">Servicios</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="notion-card p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-foreground">{service.title}</h4>
                <p className="text-muted-foreground text-xs">
                  Duración: {service.duration}min · Precio: {formatPrice(service.price, service.currency)}
                </p>
              </div>
              {service.badge && (
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-md border border-primary/20">
                  {service.badge}
                </span>
              )}
            </div>
            
            <Button
              variant="default"
              className="w-full rounded-lg py-2.5 text-sm"
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