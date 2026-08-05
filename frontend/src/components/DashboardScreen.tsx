import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Bell, Wrench, Zap, Sparkles, Wind, 
  Star, Home, Calendar, ShieldCheck, User, Plus, Cpu, X, RefreshCw, ChevronRight, ArrowLeft,
  Lock, Droplets, Monitor, Sun, CheckCircle2, Phone, MessageSquare, CreditCard, Banknote, Truck, Check, Hammer, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiProfile, apiBookings, apiAI, apiSubscriptions } from '../services/api';
import type { Booking as ApiBooking, AIDiagnosisResult, UserSubscriptionInfo } from '../services/api';

const CrossedTools = ({ size = 20, color = "currentColor" }) => (
  <div style={{ position: 'relative', width: size, height: size }}>
    <Wrench size={size} color={color} style={{ position: 'absolute', top: 0, left: 0 }} />
    <Hammer size={size} color={color} style={{ position: 'absolute', top: 0, left: 0, transform: 'scaleX(-1) rotate(90deg)' }} />
  </div>
);

const POPULAR_SERVICES_LIST = [
  {
    id: '1',
    title: 'Emergency Plumbing',
    category: 'Plumbing',
    badge: 'Trending',
    badgeType: 'trending',
    rating: 4.9,
    description: 'Complete leak repair and pipe maintenance with 24/7 support.',
    price: '$49.00',
    image: '/emergency_plumbing.png'
  },
  {
    id: '2',
    title: 'Electrical Safety Check',
    category: 'Electrical',
    badge: 'Expert',
    badgeType: 'expert',
    rating: 4.8,
    description: 'Certified diagnosis and repair of home wiring and fuse boxes.',
    price: '$75.00',
    image: '/electrical_safety_check.png'
  },
  {
    id: '3',
    title: 'Premium Deep Clean',
    category: 'Cleaning',
    badge: '',
    badgeType: '',
    rating: 5.0,
    description: 'Eco-friendly deep sanitization for all rooms and hard surfaces.',
    price: '$120.00',
    image: '/premium_deep_clean.png'
  },
  {
    id: '4',
    title: 'Garden Revitalization',
    category: 'Gardening',
    badge: '',
    badgeType: '',
    rating: 4.7,
    description: 'Seasonal pruning, lawn care, and landscape maintenance services.',
    price: '$60.00',
    image: '/garden_revitalization.png'
  },
  {
    id: '5',
    title: 'Kitchen Faucet Repair',
    category: 'Plumbing',
    badge: 'Fast Arrival',
    badgeType: 'expert',
    rating: 4.9,
    description: 'Instant clog removal, tap valve fixing and leak sealing.',
    price: '$45.00',
    image: '/kitchen_faucet_repair.png'
  },
  {
    id: '6',
    title: 'AC Master Jet Wash',
    category: 'AC Repair',
    badge: 'High Demand',
    badgeType: 'trending',
    rating: 4.9,
    description: 'Complete coil foam cleansing, gas pressure check & filter wash.',
    price: '$89.00',
    image: '/ac_master_jet_wash.png'
  },
  {
    id: '7',
    title: 'Smart Lock & Video Doorbell',
    category: 'Smart Home',
    badge: 'Popular',
    badgeType: 'trending',
    rating: 4.9,
    description: 'Fitting digital lock, fingerprint sensor & video doorbell camera.',
    price: '$55.00',
    image: '/smart_home_installation.png'
  },
  {
    id: '8',
    title: 'RO Water Purifier Service',
    category: 'Water Purifier',
    badge: 'Essential',
    badgeType: 'expert',
    rating: 4.9,
    description: 'Filter & membrane replacement, UV lamp fix & TDS calibration.',
    price: '$39.00',
    image: '/ro_water_purifier.png'
  },
  {
    id: '9',
    title: 'Laptop Express Hardware Fix',
    category: 'Computers',
    badge: 'Expert',
    badgeType: 'expert',
    rating: 4.8,
    description: 'Screen swap, keyboard repair, SSD upgrade & thermal paste clean.',
    price: '$65.00',
    image: '/computer_repair.png'
  },
  {
    id: '10',
    title: 'Solar & Inverter Care',
    category: 'Solar Care',
    badge: 'Eco Power',
    badgeType: 'trending',
    rating: 4.8,
    description: 'Rooftop panel cleaning, battery water top-up & inverter load check.',
    price: '$49.00',
    image: '/solar_power_care.png'
  }
];

