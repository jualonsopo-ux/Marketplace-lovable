import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SessionCreateFormSchema, type SessionCreateForm } from '@/schemas/session';

export function useSessionForm(defaultValues?: Partial<SessionCreateForm>) {
  return useForm<SessionCreateForm>({
    resolver: zodResolver(SessionCreateFormSchema),
    defaultValues: {
      title: '',
      description: '',
      session_type: 'video',
      location: '',
      scheduled_start: new Date(),
      scheduled_end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      ...defaultValues,
    },
    mode: 'onChange', // Validate on change for better UX
  });
}