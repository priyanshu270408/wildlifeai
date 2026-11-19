import {
  UserProfile, Species, Incident, VisionAnalysisResult,
  GeographicalArea, RiskPrediction, Alert, NotificationItem,
  ResponseTeam, TeamAssignment, AnalyticsOverview, SpeciesDistribution,
  UserRole
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('wildshield_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('wildshield_token', token);
    } else {
      localStorage.removeItem('wildshield_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('wildshield_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}`;
      try {
        const errJson = await response.json();
        errorMsg = errJson.detail || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return response.json();
  }

  // ================= AUTH =================
  async register(data: any): Promise<any> {
    const res = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    this.setToken(res.access_token);
    return res;
  }

  async login(creds: { email: string; password: string }): Promise<any> {
    const res = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(creds)
    });
    this.setToken(res.access_token);
    return res;
  }

  async getMe(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/me');
  }

  async switchDemoUser(role: UserRole): Promise<any> {
    const res = await this.request<any>(`/auth/demo-switch/${role}`, {
      method: 'POST'
    });
    this.setToken(res.access_token);
    return res;
  }

  logout() {
    this.setToken(null);
  }

  // ================= SPECIES =================
  async getSpecies(): Promise<Species[]> {
    return this.request<Species[]>('/species');
  }

  async getSpeciesById(id: string): Promise<Species> {
    return this.request<Species>(`/species/${id}`);
  }

  // ================= INCIDENTS =================
  async getIncidents(params?: { verification_status?: string; species_id?: string; severity?: string }): Promise<Incident[]> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<Incident[]>(`/incidents${query ? `?${query}` : ''}`);
  }

  async getIncidentById(id: string): Promise<Incident> {
    return this.request<Incident>(`/incidents/${id}`);
  }

  async createIncident(data: any): Promise<Incident> {
    return this.request<Incident>('/incidents', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async verifyIncident(id: string, data: { severity?: string; notes?: string; issue_alert?: boolean; alert_title?: string; alert_description?: string }): Promise<Incident> {
    return this.request<Incident>(`/incidents/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async rejectIncident(id: string, reason: string): Promise<Incident> {
    return this.request<Incident>(`/incidents/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async assignIncident(id: string, data: { team_id: string; priority: string; instructions?: string }): Promise<TeamAssignment> {
    return this.request<TeamAssignment>(`/incidents/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ================= AI VISION =================
  async analyzeImage(file: File, speciesHintId?: string, incidentId?: string): Promise<VisionAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (speciesHintId) formData.append('species_hint_id', speciesHintId);
    if (incidentId) formData.append('incident_id', incidentId);

    return this.request<VisionAnalysisResult>('/ai/image-analysis', {
      method: 'POST',
      body: formData
    });
  }

  // ================= RISK & GEOSPATIAL =================
  async getRiskAreas(): Promise<GeographicalArea[]> {
    return this.request<GeographicalArea[]>('/risk/areas');
  }

  async predictRisk(areaId: string, timeWindowHours: number = 24): Promise<RiskPrediction> {
    return this.request<RiskPrediction>('/risk/predict', {
      method: 'POST',
      body: JSON.stringify({ geographical_area_id: areaId, time_window_hours: timeWindowHours })
    });
  }

  // ================= ALERTS & NOTIFICATIONS =================
  async getAlerts(): Promise<Alert[]> {
    return this.request<Alert[]>('/alerts');
  }

  async createAlert(data: { title: string; description: string; category: string; severity: string; geographical_area_id?: string; expires_in_hours?: number }): Promise<Alert> {
    return this.request<Alert>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getNotifications(): Promise<NotificationItem[]> {
    return this.request<NotificationItem[]>('/notifications');
  }

  async markNotificationRead(id: string): Promise<void> {
    return this.request<void>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  // ================= TEAMS =================
  async getTeams(): Promise<ResponseTeam[]> {
    return this.request<ResponseTeam[]>('/teams');
  }

  // ================= ANALYTICS & ADMIN =================
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    return this.request<AnalyticsOverview>('/analytics/overview');
  }

  async getSpeciesDistribution(): Promise<SpeciesDistribution[]> {
    return this.request<SpeciesDistribution[]>('/analytics/species');
  }

  async getSystemHealth(): Promise<any> {
    return this.request<any>('/admin/system-health');
  }

  async resetDemo(): Promise<any> {
    return this.request<any>('/admin/reset-demo', { method: 'POST' });
  }
}

export const api = new ApiService();
