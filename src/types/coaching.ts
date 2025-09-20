// Re-export all schemas and types for backward compatibility
export * from '@/schemas';

// Additional legacy types for smooth migration
export interface ServiceType {
  id: string;
  type: 'S1' | 'S2' | 'package';
  title: string;
  duration: number;
  price: number;
  currency: string;
  badge?: string;
}

export interface MethodStep {
  icon: string;
  title: string;
  description: string;
  hasBooking?: boolean;
}

export interface ReviewDisplay {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}