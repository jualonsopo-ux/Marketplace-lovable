export interface Coach {
  id: string;
  name: string;
  handle: string;
  role: 'Coach' | 'Psicólogo';
  avatar: string;
  bio: string;
  headline: string;
  category: string;
  rating: number;
  reviewsCount: number;
  showUpRate: number;
  priceHintS1: string;
  badges: string[];
  specialties: string[];
  languages: string[];
  location: string;
  credentials?: {
    coach?: string[];
    psychologist?: {
      collegiateId: string;
      degree: string;
      verified: boolean;
    };
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  reviews: Array<{
    text: string;
    author: string;
  }>;
}

export interface FeedItem {
  id: string;
  coachId: string;
  videoUrl?: string;
  imageUrl?: string;
  isVideo: boolean;
}

export interface BookingData {
  coachId: string;
  name: string;
  email: string;
  consentBooking: boolean;
  consentMarketing: boolean;
}