export const DashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'plans' | 'profile'>('home');
  const [showAiModal, setShowAiModal] = useState(false);
  const [bookedItem, setBookedItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // API Backend States
  const [userProfile, setUserProfile] = useState<any>(null);
  const [backendBookings, setBackendBookings] = useState<ApiBooking[]>([]);
  const [subInfo, setSubInfo] = useState<UserSubscriptionInfo | null>(null);
  const [aiInputText, setAiInputText] = useState<string>('');
  const [aiCategory, setAiCategory] = useState<string>('Cooling Appliances');
  const [aiDiagnosis, setAiDiagnosis] = useState<AIDiagnosisResult | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Booking Flow State
  type BookingState = 'none' | 'schedule' | 'summary' | 'payment' | 'confirmed' | 'tracking';
  const [bookingState, setBookingState] = useState<BookingState>('none');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Morning 10:30');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('UPI');

  // Pricing Calculations
  const basePrice = parseFloat(selectedServiceForBooking?.price?.replace(/[^0-9.]/g, '')) || 0;
  const taxAmount = basePrice * 0.08;
  const discountAmount = basePrice > 0 ? 15.00 : 0;
  const totalAmount = basePrice + taxAmount - discountAmount;
  const formattedBasePrice = `$${basePrice.toFixed(2)}`;
  const formattedTax = `$${taxAmount.toFixed(2)}`;
  const formattedTotal = `$${Math.max(0, totalAmount).toFixed(2)}`;

  // Live Location States
  const [locationAddress, setLocationAddress] = useState<string>('Detecting location...');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load backend data
  const loadBackendData = async () => {
    try {
      const [profileRes, bookingsRes, subRes] = await Promise.allSettled([
        apiProfile.getProfile(),
        apiBookings.getBookings(),
        apiSubscriptions.getMySubscription(),
      ]);

      if (profileRes.status === 'fulfilled') setUserProfile(profileRes.value);
      if (bookingsRes.status === 'fulfilled') setBackendBookings(bookingsRes.value);
      if (subRes.status === 'fulfilled') setSubInfo(subRes.value);
    } catch (err) {
      console.warn('Backend API connection check fallback:', err);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, []);

  const handlePaymentSubmit = async () => {
    try {
      const created = await apiBookings.createBooking({
        service_category: selectedServiceForBooking?.category || 'Home Repair',
        device_name: selectedServiceForBooking?.title || 'Selected Appliance',
        fault_description: `Booked via FixMate app. Slot: ${selectedTimeSlot}`,
        price: totalAmount > 0 ? totalAmount : 199.0,
        address: locationAddress !== 'Detecting location...' ? locationAddress : '742 Evergreen Terrace, Suite 4B',
        scheduled_date: 'Oct 24th',
        time_slot: selectedTimeSlot,
      });
      if (created && created.booking) {
        setBackendBookings(prev => [created.booking, ...prev]);
      }
    } catch (err) {
      console.warn('Booking persist API offline fallback:', err);
    }

    setBookingState('confirmed');
    setTimeout(() => {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.4 }, colors: ['#1E60F8', '#10B981', '#F59E0B'] });
    }, 100);
  };

  const handleRunAiDiagnosis = async () => {
    if (!aiInputText.trim()) return;
    setAiLoading(true);
    try {
      const res = await apiAI.diagnose(aiCategory, aiInputText);
      setAiDiagnosis(res);
    } catch (err) {
      console.warn('AI Triage API error, showing simulated diagnosis:', err);
      setAiDiagnosis({
        id: Date.now(),
        device_category: aiCategory,
        issue_description: aiInputText,
        fault_type: 'Capacitor Degradation & Gas Pressure Low',
        severity: 'Medium',
        cost_estimate_range: '$45 - $75',
        recommended_action: 'Replace 45uF dual capacitor and inspect gas pressure.'
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Function to fetch live GPS location & reverse geocode
  const fetchLiveLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationAddress('Geolocation not supported');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();

          const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
          const area = data.locality || data.subLocality || data.city || '';
          
          const formattedAddress = area && area !== city ? `${area}, ${city}` : `${city}, ${data.countryName || ''}`;
          setLocationAddress(formattedAddress || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        } catch (err) {
          setLocationAddress(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setLocationError('Permission denied');
        setLocationAddress('Downtown, Seattle (Default)');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchLiveLocation();
  }, []);

  const handleBookService = (service: any) => {
    setSelectedServiceForBooking(service);
    setBookedItem(service.title || null);
    setBookingState('schedule');
  };

  if (bookingState !== 'none') {
    return (
      <div className="dashboard-screen">
        {bookingState !== 'confirmed' && (
          <header className="dashboard-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                className="header-icon-btn" 
                onClick={() => {
                  if (bookingState === 'tracking') setBookingState('confirmed');
                  else if (bookingState === 'payment') setBookingState('summary');
                  else if (bookingState === 'summary') setBookingState('schedule');
                  else setBookingState('none');
                }}
                style={{ background: '#EFF4FE', border: 'none' }}
              >
                <ArrowLeft size={18} color="#1E60F8" />
              </button>
              <div className="header-brand">FixMate</div>
            </div>
            <div className="header-actions">
              <button className="header-icon-btn"><Bell size={18} color="#334155" /></button>
            </div>
          </header>
        )}

        <div className="dashboard-scroll-body" style={{ padding: bookingState === 'confirmed' ? '0' : '16px 18px 90px 18px', background: bookingState === 'confirmed' ? '#F9FBFF' : '#F8FAFC' }}>
          {/* STEP 1: SCHEDULE */}
          {bookingState === 'schedule' && (
            <div className="booking-step-container fadeIn">
              <div className="booking-service-header">
                <img src={selectedServiceForBooking?.image} alt="Service" className="booking-service-img" />
                <div>
                  <h3 className="booking-service-title">{selectedServiceForBooking?.title || 'Selected Service'}</h3>
                  <p className="booking-service-subtitle"><CheckCircle2 size={12} color="#10B981"/> Expert Technician assigned</p>
                </div>
              </div>
              
              <h2 className="booking-section-title">Select Date & Time</h2>
              <div className="calendar-card">
                <div className="calendar-header">
                  <span style={{fontWeight: 800}}>October 2024</span>
                  <div style={{display:'flex', gap:'12px'}}>
                    <span style={{color: '#94A3B8', cursor:'pointer'}}>&lt;</span>
                    <span style={{color: '#0F172A', cursor:'pointer'}}>&gt;</span>
                  </div>
                </div>
                <div className="calendar-grid">
                  <span className="cal-day-label">S</span><span className="cal-day-label">M</span><span className="cal-day-label">T</span><span className="cal-day-label">W</span><span className="cal-day-label">T</span><span className="cal-day-label">F</span><span className="cal-day-label">S</span>
                  <span className="cal-date muted">29</span><span className="cal-date muted">30</span><span className="cal-date">1</span><span className="cal-date">2</span><span className="cal-date">3</span><span className="cal-date">4</span><span className="cal-date">5</span>
                  <span className="cal-date">6</span><span className="cal-date">7</span><span className="cal-date">8</span><span className="cal-date">9</span><span className="cal-date">10</span><span className="cal-date">11</span><span className="cal-date">12</span>
                  <span className="cal-date">13</span><span className="cal-date active">14</span><span className="cal-date">15</span><span className="cal-date">16</span><span className="cal-date">17</span><span className="cal-date">18</span><span className="cal-date">19</span>
                  <span className="cal-date">20</span><span className="cal-date">21</span><span className="cal-date">22</span><span className="cal-date">23</span><span className="cal-date">24</span><span className="cal-date">25</span><span className="cal-date">26</span>
                  <span className="cal-date">27</span><span className="cal-date">28</span><span className="cal-date">29</span><span className="cal-date">30</span><span className="cal-date">31</span>
                </div>
              </div>

              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'24px', marginBottom:'12px'}}>
                <h2 className="booking-section-title" style={{margin:0}}>Available Slots</h2>
                <span style={{fontSize:'10px', color:'#94A3B8', fontWeight:700}}>EDT Timezone</span>
              </div>
              <div className="slots-row">
                {['Morning 09:00', 'Morning 10:30', 'Afternoon 13:00', 'Afternoon 15:30'].map(slot => (
                  <button 
                    key={slot} 
                    className={`slot-btn ${selectedTimeSlot === slot ? 'active' : ''}`}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    <div className="slot-period">{slot.split(' ')[0]}</div>
                    <div className="slot-time">{slot.split(' ')[1]}</div>
                    <div className="slot-status">{selectedTimeSlot === slot ? 'Selected' : 'Available'}</div>
                  </button>
                ))}
              </div>
              
              <div className="booking-footer">
                <button className="btn-secondary" onClick={() => setBookingState('none')}>Save Draft</button>
                <button className="btn-primary" onClick={() => setBookingState('summary')}>Confirm Schedule</button>
              </div>
            </div>
          )}

          {/* STEP 2: SUMMARY */}
          {bookingState === 'summary' && (
            <div className="booking-step-container fadeIn">
              <h2 className="booking-page-title">Booking Summary</h2>
              <p className="booking-page-subtitle">Review your request before proceeding to secure payment.</p>
              
              <div className="summary-service-card">
                <img src={selectedServiceForBooking?.image} alt="Service" className="summary-service-img" />
                <div style={{ flex: 1 }}>
                  <div className="summary-badge">VERIFIED</div>
                  <h3 className="summary-service-title">{selectedServiceForBooking?.title || 'Selected Service'}</h3>
                  <p className="summary-service-desc">Full system inspection & optimization</p>
                </div>
              </div>

              <div className="summary-details-grid">
                <div className="summary-detail-box">
                  <Calendar size={14} color="#1E60F8" />
                  <div className="detail-label">SCHEDULE</div>
                  <div className="detail-value">Mon, Oct 24</div>
                  <div className="detail-subvalue">09:00 AM - 11:00 AM</div>
                </div>
                <div className="summary-detail-box">
                  <MapPin size={14} color="#1E60F8" />
                  <div className="detail-label">ADDRESS</div>
                  <div className="detail-value">Home</div>
                  <div className="detail-subvalue">1289 Oakwood Dr, Apt 4B</div>
                </div>
              </div>

              <div className="tech-profile-card">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Tech" className="tech-avatar" />
                <div style={{flex: 1}}>
                  <div className="tech-name">Marcus Thorne</div>
                  <div className="tech-rating"><Star size={10} color="#10B981" fill="#10B981" /> 4.9 (124 reviews)</div>
                </div>
                <button className="tech-change-btn">Change</button>
              </div>

              <h3 className="payment-summary-title">Payment Summary</h3>
              <div className="payment-summary-card">
                <div className="payment-row">
                  <span>Service Fee</span>
                  <span style={{fontWeight:800}}>{formattedBasePrice}</span>
                </div>
                <div className="payment-row">
                  <span>Tax (8%)</span>
                  <span style={{fontWeight:800}}>{formattedTax}</span>
                </div>
                <div className="payment-row discount-row">
                  <span style={{display:'flex', alignItems:'center', gap:'4px'}}><Zap size={12}/> First Booking Discount</span>
                  <span style={{fontWeight:800}}>- $15.00</span>
                </div>
                <div className="payment-divider"></div>
                <div className="payment-row total-row">
                  <span>Total</span>
                  <span>{formattedTotal}</span>
                </div>
                <p className="payment-terms">By proceeding, you agree to our <a href="#">Terms of Service</a> and Cancellation Policy.</p>
              </div>

              <div className="booking-footer single-btn">
                <button className="btn-primary full-width" onClick={() => setBookingState('payment')}>Proceed to Payment <ChevronRight size={16}/></button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {bookingState === 'payment' && (
            <div className="booking-step-container fadeIn">
              <div className="payment-header-card">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: '16px'}}>
                  <div>
                    <h2 className="payment-service-title">{selectedServiceForBooking?.title || 'Selected Service'}</h2>
                    <p className="payment-service-schedule">Scheduled for Oct 24, 10:00 AM</p>
                  </div>
                  <div className="payment-premium-badge"><CheckCircle2 size={10} color="#10B981"/> Premium</div>
                </div>
                <div className="payment-row">
                  <span>Service Fee</span>
                  <span>{formattedBasePrice}</span>
                </div>
                <div className="payment-row">
                  <span>Tax (GST 18%)</span>
                  <span>{formattedTax}</span>
                </div>
                <div className="payment-row total-payable">
                  <span>Total Payable</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>

              <h3 className="payment-method-title">SELECT PAYMENT METHOD</h3>
              <div className="payment-methods-list">
                {[
                  { id: 'UPI', icon: <Phone size={18} color="#1E60F8"/>, title: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                  { id: 'CARD', icon: <CreditCard size={18} color="#1E60F8"/>, title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { id: 'NET', icon: <Banknote size={18} color="#1E60F8"/>, title: 'Net Banking', desc: 'All Indian major banks' },
                  { id: 'COD', icon: <Banknote size={18} color="#1E60F8"/>, title: 'Cash On Delivery', desc: 'Pay after service completion' }
                ].map(method => (
                  <div 
                    key={method.id} 
                    className={`payment-method-item ${selectedPaymentMethod === method.id ? 'active' : ''}`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="payment-method-icon-wrap">{method.icon}</div>
                    <div style={{flex: 1}}>
                      <div className="payment-method-name">{method.title}</div>
                      <div className="payment-method-desc">{method.desc}</div>
                    </div>
                    <div className="payment-radio">
                      {selectedPaymentMethod === method.id && <div className="payment-radio-inner" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="secure-badge">
                <ShieldCheck size={12} color="#94A3B8"/> Secure 256-bit SSL &nbsp;&nbsp;|&nbsp;&nbsp; <Lock size={12} color="#94A3B8"/> PCI Compliant
              </div>

              <div className="booking-footer single-btn">
                <button className="btn-primary full-width" onClick={handlePaymentSubmit}>Pay {formattedTotal} <ChevronRight size={16}/></button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED */}
          {bookingState === 'confirmed' && (
            <div className="booking-confirmed-container fadeIn">
              <button className="close-btn-abs" onClick={() => setBookingState('none')}><X size={20} color="#1E60F8"/></button>
              
              <div className="confirmed-success-icon">
                <Check size={40} color="#FFFFFF" strokeWidth={4} />
              </div>
              <h1 className="confirmed-title">Booking Confirmed</h1>
              <p className="confirmed-subtitle">Your {selectedServiceForBooking?.category?.toLowerCase() || 'service'} specialist is<br/>scheduled and ready to help.</p>

              <div className="receipt-card">
                <div className="receipt-header">
                  <div>
                    <div className="receipt-label">BOOKING ID</div>
                    <div className="receipt-id">#FXM-992831</div>
                  </div>
                  <div className="receipt-icon"><Banknote size={16} color="#1E60F8"/></div>
                </div>
                <div className="receipt-divider"></div>
                <div className="receipt-row">
                  <Calendar size={16} color="#64748B" />
                  <div>
                    <div className="receipt-val-main">Thursday, Oct 24th</div>
                    <div className="receipt-val-sub">09:00 AM - 11:00 AM</div>
                  </div>
                </div>
                <div className="receipt-row">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Tech" className="receipt-avatar" />
                  <div>
                    <div className="receipt-val-main">David Miller</div>
                    <div className="receipt-val-sub"><Star size={10} color="#10B981" fill="#10B981" style={{display:'inline', verticalAlign:'middle'}}/> 4.9 • {selectedServiceForBooking?.category || 'Service'} Specialist</div>
                  </div>
                </div>
              </div>
              
              <p className="email-confirmation">A confirmation email has been sent to your inbox.</p>

              <div className="confirmed-footer">
                <button className="btn-primary full-width" onClick={() => setBookingState('tracking')}>
                  <MapPin size={16}/> Track My Booking
                </button>
                <button className="btn-secondary full-width" onClick={() => setBookingState('none')}>Back to Home</button>
              </div>
            </div>
          )}

          {/* STEP 5: TRACKING */}
          {bookingState === 'tracking' && (
            <div className="booking-step-container fadeIn">
              <div className="tracking-header-card">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: '16px'}}>
                  <div>
                    <div className="tracking-order-id">Order #FM-992831</div>
                    <h3 className="tracking-service-title">{selectedServiceForBooking?.title || 'Selected Service'}</h3>
                    <div className="tracking-time"><Calendar size={12}/> Today, 2:00 PM - 4:00 PM</div>
                  </div>
                  <div className="tracking-receipt-btn"><Banknote size={16} color="#1E60F8"/></div>
                </div>
                <div className="tracking-tech-row">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Tech" className="tracking-tech-avatar"/>
                  <div style={{flex:1}}>
                    <div className="tracking-tech-name">Marcus Sterling</div>
                    <div className="tracking-tech-rating"><CheckCircle2 size={10} color="#10B981" style={{display:'inline', verticalAlign:'middle'}}/> Top-Rated Technician</div>
                  </div>
                  <div style={{display:'flex', gap:'8px'}}>
                    <button className="action-circle-btn blue"><Phone size={14} color="#FFF"/></button>
                    <button className="action-circle-btn grey"><MessageSquare size={14} color="#475569"/></button>
                  </div>
                </div>
              </div>

              <h4 className="timeline-title">LIVE STATUS</h4>
              <div className="timeline-container">
                <div className="timeline-step completed">
                  <div className="timeline-icon-wrap"><Check size={12} strokeWidth={3}/></div>
                  <div className="timeline-content">
                    <div className="timeline-step-title">Booked</div>
                    <div className="timeline-step-desc">Your appointment is confirmed and scheduled.</div>
                    <div className="timeline-step-time">08:30 AM</div>
                  </div>
                </div>
                <div className="timeline-step completed">
                  <div className="timeline-icon-wrap"><Check size={12} strokeWidth={3}/></div>
                  <div className="timeline-content">
                    <div className="timeline-step-title">Technician Assigned</div>
                    <div className="timeline-step-desc">Marcus Sterling has been assigned to your service.</div>
                    <div className="timeline-step-time">09:15 AM</div>
                  </div>
                </div>
                <div className="timeline-step current">
                  <div className="timeline-icon-wrap"><Truck size={12} color="#FFF" /></div>
                  <div className="timeline-content">
                    <div className="timeline-step-title">On the Way</div>
                    <div className="timeline-step-desc">The technician is approximately 8 minutes away from your location.</div>
                    <div className="timeline-map-box">
                      <img src="/live_tracking_map.png" alt="Map" className="timeline-map-img" />
                      <div className="live-tracking-badge">Live Tracking</div>
                    </div>
                  </div>
                </div>
                <div className="timeline-step upcoming">
                  <div className="timeline-icon-wrap"><Wrench size={12} /></div>
                  <div className="timeline-content">
                    <div className="timeline-step-title">Service Started</div>
                    <div className="timeline-step-desc">Expected to start at 2:00 PM.</div>
                  </div>
                </div>
                <div className="timeline-step upcoming">
                  <div className="timeline-icon-wrap"><CheckCircle2 size={12} /></div>
                  <div className="timeline-content">
                    <div className="timeline-step-title">Completed</div>
                    <div className="timeline-step-desc">Digital invoice and report will be available after completion.</div>
                  </div>
                </div>
              </div>

              <div className="support-card" style={{marginTop: '24px', background: '#F8FAFC', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2E8F0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{background: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                    <MessageSquare size={16} color="#1E60F8" />
                  </div>
                  <div>
                    <div style={{fontSize: '12px', fontWeight: 800, color: '#0F172A'}}>Need help?</div>
                    <div style={{fontSize: '10px', color: '#64748B'}}>Contact our 24/7 support team</div>
                  </div>
                </div>
                <a href="#" style={{fontSize: '11px', fontWeight: 700, color: '#1E60F8', textDecoration: 'none'}}>Chat Now</a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-screen">
      {/* 1. Sticky Header Bar with Live Location Access */}
      {/* 1. Header Bar */}
      {selectedCategory !== null ? (
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="header-icon-btn" 
              onClick={() => setSelectedCategory(null)}
              title="Back to Dashboard"
              style={{ background: '#EFF4FE', border: 'none' }}
            >
              <ArrowLeft size={18} color="#1E60F8" />
            </button>
            <div className="header-brand">FixMate</div>
          </div>

          <div className="header-actions">
            <button className="header-icon-btn" title="Notifications">
              <Bell size={18} color="#334155" />
            </button>
          </div>
        </header>
      ) : (
        <header className="dashboard-header">
          <div 
            className="location-selector"
            onClick={fetchLiveLocation}
            style={{ cursor: 'pointer' }}
            title="Click to refresh live location"
          >
            <div className="location-pin-wrapper">
              <MapPin size={18} color="#2563EB" className={isLocating ? 'location-pin-pulse' : ''} />
            </div>
            <div className="location-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="location-label">Your Location</span>
                {isLocating && <RefreshCw size={10} color="#2563EB" className="spin-icon" />}
              </div>
              <span className="location-city" style={{ color: locationError ? '#E11D48' : '#0F172A' }}>
                {isLocating ? 'Locating GPS...' : locationAddress}
              </span>
            </div>
          </div>

          <div className="header-brand">
            FixMate
          </div>

          <div className="header-actions">
            <button className="header-icon-btn" title="Search">
              <Search size={18} color="#334155" />
            </button>
            <button className="header-icon-btn" title="Notifications">
              <Bell size={18} color="#334155" />
            </button>
          </div>
        </header>
      )}

      {/* Bookings Tab View */}
      {activeTab === 'bookings' && (
        <div className="dashboard-scroll-body" style={{ background: '#F8FAFC', padding: '16px 18px 90px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#10B981' }}></div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#10B981', letterSpacing: '0.5px' }}>UPCOMING BOOKING</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>AC Deep Cleaning</h2>
          <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 24px 0' }}>Booking ID: #FM-982341</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div className="summary-detail-box" style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Calendar size={16} color="#1E60F8" />
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E60F8', margin: '8px 0 4px 0' }}>Date & Time</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Oct 24, 2023</div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>09:00 AM - 11:00 AM</div>
            </div>
            <div className="summary-detail-box" style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <MapPin size={16} color="#1E60F8" />
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E60F8', margin: '8px 0 4px 0' }}>Location</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>Home</div>
              <div style={{ fontSize: '10px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>452 Primrose Ave, Apt 4C, NY</div>
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>Technician Assigned</h3>
          <div className="tech-profile-card" style={{ marginBottom: '24px', background: '#FFFFFF', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Tech" style={{ width: '48px', height: '48px', borderRadius: '24px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#10B981', border: '2px solid #FFF', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={10} color="#FFF" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>Marcus Chen</div>
              <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={12} color="#10B981" fill="#10B981" /> 4.9 (124 reviews)</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ width: '32px', height: '32px', borderRadius: '16px', border: 'none', background: '#EFF4FE', color: '#1E60F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={14} /></button>
              <button style={{ width: '32px', height: '32px', borderRadius: '16px', border: 'none', background: '#EFF4FE', color: '#1E60F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={14} /></button>
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 16px 0' }}>Service Overview</h3>
          <div style={{ background: '#F1F5F9', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#0F172A', fontWeight: 500 }}><Wind size={14} /> Split Unit Cleaning (x2)</div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>$85.00</div>
            </div>
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#0F172A', fontWeight: 500 }}><ShieldCheck size={14} /> Service Warranty</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>Included</div>
            </div>
            <div style={{ padding: '16px', background: '#EFF4FE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Estimated Total</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1E60F8' }}>$85.00</div>
            </div>
          </div>

          <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', position: 'relative', marginBottom: '24px' }}>
            <img src="/live_tracking_map.png" alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#FFFFFF', padding: '6px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '8px', background: '#EFF4FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={10} color="#1E60F8" /></div>
              Technician arriving in 25m
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary full-width" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Calendar size={16} /> Reschedule Service
            </button>
            <button style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <X size={16} /> Cancel Booking
            </button>
          </div>
        </div>
      )}

      {/* 2. Scrollable Body Content */}
      {activeTab === 'home' && selectedCategory !== null ? (
        <div className="dashboard-scroll-body popular-services-view">
          {/* Success Toast */}
          {bookedItem && (
            <div className="toast-booking-success">
              <ShieldCheck size={18} color="#15803D" />
              <span>Successfully Booked <strong>{bookedItem}</strong>!</span>
            </div>
          )}

          {/* Title Header */}
          <div className="popular-services-title-block">
            <h1 className="popular-services-title">Popular Services</h1>
            <p className="popular-services-subtitle">Highly-rated maintenance for your home.</p>
          </div>

          {/* Category Filter Pills Row */}
          <div className="category-pills-row">
            {['All Services', 'Plumbing', 'Electrical', 'Cleaning', 'AC Repair', 'Smart Home', 'Water Purifier', 'Computers', 'Solar Care'].map((cat) => {
              const isActive = (selectedCategory === 'all' && cat === 'All Services') || selectedCategory === cat;
              return (
                <button
                  key={cat}
                  className={`category-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat === 'All Services' ? 'all' : cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 2-Column Grid of Service Cards matching screenshot 100% */}
          <div className="popular-services-grid">
            {(selectedCategory === 'all' 
              ? POPULAR_SERVICES_LIST 
              : POPULAR_SERVICES_LIST.filter(s => s.category === selectedCategory)
            ).map((service) => (
              <div key={service.id} className="popular-service-card">
                <div className="service-card-img-wrapper">
                  <img src={service.image} alt={service.title} className="service-card-img" />
                  {service.badge && (
                    <div className={`service-card-badge ${service.badgeType}`}>
                      <span>{service.badgeType === 'expert' ? '⚡' : '🟢'} {service.badge}</span>
                    </div>
                  )}
                </div>

                <div className="service-card-body">
                  <div className="service-card-header">
                    <h3 className="service-card-title">{service.title}</h3>
                    <div className="service-card-rating">
                      <Star size={12} fill="#059669" color="#059669" />
                      <span>{service.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="service-card-desc">{service.description}</p>

                  <div className="service-card-footer">
                    <div className="service-price-group">
                      <span className="price-label">Starting at</span>
                      <span className="price-value">{service.price}</span>
                    </div>

                    <button 
                      className="book-now-pill-btn" 
                      onClick={() => handleBookService(service)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'home' ? (
        <div className="dashboard-scroll-body">
          {/* Success Toast */}
          {bookedItem && (
            <div className="toast-booking-success">
              <ShieldCheck size={18} color="#15803D" />
              <span>Successfully Booked <strong>{bookedItem}</strong>!</span>
            </div>
          )}

          {/* Front Promotional Banner Card (Matching Reference Picture 100%) */}
          <div className="hero-banner-card">
            <div className="hero-banner-content">
              <div className="hero-badge">ELITE CARE</div>
              <div>
                <h1 className="hero-title">Unlock Priority<br />Home Services</h1>
                <p className="hero-subtitle">Starting at $29/mo</p>
              </div>
              <button className="hero-action-btn" onClick={() => setActiveTab('plans')}>
                <span>View Plans</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Section Title 1 */}
          <div className="section-header">
            <h2 className="section-title">Explore Services</h2>
            <button className="see-all-btn" onClick={() => setSelectedCategory('all')}>See All</button>
          </div>

          {/* 2x2 Grid of Large Service Category Cards matching reference screenshots */}
          <div className="services-large-grid">
            {/* Card 1: Plumbing */}
            <div className="service-large-card" onClick={() => setSelectedCategory('Plumbing')}>
              <div className="large-card-icon-box plumbing-icon">
                <Wrench size={26} color="#FFFFFF" />
              </div>
              <span className="large-card-title">Plumbing</span>
            </div>

            {/* Card 2: Electrical */}
            <div className="service-large-card" onClick={() => setSelectedCategory('Electrical')}>
              <div className="large-card-icon-box electrical-icon">
                <Zap size={26} color="#2563EB" />
              </div>
              <span className="large-card-title">Electrical</span>
            </div>

            {/* Card 3: Cleaning */}
            <div className="service-large-card" onClick={() => setSelectedCategory('Cleaning')}>
              <div className="large-card-icon-box cleaning-icon">
                <Sparkles size={26} color="#15803D" />
              </div>
              <span className="large-card-title">Cleaning</span>
            </div>

            {/* Card 4: AC Repair */}
            <div className="service-large-card" onClick={() => setSelectedCategory('AC Repair')}>
              <div className="large-card-icon-box ac-icon">
                <Wind size={26} color="#0284C7" />
              </div>
              <span className="large-card-title">AC Repair</span>
            </div>

            {/* Card 5: Smart Home */}
            <div className="service-large-card" onClick={() => setSelectedCategory('Smart Home')}>
              <div className="large-card-icon-box electrical-icon">
                <Lock size={26} color="#8B5CF6" />
              </div>
              <span className="large-card-title">Smart Home</span>
            </div>

            {/* Card 6: Water Purifier */}
            <div className="service-large-card" onClick={() => setSelectedCategory('Water Purifier')}>
              <div className="large-card-icon-box ac-icon">
                <Droplets size={26} color="#06B6D4" />
              </div>
              <span className="large-card-title">Water Purifier</span>
            </div>

            {/* Card 7: Computers */}
            <div className="service-large-card" onClick={() => setSelectedCategory('Computers')}>
              <div className="large-card-icon-box plumbing-icon">
                <Monitor size={26} color="#FFFFFF" />
              </div>
              <span className="large-card-title">Computers</span>
            </div>

            {/* Card 8: Solar Care */}
            <div className="service-large-card" onClick={() => setSelectedCategory('Solar Care')}>
              <div className="large-card-icon-box cleaning-icon">
                <Sun size={26} color="#EAB308" />
              </div>
              <span className="large-card-title">Solar Care</span>
            </div>
          </div>

          {/* Section Title 2: Popular Requests (Matching Reference Picture) */}
          <div className="section-header" style={{ marginTop: '24px' }}>
            <h2 className="section-title">Popular Requests</h2>
          </div>

          {/* Horizontal Row of Recommended Service Cards */}
          <div className="popular-requests-row">
            {/* Request Card 1 */}
            <div className="request-card">
              <div className="request-card-img-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80" 
                  alt="Kitchen Faucet Repair" 
                  className="request-card-img" 
                />
              </div>
              <div className="request-card-body">
                <div className="request-title-row">
                  <span className="request-title">Kitchen Faucet Repair</span>
                  <span className="request-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.9</span>
                </div>
                <p className="request-desc">Expert leak detection & fix</p>
                <div className="request-footer">
                  <span className="request-price">$45</span>
                  <button className="book-now-btn" onClick={() => handleBookService({ title: 'Kitchen Faucet Repair', price: '$45', image: '/emergency_plumbing.png' })}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Request Card 2 */}
            <div className="request-card">
              <div className="request-card-img-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80" 
                  alt="Smart Lighting Set" 
                  className="request-card-img" 
                />
              </div>
              <div className="request-card-body">
                <div className="request-title-row">
                  <span className="request-title">Smart Lighting Set</span>
                  <span className="request-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.8</span>
                </div>
                <p className="request-desc">Install & configure hub</p>
                <div className="request-footer">
                  <span className="request-price">$89</span>
                  <button className="book-now-btn" onClick={() => handleBookService({ title: 'Smart Lighting Set', price: '$89', image: '/smart_home_installation.png' })}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Request Card 3 */}
            <div className="request-card">
              <div className="request-card-img-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=400&q=80" 
                  alt="Deep Sofa Cleaning" 
                  className="request-card-img" 
                />
              </div>
              <div className="request-card-body">
                <div className="request-title-row">
                  <span className="request-title">Deep Sofa Cleaning</span>
                  <span className="request-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> 5.0</span>
                </div>
                <p className="request-desc">Eco-friendly steam wash</p>
                <div className="request-footer">
                  <span className="request-price">$120</span>
                  <button className="book-now-btn" onClick={() => handleBookService({ title: 'Deep Sofa Cleaning', price: '$120', image: '/premium_deep_clean.png' })}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Request Card 4 */}
            <div className="request-card">
              <div className="request-card-img-wrapper">
                <img 
                  src="/ac_master_jet_wash.png" 
                  alt="AC Jet Service & Tune-Up" 
                  className="request-card-img" 
                />
              </div>
              <div className="request-card-body">
                <div className="request-title-row">
                  <span className="request-title">AC Jet Service</span>
                  <span className="request-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.9</span>
                </div>
                <p className="request-desc">Deep coil & foam wash</p>
                <div className="request-footer">
                  <span className="request-price">$69</span>
                  <button className="book-now-btn" onClick={() => handleBookService({ title: 'AC Jet Service', price: '$69', image: '/ac_jet_wash.png' })}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Request Card 5 */}
            <div className="request-card">
              <div className="request-card-img-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=400&q=80" 
                  alt="Washing Machine Service" 
                  className="request-card-img" 
                />
              </div>
              <div className="request-card-body">
                <div className="request-title-row">
                  <span className="request-title">Washing Machine Fix</span>
                  <span className="request-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.7</span>
                </div>
                <p className="request-desc">Descaling & vibration check</p>
                <div className="request-footer">
                  <span className="request-price">$55</span>
                  <button className="book-now-btn" onClick={() => handleBookService({ title: 'Washing Machine Fix', price: '$55', image: '/electrical_safety.png' })}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Request Card 6 */}
            <div className="request-card">
              <div className="request-card-img-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=400&q=80" 
                  alt="TV Wall Mount Setup" 
                  className="request-card-img" 
                />
              </div>
              <div className="request-card-body">
                <div className="request-title-row">
                  <span className="request-title">TV Wall Mount Setup</span>
                  <span className="request-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.9</span>
                </div>
                <p className="request-desc">Concealed wiring & leveling</p>
                <div className="request-footer">
                  <span className="request-price">$39</span>
                  <button className="book-now-btn" onClick={() => handleBookService({ title: 'TV Wall Mount Setup', price: '$39', image: '/computer_repair.png' })}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner Card: Verified Professionals */}
          <div className="verified-banner-card">
            <div className="verified-banner-info">
              <div className="verified-badge">
                <ShieldCheck size={12} />
                <span>TRUSTED EXPERTS</span>
              </div>
              <h3 className="verified-title">Verified Professionals</h3>
              <p className="verified-subtitle">Background checked & highly rated.</p>
            </div>
            <div className="verified-score-circle">
              <span>98%</span>
            </div>
          </div>
        </div>
      ) : activeTab === 'plans' ? (
        <div className="dashboard-scroll-body" style={{ background: '#F8FAFC', padding: '16px 18px 90px 18px' }}>
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <h2 className="section-title">Care Subscription Plans</h2>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #1E60F8 0%, #10B981 100%)', borderRadius: '16px', padding: '20px', color: '#FFFFFF', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '99px', letterSpacing: '0.5px' }}>
              CURRENT ACTIVE PLAN
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '12px 0 4px 0' }}>{subInfo?.plan_name || 'Premium Care Plan'}</h2>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: '0 0 16px 0' }}>Includes priority dispatch, zero emergency fees & 4 quarterly maintenance visits.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Visits Remaining</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{subInfo?.visits_remaining ?? 4} / 4</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Cleanings Remaining</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{subInfo?.cleanings_remaining ?? 2} / 2</div>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Available Upgrades</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'Gold Unlimited Plan', price: '$49/mo', desc: 'Unlimited repair visits, 0$ service charge, 24/7 AI diagnostic priority.' },
              { name: 'Ultra Protection Care', price: '$89/mo', desc: 'Full appliance coverage, free spare parts replacement up to $500/yr.' }
            ].map(plan => (
              <div key={plan.name} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>{plan.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 8px 0' }}>{plan.desc}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E60F8' }}>{plan.price}</div>
                </div>
                <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={async () => {
                  await apiSubscriptions.subscribePlan(plan.name);
                  setSubInfo(prev => ({ ...prev, plan_name: plan.name, status: 'active', visits_remaining: 6, cleanings_remaining: 3 }));
                }}>Select</button>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'profile' ? (
        <div className="dashboard-scroll-body" style={{ background: '#F8FAFC', padding: '16px 18px 90px 18px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={userProfile?.image_url ? `http://localhost:8000/${userProfile.image_url}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                alt="Avatar" 
                style={{ width: '64px', height: '64px', borderRadius: '32px', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#10B981', border: '2px solid #FFF', width: '16px', height: '16px', borderRadius: '50%' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{userProfile?.name || 'Alex Morgan'}</h2>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 6px 0' }}>{userProfile?.email || 'alex@fixmate.com'}</p>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#1E60F8', background: '#EFF4FE', padding: '3px 8px', borderRadius: '99px' }}>
                {userProfile?.subscription_plan || 'Premium Customer'}
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Account Settings</h3>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>Total Bookings Created</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E60F8' }}>{backendBookings.length}</span>
            </div>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>Registered Phone</span>
              <span style={{ fontSize: '12px', color: '#64748B' }}>{userProfile?.number || '+1 (555) 019-2834'}</span>
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>Database Sync Status</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} color="#10B981" /> Connected
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Floating Action Button (FAB) */}
      <button 
        className="fab-ai-btn"
        onClick={() => setShowAiModal(true)}
        title="AI Fault Diagnostic"
      >
        <Plus size={26} color="#FFFFFF" />
      </button>

      {/* 3. Bottom Navigation Bar */}
      <nav className="dashboard-bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <div className="nav-icon-wrapper">
            <Home size={20} />
          </div>
          <span className="nav-label">Home</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <div className="nav-icon-wrapper">
            <CrossedTools size={20} color={activeTab === 'bookings' ? '#1E60F8' : '#94A3B8'} />
          </div>
          <span className="nav-label">Bookings</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <div className="nav-icon-wrapper">
            <ShieldCheck size={20} />
          </div>
          <span className="nav-label">Plans</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <div className="nav-icon-wrapper">
            <User size={20} />
          </div>
          <span className="nav-label">Profile</span>
        </button>
      </nav>

      {/* AI Diagnostic Modal */}
      {showAiModal && (
        <div className="modal-backdrop" onClick={() => { setShowAiModal(false); setAiDiagnosis(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', width: '92%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="#2563EB" />
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>AI Diagnostic Triage</h3>
              </div>
              <button className="modal-close-btn" onClick={() => { setShowAiModal(false); setAiDiagnosis(null); }}>
                <X size={18} />
              </button>
            </div>

            {!aiDiagnosis ? (
              <>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '8px 0 16px 0' }}>
                  Describe your appliance fault or symptom for instant AI triage and cost estimation.
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Appliance Category</label>
                  <select 
                    value={aiCategory}
                    onChange={e => setAiCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="Cooling Appliances">Cooling Appliances (AC / Fridge)</option>
                    <option value="Laundry Appliances">Laundry Appliances (Washing Machine)</option>
                    <option value="Kitchen Appliances">Kitchen Appliances (RO / Microwave)</option>
                    <option value="Entertainment Devices">Entertainment Devices (Smart TV)</option>
                    <option value="Home Electrical">Home Electrical & Power</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Issue Description</label>
                  <textarea 
                    className="auth-input"
                    style={{ height: '90px', padding: '12px', resize: 'none', width: '100%' }}
                    placeholder="e.g. AC indoor unit blowing lukewarm air with rattling noise..."
                    value={aiInputText}
                    onChange={e => setAiInputText(e.target.value)}
                  />
                </div>

                <button 
                  className="next-btn"
                  style={{ width: '100%', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={handleRunAiDiagnosis}
                  disabled={aiLoading || !aiInputText.trim()}
                >
                  {aiLoading ? (
                    <>
                      <Loader2 size={16} className="spin-icon" />
                      <span>Analyzing Fault with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Run AI Diagnosis</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                <div style={{ background: '#EFF4FE', border: '1px solid #BFDBFE', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E60F8', textTransform: 'uppercase' }}>AI DIAGNOSIS RESULT</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px', background: aiDiagnosis.severity === 'High' ? '#FEE2E2' : '#FEF3C7', color: aiDiagnosis.severity === 'High' ? '#DC2626' : '#D97706' }}>
                      {aiDiagnosis.severity} Severity
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>{aiDiagnosis.fault_type}</h4>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Estimated Cost: <strong>{aiDiagnosis.cost_estimate_range}</strong></p>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>RECOMMENDED ACTION</div>
                  <p style={{ fontSize: '12px', color: '#1E293B', margin: 0 }}>{aiDiagnosis.recommended_action}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ flex: 1 }}
                    onClick={() => setAiDiagnosis(null)}
                  >
                    New Query
                  </button>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => {
                      setShowAiModal(false);
                      handleBookService({
                        title: `${aiDiagnosis.device_category} - AI Diagnosed Fix`,
                        category: aiDiagnosis.device_category,
                        price: '$199.00',
                        image: '/ac_master_jet_wash.png'
                      });
                      setAiDiagnosis(null);
                    }}
                  >
                    <span>Book Repair</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
