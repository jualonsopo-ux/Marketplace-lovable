import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CoachDashboard from '@/components/CoachDashboard';
import MarketplaceFeed from '@/components/MarketplaceFeed';
import CoachProfile from '@/components/CoachProfile';
import CoachLandingPage from '@/components/CoachLandingPage';
import BookingFlow from '@/components/BookingFlow';
import { getCoachById } from '@/data/coaches';

type AppState = 'dashboard' | 'feed' | 'profile' | 'landing' | 'booking';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('dashboard');
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>('ana-garcia'); // Default to first coach
  const [currentPage, setCurrentPage] = useState('inicio');

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
    setCurrentState('dashboard');
  };

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    if (pageId === 'inicio') {
      setCurrentState('dashboard');
    }
  };

  // Dashboard view by default
  if (currentState === 'dashboard' && selectedCoach) {
    return (
      <DashboardLayout currentPage={currentPage} onPageChange={handlePageChange}>
        <CoachDashboard coach={selectedCoach} />
      </DashboardLayout>
    );
  }

  // Show comprehensive coach landing page
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
