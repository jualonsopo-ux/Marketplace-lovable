import { useState } from 'react';
import MarketplaceFeed from '@/components/MarketplaceFeed';
import CoachProfile from '@/components/CoachProfile';
import BookingFlow from '@/components/BookingFlow';
import { getCoachById } from '@/data/coaches';

type AppState = 'feed' | 'profile' | 'booking';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('feed');
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const selectedCoach = selectedCoachId ? getCoachById(selectedCoachId) : null;

  const handleOpenProfile = (coachId: string) => {
    setSelectedCoachId(coachId);
    setCurrentState('profile');
  };

  const handleBookSession = (coachId: string) => {
    setSelectedCoachId(coachId);
    setCurrentState('booking');
  };

  const handleBackToFeed = () => {
    setCurrentState('feed');
    setSelectedCoachId(null);
  };

  const handleBackToProfile = () => {
    setCurrentState('profile');
  };

  const handleBookingComplete = () => {
    setCurrentState('feed');
    setSelectedCoachId(null);
  };

  if (currentState === 'profile' && selectedCoach) {
    return (
      <CoachProfile
        coach={selectedCoach}
        onBack={handleBackToFeed}
        onBookSession={handleBookSession}
      />
    );
  }

  if (currentState === 'booking' && selectedCoach) {
    return (
      <BookingFlow
        coach={selectedCoach}
        onBack={handleBackToProfile}
        onComplete={handleBookingComplete}
      />
    );
  }

  return (
    <MarketplaceFeed
      onOpenProfile={handleOpenProfile}
      onBookSession={handleBookSession}
    />
  );
};

export default Index;
