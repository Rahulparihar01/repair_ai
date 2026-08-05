import React, { useState } from 'react';
import { ArrowRight, Tag, CheckCircle2, Phone } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < 1) {
      setCurrentIndex(1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="onboarding-screen">
      {/* Top Navigation Header matching exact screenshot */}
      <div className="onboarding-top">
        <div className="brand-logo-text">
          FixMate
        </div>
        <button className="skip-btn" onClick={onComplete}>
          Skip
        </button>
      </div>

      {/* Main Content Body */}
      <div className="onboarding-body">
        {currentIndex === 0 ? (
          /* Slide 1: Transparent Pricing (Matching Screenshot 1) */
          <>
            <div className="onboarding-graphic">
              <div className="floating-card-bg"></div>
              <div className="floating-card-main">
                <div className="card-tag-icon">
                  <Tag size={20} />
                </div>
                <div className="card-price-row">
                  <div>
                    <div className="card-price-label">Fixed Rate</div>
                    <div className="card-price-value">$49.00</div>
                  </div>
                  <div className="card-price-old">£1,299</div>
                </div>
                <div className="no-hidden-fees-badge">
                  <CheckCircle2 size={13} color="#15803D" />
                  <span>NO HIDDEN FEES</span>
                </div>
              </div>
            </div>

            <h2 className="onboarding-title">Transparent Pricing</h2>
            <p className="onboarding-description">
              Know exactly what you'll pay before you book. No hidden fees, no surprises—just upfront honesty.
            </p>
          </>
        ) : (
          /* Slide 2: Track in Real-Time (Exact replica of attached Screenshot 2) */
          <>
            <div className="onboarding-graphic">
              <div className="map-card-container">
                {/* Simulated SVG Street Map Background */}
                <svg className="map-svg-bg" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="240" fill="#E0F2FE"/>
                  {/* Water bodies & terrain */}
                  <path d="M0 60 Q 60 120, 140 90 T 300 140 L 300 0 L 0 0 Z" fill="#BAE6FD" />
                  <path d="M220 180 C 260 140, 280 200, 300 220 L 300 240 L 200 240 Z" fill="#BAE6FD" />
                  
                  {/* Grid roads */}
                  <path d="M0 80 L 300 130" stroke="#FFFFFF" strokeWidth="6"/>
                  <path d="M0 160 L 300 180" stroke="#FFFFFF" strokeWidth="5"/>
                  <path d="M120 0 L 170 240" stroke="#FFFFFF" strokeWidth="6"/>
                  <path d="M220 0 L 240 240" stroke="#FFFFFF" strokeWidth="4"/>
                  
                  {/* Dotted Route path */}
                  <path d="M 120 130 Q 150 110, 160 90" stroke="#2563EB" strokeWidth="3" strokeDasharray="4 4"/>
                  
                  {/* Map Labels */}
                  <text x="30" y="40" fill="#0284C7" fontSize="10" fontWeight="bold">Alcatraz Island</text>
                  <text x="130" y="140" fill="#334155" fontSize="14" fontWeight="800">San Francisco</text>
                  <text x="210" y="40" fill="#0284C7" fontSize="9" fontWeight="600">Treasure Island</text>
                </svg>

                {/* Top Pill Badge: Arriving in 8 mins */}
                <div className="map-top-pill">
                  <div className="pill-live-dot" />
                  <span>Arriving in 8 mins</span>
                </div>

                {/* Center Map Location Marker Pin */}
                <div className="map-center-pin">
                  <div className="tech-avatar-circle">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                      alt="David Miller" 
                      className="tech-img"
                    />
                  </div>
                </div>

                {/* Bottom Technician Assigned Floating Card */}
                <div className="map-bottom-card">
                  <div className="map-car-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563EB">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z"/>
                      <circle cx="7.5" cy="15.5" r="1.5"/>
                      <circle cx="16.5" cy="15.5" r="1.5"/>
                    </svg>
                  </div>
                  <div className="map-tech-info">
                    <div className="map-tech-label">TECHNICIAN ASSIGNED</div>
                    <div className="map-tech-name">David Miller</div>
                  </div>
                  <button className="map-call-btn" title="Call Technician">
                    <Phone size={14} color="#2563EB" />
                  </button>
                </div>
              </div>
            </div>

            <h2 className="onboarding-title">Track in Real-Time</h2>
            <p className="onboarding-description">
              Watch your technician arrive on a live map and get notified the moment they reach your door.
            </p>
          </>
        )}
      </div>

      {/* Footer Controls matching pagination & button in screenshot */}
      <div className="onboarding-bottom">
        {/* Pagination Dots (2 dots: active indicator) */}
        <div className="pagination-dots">
          <div className={`dot ${currentIndex === 0 ? 'active' : ''}`} onClick={() => setCurrentIndex(0)} />
          <div className={`dot ${currentIndex === 1 ? 'active' : ''}`} onClick={() => setCurrentIndex(1)} />
        </div>

        {/* Primary Action Button */}
        <button className="next-btn" onClick={handleNext}>
          <span>{currentIndex === 0 ? 'Next' : 'Get Started'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
