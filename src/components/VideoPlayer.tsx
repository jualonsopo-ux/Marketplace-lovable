import { useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onBookingClick: () => void;
}

const VideoPlayer = ({ src, poster, onBookingClick }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play failed, which is normal in many browsers
      });
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md bg-black aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        muted
        playsInline
        loop
        onClick={togglePlay}
      >
        <source src={src} type="video/mp4" />
      </video>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-video-overlay pointer-events-none" />
      
      {/* Play/Pause button */}
      <Button
        variant="video"
        size="icon"
        className="absolute top-4 left-4 rounded-full"
        onClick={togglePlay}
      >
        <Play className="h-5 w-5" />
      </Button>
      
      {/* CTA overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <Button
          variant="hero"
          className="rounded-full px-6 py-2"
          onClick={onBookingClick}
        >
          Reserva tu S1
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;