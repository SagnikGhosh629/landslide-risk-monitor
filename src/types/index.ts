export interface Location {
  id: string;
  name: string;
  state: string;
  district: string;
  coordinates: { lat: number; lng: number };
  elevation: number;
  population: number;
  description: string;
  historicallyAffected: boolean;
  lastIncident?: string;
}

export interface PredictionData {
  locationId: string;
  timestamp: string;
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  confidence: number;
  factors: RiskFactor[];
  metrics: EnvironmentalMetrics;
  historicalData: HistoricalEvent[];
  forecast: ForecastDay[];
  recommendations: Recommendation[];
  riskZones: RiskZone[];
}

export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  description: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface EnvironmentalMetrics {
  rainfall: { current: number; forecast24h: number; forecast72h: number; unit: string };
  soilMoisture: { current: number; depth: string; unit: string };
  temperature: { current: number; min: number; max: number; unit: string };
  humidity: { current: number; unit: string };
  slope: { angle: number; aspect: string };
  vegetation: { ndvi: number; coverage: string };
  groundwater: { level: number; unit: string; trend: string };
}

export interface HistoricalEvent {
  date: string;
  magnitude: string;
  description: string;
  casualties?: number;
  displaced?: number;
}

export interface ForecastDay {
  day: string;
  rainfall: number;
  riskScore: number;
  temperature: number;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  timeframe: string;
}

export interface RiskZone {
  id: string;
  name: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  coordinates: { lat: number; lng: number };
  radius: number;
  population: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  available: string;
  location: string;
}
