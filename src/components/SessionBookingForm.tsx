import { useState } from 'react';
import { useSessionForm } from '@/hooks/use-session-form';
import { useCreateSession } from '@/hooks/use-sessions';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, Video, Phone, MessageSquare, MapPin, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TextField, TextareaField, SelectField } from '@/components/forms/FormField';
import type { SessionCreateForm } from '@/schemas/session';
import type { Coach } from '@/types/coaching';
import type { SubmitHandler } from 'react-hook-form';

interface SessionBookingFormProps {
  coach: Coach;
  onSuccess?: (data: SessionCreateForm) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const sessionTypeIcons = {
  video: Video,
  phone: Phone,
  chat: MessageSquare,
  'in-person': MapPin,
};

const sessionTypeLabels = {
  video: 'Videollamada',
  phone: 'Llamada telefónica',
  chat: 'Chat en vivo',
  'in-person': 'Presencial',
};

export function SessionBookingForm({ coach, onSuccess, onCancel, isLoading = false }: SessionBookingFormProps) {
  const [step, setStep] = useState<'details' | 'datetime' | 'review'>('details');
  const form = useSessionForm();
  const createSession = useCreateSession();

  const watchedValues = form.watch();
  const SessionTypeIcon = sessionTypeIcons[watchedValues.session_type] || Video;

  const handleFormSubmit = form.submitWithHandling(async (data: SessionCreateForm) => {
    await createSession.mutateAsync({
      ...data,
      coach_id: coach.id,
    });
    onSuccess?.(data);
  });

  const handleNextStep = () => {
    if (step === 'details') {
      // Validate current fields before proceeding
      const detailsValid = form.trigger(['title', 'session_type', 'description', 'location']);
      if (detailsValid) {
        setStep('datetime');
      }
    } else if (step === 'datetime') {
      const datetimeValid = form.trigger(['scheduled_start', 'scheduled_end']);
      if (datetimeValid) {
        setStep('review');
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 'review') {
      setStep('datetime');
    } else if (step === 'datetime') {
      setStep('details');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {['details', 'datetime', 'review'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step === stepName 
                ? "bg-primary text-primary-foreground" 
                : index < ['details', 'datetime', 'review'].indexOf(step)
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}>
              {index + 1}
            </div>
            {index < 2 && (
              <div className={cn(
                "w-12 h-0.5 mx-2",
                index < ['details', 'datetime', 'review'].indexOf(step)
                  ? "bg-primary/20"
                  : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* Step 1: Session Details */}
          {step === 'details' && (
            <Card className="notion-card">
              <CardHeader>
                <CardTitle className="text-xl">Detalles de la sesión</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sesión con {coach.name} • {coach.headline}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <TextField
                  control={form.control}
                  name="title"
                  label="Título de la sesión"
                  placeholder="Ej: Sesión de coaching personal"
                  required
                  description="Dale un nombre descriptivo a tu sesión"
                />
                
                <SelectField
                  control={form.control}
                  name="session_type"
                  label="Modalidad"
                  placeholder="Seleccionar modalidad"
                  required
                  options={Object.entries(sessionTypeLabels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />

                {watchedValues.session_type === 'in-person' && (
                  <TextField
                    control={form.control}
                    name="location"
                    label="Ubicación"
                    placeholder="Dirección o lugar de encuentro"
                  />
                )}
                
                <TextareaField
                  control={form.control}
                  name="description"
                  label="Descripción (opcional)"
                  placeholder="Describe qué te gustaría trabajar en esta sesión..."
                  rows={4}
                  maxLength={1000}
                  description="Ayuda a tu coach a prepararse mejor para la sesión"
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Date & Time */}
          {step === 'datetime' && (
            <Card className="notion-card">
              <CardHeader>
                <CardTitle className="text-xl">Fecha y hora</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Selecciona cuándo quieres tener tu sesión
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Fecha y hora de inicio *
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal justify-start",
                            !watchedValues.scheduled_start && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watchedValues.scheduled_start ? (
                            format(watchedValues.scheduled_start, "PPP 'a las' HH:mm", { locale: es })
                          ) : (
                            "Seleccionar fecha y hora"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watchedValues.scheduled_start}
                          onSelect={(date) => {
                            if (date) {
                              const newDate = new Date(date);
                              if (watchedValues.scheduled_start) {
                                newDate.setHours(watchedValues.scheduled_start.getHours());
                                newDate.setMinutes(watchedValues.scheduled_start.getMinutes());
                              }
                              form.setValue('scheduled_start', newDate);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Hora de fin *
                    </label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="datetime-local"
                        value={watchedValues.scheduled_end ? format(watchedValues.scheduled_end, "yyyy-MM-dd'T'HH:mm") : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          form.setValue('scheduled_end', date);
                        }}
                        min={watchedValues.scheduled_start ? format(watchedValues.scheduled_start, "yyyy-MM-dd'T'HH:mm") : undefined}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      La sesión durará desde el inicio hasta esta hora
                    </p>
                  </div>
                </div>

                {/* Duration display */}
                {watchedValues.scheduled_start && watchedValues.scheduled_end && (
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        Duración: {Math.round((watchedValues.scheduled_end.getTime() - watchedValues.scheduled_start.getTime()) / (1000 * 60))} minutos
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <Card className="notion-card">
              <CardHeader>
                <CardTitle className="text-xl">Revisar reserva</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Confirma los detalles antes de reservar
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">SESIÓN</h4>
                      <p className="font-medium">{watchedValues.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <SessionTypeIcon className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {sessionTypeLabels[watchedValues.session_type]}
                        </span>
                      </div>
                    </div>
                    
                    {watchedValues.description && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">DESCRIPCIÓN</h4>
                        <p className="text-sm">{watchedValues.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">FECHA Y HORA</h4>
                      <p className="font-medium">
                        {watchedValues.scheduled_start ? format(watchedValues.scheduled_start, "PPP", { locale: es }) : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {watchedValues.scheduled_start && watchedValues.scheduled_end 
                          ? `${format(watchedValues.scheduled_start, "HH:mm")} - ${format(watchedValues.scheduled_end, "HH:mm")}`
                          : ''
                        }
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">COACH</h4>
                      <p className="font-medium">{coach.name}</p>
                      <p className="text-sm text-muted-foreground">{coach.headline}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Antes de la sesión</p>
                      <p className="text-muted-foreground mt-1">
                        Recibirás un email con el enlace de la videollamada y los detalles de la sesión 24 horas antes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {step !== 'details' && (
                <Button type="button" variant="outline" onClick={handlePreviousStep}>
                  Anterior
                </Button>
              )}
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>

            <div>
              {step !== 'review' ? (
                <Button type="button" onClick={handleNextStep} disabled={form.hasErrors}>
                  Siguiente
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="min-w-32"
                  disabled={form.isSubmitting || createSession.isPending}
                >
                  {form.isSubmitting || createSession.isPending ? 'Reservando...' : 'Confirmar reserva'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}