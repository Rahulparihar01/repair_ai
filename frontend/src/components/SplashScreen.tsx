import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  brandName?: string;
  subtitle?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  brandName = "FixMate",
  subtitle = "ELITE HOME CARE"
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress fill from 0 to 100% over 2.4 seconds
    const intervalTime = 20; 
    const totalDuration = 2400; 
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 200);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div></div>

      {/* Center Brand & Loading Line (Exact match for Image 1) */}
      <div className="splash-center">
        {/* Rounded Squircle Brand Icon */}
        <div className="brand-icon-box">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7 6.3a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 0 1.4l1.4 1.4-5.3 5.3a1 1 0 0 0 1.4 1.4l5.3-5.3 1.4 1.4a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0 0-1.4l-4.2-4.2z" fill="white"/>
            <path d="M18.5 5.5l-2.5 2.5 1.5 1.5 2.5-2.5a1.5 1.5 0 0 0-1.5-1.5z" fill="white" opacity="0.8"/>
          </svg>
        </div>

        {/* Brand Title */}
        <h1 className="brand-title">{brandName}</h1>

        {/* Subtitle */}
        <p className="brand-subtitle">{subtitle}</p>

        {/* Progress line loader (0 to 100%, without text percentage as requested) */}
        <div className="progress-line-track" title="Loading...">
          <div 
            className="progress-line-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer text with Shield Icon */}
      <div className="splash-footer">
        <ShieldCheck size={16} color="#059669" />
        <span>EXPERT MAINTENANCE SIMPLIFIED</span>
      </div>
    </div>
  );
};
