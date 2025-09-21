import { useForm, UseFormProps, UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';

/**
 * Enhanced form hooks with built-in validation, error handling, and submission logic
 */

// Enhanced useForm with automatic Zod integration
export function useEnhancedForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options?: Omit<UseFormProps<T>, 'resolver'> & {
    onSubmitSuccess?: (data: T) => void;
    onSubmitError?: (error: any) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
    errorMessage?: string;
  }
): UseFormReturn<T> & {
  submitWithHandling: (onSubmit: (data: T) => Promise<void> | void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  hasErrors: boolean;
} {
  const {
    onSubmitSuccess,
    onSubmitError,
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Guardado exitosamente',
    errorMessage = 'Error al guardar los datos',
    ...formOptions
  } = options || {};

  const methods = useForm<T>({
    ...formOptions,
    resolver: zodResolver(schema) as any,
    mode: formOptions.mode || 'onChange', // Enable real-time validation
  });

  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    setError,
    clearErrors
  } = methods;

  // Enhanced submit handler with error handling
  const submitWithHandling = useCallback(
    (onSubmit: (data: T) => Promise<void> | void) => {
      return handleSubmit(async (data: T) => {
        try {
          clearErrors();
          await onSubmit(data);
          
          onSubmitSuccess?.(data);
          
          if (showSuccessToast) {
            toast({
              title: "¡Éxito!",
              description: successMessage,
            });
          }
        } catch (error: any) {
          console.error('Form submission error:', error);
          
          // Handle validation errors from server
          if (error.validationErrors) {
            Object.entries(error.validationErrors).forEach(([field, message]) => {
              setError(field as any, { 
                type: 'server', 
                message: message as string 
              });
            });
          } else {
            // Set a general error
            setError('root' as any, { 
              type: 'server', 
              message: error.message || 'An unexpected error occurred' 
            });
          }
          
          onSubmitError?.(error);
          
          if (showErrorToast) {
            toast({
              title: "Error",
              description: error.message || errorMessage,
              variant: "destructive",
            });
          }
        }
      });
    },
    [handleSubmit, clearErrors, setError, onSubmitSuccess, onSubmitError, showSuccessToast, showErrorToast, successMessage, errorMessage]
  );

  const hasErrors = Object.keys(errors).length > 0;

  return {
    ...methods,
    submitWithHandling,
    isSubmitting,
    hasErrors,
  };
}

// Specific form hooks for CoachWave entities

// User profile form
export const UserProfileFormSchema = z.object({
  first_name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  last_name: z.string().min(1, 'El apellido es obligatorio').max(50, 'Máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido').optional(),
  bio: z.string().max(500, 'Máximo 500 caracteres').optional(),
  timezone: z.string().default('Europe/Madrid'),
  language: z.enum(['es', 'en']).default('es'),
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
});

export type UserProfileFormData = z.infer<typeof UserProfileFormSchema>;

export function useUserProfileForm(defaultValues?: Partial<UserProfileFormData>) {
  return useEnhancedForm(UserProfileFormSchema, {
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      timezone: 'Europe/Madrid',
      language: 'es',
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      ...defaultValues,
    },
    successMessage: 'Perfil actualizado correctamente',
  });
}

// Coach profile form
export const CoachProfileFormSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  bio: z.string().min(50, 'Mínimo 50 caracteres').max(2000, 'Máximo 2000 caracteres'),
  years_experience: z.number().min(0, 'No puede ser negativo').max(50, 'Máximo 50 años'),
  specializations: z.array(z.string()).min(1, 'Selecciona al menos una especialización').max(10, 'Máximo 10 especializaciones'),
  hourly_rate: z.number().positive('Debe ser mayor a 0').max(500, 'Máximo €500/hora'),
  currency: z.enum(['EUR', 'USD', 'GBP']).default('EUR'),
  languages: z.array(z.enum(['es', 'en', 'fr', 'de', 'pt'])).min(1, 'Selecciona al menos un idioma'),
  coaching_methods: z.array(z.enum(['video', 'phone', 'chat', 'in-person'])).min(1, 'Selecciona al menos un método'),
  instant_booking: z.boolean().default(false),
});

export type CoachProfileFormData = z.infer<typeof CoachProfileFormSchema>;

export function useCoachProfileForm(defaultValues?: Partial<CoachProfileFormData>) {
  return useEnhancedForm(CoachProfileFormSchema, {
    defaultValues: {
      title: '',
      bio: '',
      years_experience: 0,
      specializations: [],
      hourly_rate: 50,
      currency: 'EUR',
      languages: ['es'],
      coaching_methods: ['video'],
      instant_booking: false,
      ...defaultValues,
    },
    successMessage: 'Perfil de coach actualizado correctamente',
  });
}

// Review form
export const ReviewFormSchema = z.object({
  rating: z.number().int().min(1, 'Selecciona una calificación').max(5, 'Máximo 5 estrellas'),
  comment: z.string().min(10, 'Mínimo 10 caracteres').max(1000, 'Máximo 1000 caracteres').optional(),
  tags: z.array(z.enum(['professional', 'helpful', 'punctual', 'knowledgeable', 'patient'])).max(5, 'Máximo 5 etiquetas'),
  is_public: z.boolean().default(true),
});

export type ReviewFormData = z.infer<typeof ReviewFormSchema>;

export function useReviewForm(defaultValues?: Partial<ReviewFormData>) {
  return useEnhancedForm(ReviewFormSchema, {
    defaultValues: {
      rating: 5,
      comment: '',
      tags: [],
      is_public: true,
      ...defaultValues,
    },
    successMessage: 'Reseña enviada correctamente',
  });
}

// Contact/Support form
export const ContactFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'Mínimo 5 caracteres').max(200, 'Máximo 200 caracteres'),
  message: z.string().min(20, 'Mínimo 20 caracteres').max(2000, 'Máximo 2000 caracteres'),
  category: z.enum(['technical', 'billing', 'coach_inquiry', 'feedback', 'other']),
  urgent: z.boolean().default(false),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export function useContactForm(defaultValues?: Partial<ContactFormData>) {
  return useEnhancedForm(ContactFormSchema, {
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'other',
      urgent: false,
      ...defaultValues,
    },
    successMessage: 'Mensaje enviado correctamente. Te responderemos pronto.',
  });
}