/**
 * Centralized API Service for RepairAI Frontend
 * Communicates with FastAPI backend running on port 8000.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const getToken = (): string | null => {
  return localStorage.getItem('repair_ai_access_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('repair_ai_access_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('repair_ai_access_token');
};

export const getUserData = (): any | null => {
  const data = localStorage.getItem('repair_ai_user');
  return data ? JSON.parse(data) : null;
};

export const setUserData = (user: any): void => {
  localStorage.setItem('repair_ai_user', JSON.stringify(user));
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data: any;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = typeof data === 'object' && data.detail ? data.detail : 'Request failed';
    throw new Error(errorMsg);
  }

  return data as T;
}

// ----------------- AUTHENTICATION API -----------------

export const apiAuth = {
  login: async (email: string, password: string): Promise<any> => {
    const res = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.access_token) {
      setToken(res.access_token);
      if (res.data) setUserData(res.data);
    }
    return res;
  },

  register: async (name: string, email: string, password: string, phone: string = '15550000000'): Promise<any> => {
    const numericPhone = parseInt(phone.replace(/\D/g, '')) || 15550000000;
    const res = await request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        number: numericPhone,
        email,
        password,
        confirmPassword: password,
        role: 'customer',
        subscription_plan: 'Premium Plan',
      }),
    });
    return res;
  },

  loginAsGuest: async (name: string = 'Guest User', email: string = 'guest@fixmate.com'): Promise<any> => {
    const res = await request<any>('/auth/loginAsGuest', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        role: 'customer',
      }),
    });
    if (res.access_token) {
      setToken(res.access_token);
      if (res.data) setUserData(res.data);
    }
    return res;
  },
};

// ----------------- PROFILE API -----------------

export const apiProfile = {
  getProfile: async (): Promise<any> => {
    return await request<any>('/profile/get_profile', { method: 'GET' });
  },

  updateAvatar: async (userId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('avatar', file);

    return await request<any>('/profile/update_Image', {
      method: 'PATCH',
      body: formData,
    });
  },
};

// ----------------- BOOKINGS API -----------------

export interface Booking {
  id: number;
  service_category: string;
  device_name: string;
  fault_description?: string;
  status: string;
  price: number;
  technician_name?: string;
  technician_phone?: string;
  address?: string;
  scheduled_date?: string;
  time_slot?: string;
  created_at?: string;
}

export const apiBookings = {
  getBookings: async (): Promise<Booking[]> => {
    return await request<Booking[]>('/bookings/', { method: 'GET' });
  },

  createBooking: async (bookingData: {
    service_category: string;
    device_name: string;
    fault_description?: string;
    address?: string;
    scheduled_date?: string;
    time_slot?: string;
    price?: number;
  }): Promise<{ message: string; booking: Booking }> => {
    return await request<{ message: string; booking: Booking }>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  updateStatus: async (bookingId: number, status: string): Promise<any> => {
    return await request<any>(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// ----------------- AI DIAGNOSIS API -----------------

export interface AIDiagnosisResult {
  id: number;
  device_category: string;
  issue_description: string;
  fault_type: string;
  severity: string;
  cost_estimate_range: string;
  recommended_action?: string;
  created_at?: string;
}

export const apiAI = {
  diagnose: async (deviceCategory: string, issueDescription: string): Promise<AIDiagnosisResult> => {
    return await request<AIDiagnosisResult>('/ai/diagnose', {
      method: 'POST',
      body: JSON.stringify({
        device_category: deviceCategory,
        issue_description: issueDescription,
      }),
    });
  },

  getHistory: async (): Promise<AIDiagnosisResult[]> => {
    return await request<AIDiagnosisResult[]>('/ai/history', { method: 'GET' });
  },
};

// ----------------- SUBSCRIPTIONS API -----------------

export interface UserSubscriptionInfo {
  id?: number;
  plan_name: string;
  visits_remaining: number;
  cleanings_remaining: number;
  status: string;
  expires_at?: string;
}

export const apiSubscriptions = {
  getMySubscription: async (): Promise<UserSubscriptionInfo> => {
    return await request<UserSubscriptionInfo>('/subscriptions/my', { method: 'GET' });
  },

  subscribePlan: async (planName: string): Promise<any> => {
    return await request<any>('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ plan_name: planName }),
    });
  },
};
