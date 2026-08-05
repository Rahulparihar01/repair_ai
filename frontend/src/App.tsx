import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { RefreshCw } from 'lucide-react';

type AppFlowState = 'splash' | 'onboarding' | 'auth' | 'dashboard';

export const App: React.FC = () => {
  const [flowState, setFlowState] = useState<AppFlowState>('splash');

  const handleSplashComplete = () => {
    setFlowState('onboarding');
  };

  const handleOnboardingComplete = () => {
    setFlowState('auth');
  };

  const handleAuthComplete = () => {
    setFlowState('dashboard');
  };

  const handleResetToSplash = () => {
    setFlowState('splash');
  };

  return (
    <div className="app-viewport">
      {/* Replay Control Button */}
      <button 
        onClick={handleResetToSplash}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          background: '#0F172A',
          color: 'white',
          border: 'none',
          borderRadius: '99px',
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
        title="Replay Loading & Onboarding Flow"
      >
        <RefreshCw size={14} />
        <span>Replay Flow</span>
      </button>

      {/* Main Container Frame */}
      <div className="app-container">
        {flowState === 'splash' && (
          <SplashScreen 
            onComplete={handleSplashComplete} 
            brandName="FixMate"
            subtitle="ELITE HOME CARE"
          />
        )}

        {flowState === 'onboarding' && (
          <OnboardingScreen 
            onComplete={handleOnboardingComplete} 
          />
        )}

        {flowState === 'auth' && (
          <AuthScreen 
            onComplete={handleAuthComplete} 
          />
        )}

        {flowState === 'dashboard' && (
          <DashboardScreen />
        )}
      </div>
    </div>
  );
};

export default App;
