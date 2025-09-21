import { useEnhancedForm } from '@/hooks/use-enhanced-forms';
import { SessionCreateFormSchema, type SessionCreateForm } from '@/schemas/session';

export function useSessionForm(defaultValues?: Partial<SessionCreateForm>) {
  return useEnhancedForm(SessionCreateFormSchema, {
    defaultValues: {
      title: '',
      description: '',
      session_type: 'video',
      location: '',
      scheduled_start: new Date(),
      scheduled_end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      ...defaultValues,
    },
    mode: 'onChange', // Enable real-time validation
    successMessage: 'Sesión creada exitosamente',
    errorMessage: 'Error al crear la sesión',
  });
}