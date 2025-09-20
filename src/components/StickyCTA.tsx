import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface StickyCTAProps {
  onBookingClick: () => void;
  targetElementId: string;
}

const StickyCTA = ({ onBookingClick, targetElementId }: StickyCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = document.getElementById(targetElementId);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const isTargetVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setIsVisible(!isTargetVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetElementId]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-40">
      <Button
        variant="hero"
        size="lg"
        className="w-full rounded-full py-4 text-base font-semibold shadow-glow"
        onClick={onBookingClick}
      >
        Sesión de onboarding (10')
      </Button>
    </div>
  );
};

export default StickyCTA;