import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { apiAuth } from '../services/api';

interface AuthScreenProps {
  onComplete: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('alex@fixmate.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [password, setPassword] = useState('password123');
  const [agreed, setAgreed] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        await apiAuth.login(email, password);
        onComplete();
      } else {
        await apiAuth.register(fullName, email, password, phone);
        // After register, perform login
        await apiAuth.login(email, password);
        onComplete();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Fallback: If network issue or backend offline, still allow proceeding in offline mode
      if (err.message && err.message.includes('User not found')) {
        setErrorMsg(err.message);
      } else {
        // Log error but proceed for smooth user demo if needed
        setErrorMsg(err.message || 'Authentication failed. Please check backend connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await apiAuth.loginAsGuest('Alex Morgan (Guest)', 'guest@fixmate.com');
      onComplete();
    } catch (err: any) {
      console.warn('Guest login API error, bypassing:', err);
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      {/* Brand Icon Header */}
      <div className="auth-header">
        <div className="brand-icon-box" style={{ width: '64px', height: '64px', borderRadius: '20px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7 6.3a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 0 1.4l1.4 1.4-5.3 5.3a1 1 0 0 0 1.4 1.4l5.3-5.3 1.4 1.4a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0 0-1.4l-4.2-4.2z" fill="white"/>
            <path d="M18.5 5.5l-2.5 2.5 1.5 1.5 2.5-2.5a1.5 1.5 0 0 0-1.5-1.5z" fill="white" opacity="0.8"/>
          </svg>
        </div>

        <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to access your FixMate care portal.' : 'Join FixMate for seamless home care.'}
        </p>
      </div>

      {/* Auth Card Box */}
      <div className="auth-card">
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                className="auth-input" 
                placeholder="example@mail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input 
                type="password" 
                className="auth-input" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div className="input-wrapper">
                <Phone size={16} className="input-icon" />
                <input 
                  type="tel" 
                  className="auth-input" 
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="checkbox-row">
              <input 
                type="checkbox" 
                id="terms" 
                className="custom-checkbox" 
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the <span className="link-text">Terms of Service</span> and <span className="link-text">Privacy Policy</span>.
              </label>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Register'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>OR CONTINUE AS GUEST</span>
        </div>

        {/* Social / Guest Buttons */}
        <div className="social-buttons-row">
          <button type="button" className="social-btn" onClick={handleGuestLogin} style={{ gridColumn: 'span 2' }}>
            <User size={16} />
            <span>Instant Guest Demo Access</span>
          </button>
        </div>
      </div>

      {/* Footer Toggle Text */}
      <div className="auth-footer-text">
        <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
        <button className="auth-toggle-btn" onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}>
          {isLogin ? 'Register' : 'Log in'}
        </button>
      </div>
    </div>
  );
};
