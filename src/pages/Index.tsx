import { useState } from 'react';
import MarketplaceFeed from '@/components/MarketplaceFeed';
import CoachProfile from '@/components/CoachProfile';
import CoachLandingPage from '@/components/CoachLandingPage';
import BookingFlow from '@/components/BookingFlow';
import { getCoachById } from '@/data/coaches';

type AppState = 'feed' | 'profile' | 'landing' | 'booking';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>('ana-garcia'); // Default to first coach

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

  const handleBackToLanding = () => {
    setCurrentState('landing');
  };

  const handleBookingComplete = () => {
    setCurrentState('landing');
  };

  // Show comprehensive coach landing page by default
  if (currentState === 'landing' && selectedCoach) {
    return (
      <CoachLandingPage
        coach={selectedCoach}
        onBookingClick={() => handleBookSession(selectedCoach.id)}
      />
    );
  }

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
        onBack={handleBackToLanding}
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
