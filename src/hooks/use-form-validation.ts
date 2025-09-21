import React, { useCallback } from 'react';
import { FieldErrors, FieldValues, Path } from 'react-hook-form';
import { ZodSchema, ZodError } from 'zod';

/**
 * Enhanced form validation utilities for React Hook Form + Zod integration
 */

// Generic form validation hook
export function useFormValidation<T extends FieldValues>(schema: ZodSchema<T>) {
  const validateField = useCallback(
    (fieldName: Path<T>, value: any) => {
      try {
        // For field validation, we'll just validate the whole form and extract field errors
        schema.parse({ [fieldName]: value } as any);
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          return error.issues[0]?.message || 'Invalid value';
        }
        return 'Validation error';
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (data: T) => {
      try {
        schema.parse(data);
        return { isValid: true, errors: {} };
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.issues.forEach((issue) => {
            if (issue.path.length > 0) {
              fieldErrors[issue.path[0] as string] = issue.message;
            }
          });
          return { isValid: false, errors: fieldErrors };
        }
        return { isValid: false, errors: { root: 'Validation failed' } };
      }
    },
    [schema]
  );

  return { validateField, validateForm };
}

// Error message utilities
export function getFieldError(errors: FieldErrors, fieldName: string): string | undefined {
  const error = errors[fieldName];
  if (error) {
    return error.message as string;
  }
  return undefined;
}

export function hasFieldError(errors: FieldErrors, fieldName: string): boolean {
  return !!errors[fieldName];
}

// Form state utilities
export function getFormErrorSummary(errors: FieldErrors): string[] {
  return Object.entries(errors)
    .filter(([_, error]) => error && error.message)
    .map(([field, error]) => `${field}: ${error.message}`);
}

export function getFirstError(errors: FieldErrors): string | undefined {
  const firstError = Object.values(errors).find(error => error && error.message);
  return firstError?.message as string | undefined;
}

// Field validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 9;
}

export function isStrongPassword(password: string): boolean {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

// Date validation helpers
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return startDate < endDate;
}

export function isValidFutureDate(date: Date): boolean {
  return date > new Date();
}

export function isValidBusinessHours(date: Date): boolean {
  const hours = date.getHours();
  const day = date.getDay();
  // Monday to Friday, 9 AM to 6 PM
  return day >= 1 && day <= 5 && hours >= 9 && hours <= 18;
}

// Form submission utilities
export function createSubmissionHandler<T extends FieldValues>(
  onSubmit: (data: T) => Promise<void> | void,
  onError?: (error: any) => void
) {
  return async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      onError?.(error);
    }
  };
}

// Debounced validation for real-time feedback
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}