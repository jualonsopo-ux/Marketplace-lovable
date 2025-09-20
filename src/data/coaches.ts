import type { Coach } from '@/types/coaching';
import { transformLegacyCoachData, generateUUID } from '@/lib/validation';
import coachAnaImage from '@/assets/coach-ana.jpg';
import psychologistPabloImage from '@/assets/psychologist-pablo.jpg';
import coachLauraImage from '@/assets/coach-laura.jpg';

// Legacy coach data (will be migrated in Phase 2)
const legacyCoaches: Coach[] = [
  {
    id: 'ana-garcia',
    name: 'Ana García',
    handle: 'ana-garcia',
    role: 'Coach',
    avatar: coachAnaImage,
    bio: 'Coach de carrera con más de 10 años de experiencia ayudando a profesionales a encontrar su camino y alcanzar su máximo potencial.',
    headline: 'Ayuda a encontrar tu propósito profesional.',
    category: 'Carrera',
    rating: 4.8,
    reviewsCount: 124,
    showUpRate: 0.95,
    priceHintS1: '€50',
    badges: ['⚡ 72h', '⭐ Top'],
    specialties: ['Carrera', 'Liderazgo', 'Hábitos'],
    languages: ['es', 'en'],
    location: 'Madrid (online)',
    credentials: {
      coach: ['ICF ACC/PCC', '10 años de experiencia']
    },
    faq: [
      {
        question: '¿Qué es una sesión de onboarding?',
        answer: 'Es una sesión de 10 minutos para que me cuentes tu objetivo y ver si encajamos.'
      },
      {
        question: '¿Cómo son las sesiones?',
        answer: 'Las sesiones son 1:1, online, y nos enfocamos en tus metas y progresos.'
      }
    ],
    reviews: [
      {
        text: 'Ana me ayudó a encontrar la claridad que necesitaba para mi próximo paso profesional. ¡Fantástica!',
        author: 'Usuario anónimo'
      },
      {
        text: 'Muy profesional y cercana. El método es claro y efectivo.',
        author: 'Otro usuario'
      }
    ]
  },
  {
    id: 'pablo-ruiz',
    name: 'Pablo Ruiz',
    handle: 'pablo-ruiz',
    role: 'Psicólogo',
    avatar: psychologistPabloImage,
    bio: 'Psicólogo colegiado especialista en trastornos de ansiedad y técnicas de mindfulness para la reducción del estrés.',
    headline: 'Especialista en ansiedad y estrés.',
    category: 'Ansiedad',
    rating: 4.9,
    reviewsCount: 88,
    showUpRate: 0.98,
    priceHintS1: 'Gratis',
    badges: ['🏥 Sanitario', '🎓 Certificado'],
    specialties: ['Ansiedad', 'Estrés', 'Mindfulness'],
    languages: ['es'],
    location: 'Barcelona (online)',
    credentials: {
      psychologist: {
        collegiateId: 'M-12345',
        degree: 'Psicología Clínica',
        verified: true
      }
    },
    faq: [
      {
        question: '¿Cómo funciona la terapia online?',
        answer: 'Realizamos las sesiones por videollamada, igual que en persona, pero desde la comodidad de tu hogar.'
      }
    ],
    reviews: [
      {
        text: 'Pablo me ha ayudado muchísimo con mi ansiedad. Lo recomiendo 100%.',
        author: 'Usuario anónimo'
      }
    ]
  },
  {
    id: 'laura-sanchez',
    name: 'Laura Sánchez',
    handle: 'laura-sanchez',
    role: 'Coach',
    avatar: coachLauraImage,
    bio: 'Coach especializada en transformación de hábitos y desarrollo personal. Te ayudo a crear rutinas que te lleven hacia tus objetivos.',
    headline: 'Transforma tus hábitos y alcanza tus metas.',
    category: 'Hábitos',
    rating: 4.7,
    reviewsCount: 156,
    showUpRate: 0.92,
    priceHintS1: '€45',
    badges: ['⭐ Top', '🚀 Resultados'],
    specialties: ['Hábitos', 'Productividad', 'Bienestar'],
    languages: ['es', 'en'],
    location: 'Valencia (online)',
    credentials: {
      coach: ['Certificación en Coaching', '5 años de experiencia']
    },
    faq: [
      {
        question: '¿Cuánto tiempo se tarda en ver resultados?',
        answer: 'Depende del objetivo, pero normalmente en 2-4 semanas ya se ven cambios significativos.'
      }
    ],
    reviews: [
      {
        text: 'Laura me ayudó a crear una rutina matutina que cambió mi vida por completo.',
        author: 'Usuario anónimo'
      }
    ]
  }
];

// Export legacy format for backward compatibility (Phase 1)
export const coaches: Coach[] = legacyCoaches;

// New architecture-ready data (will be primary in Phase 2)
export const coachesWithNewSchema = legacyCoaches.map(transformLegacyCoachData);

// Utility functions
export const getCoachById = (id: string): Coach | undefined => {
  return coaches.find(coach => coach.id === id);
};

// Future: Get coach with new schema structure
export const getCoachWithUserById = (id: string) => {
  return coachesWithNewSchema.find(item => item.coach.id === id);
};

// Search and filtering utilities (ready for TanStack Query integration)
export const searchCoaches = (query: string, filters?: {
  category?: string;
  minRating?: number;
  maxPrice?: number;
  languages?: string[];
  specializations?: string[];
}) => {
  let filtered = coaches;

  // Text search
  if (query) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(coach => 
      coach.name.toLowerCase().includes(searchTerm) ||
      coach.bio.toLowerCase().includes(searchTerm) ||
      coach.specialties.some(s => s.toLowerCase().includes(searchTerm))
    );
  }

  // Apply filters
  if (filters) {
    if (filters.category) {
      filtered = filtered.filter(coach => coach.category === filters.category);
    }
    if (filters.minRating) {
      filtered = filtered.filter(coach => coach.rating >= filters.minRating!);
    }
    if (filters.languages?.length) {
      filtered = filtered.filter(coach => 
        filters.languages!.some(lang => coach.languages.includes(lang))
      );
    }
    if (filters.specializations?.length) {
      filtered = filtered.filter(coach => 
        filters.specializations!.some(spec => coach.specialties.includes(spec))
      );
    }
  }

  return filtered;
};

// Get coaches by category
export const getCoachesByCategory = (category: string) => {
  return coaches.filter(coach => coach.category === category);
};

// Get featured coaches
export const getFeaturedCoaches = () => {
  return coaches.filter(coach => coach.badges.includes('⭐ Top'));
};