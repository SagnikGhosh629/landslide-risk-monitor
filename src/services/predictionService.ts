import { Location, PredictionData } from '../types';
import { nerLocations, searchLocations } from '../data/locations';
import { getPredictionData } from '../data/predictions';

// Simulate API delay for location/search operations
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const predictionService = {
  async searchLocations(query: string): Promise<Location[]> {
    await delay(300);
    return searchLocations(query);
  },

  async getAllLocations(): Promise<Location[]> {
    await delay(200);
    return nerLocations;
  },

  async getLocationById(id: string): Promise<Location | undefined> {
    await delay(150);
    return nerLocations.find((loc) => loc.id === id);
  },

  async analyzeLocation(locationId: string): Promise<PredictionData> {
    // Find the selected location
    const location = nerLocations.find((loc) => loc.id === locationId);

    if (!location) {
      throw new Error('Location not found');
    }

    // Prepare data for the ML model
    // These values are temporary defaults because the current
    // frontend does not yet collect these fields from the user.
    const inputData = {
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
      event_month: new Date().getMonth() + 1,
      admin_division_name: location.state,
      landslide_trigger: 'downpour',
      landslide_category: 'landslide',
      landslide_setting: 'natural_slope',
    };

    // Send data to the FastAPI backend
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      throw new Error('Failed to get prediction from backend');
    }

    const apiResult = await response.json();

    // Keep the existing dashboard data
    // and replace its risk prediction with the real ML result.
    const existingData = getPredictionData(locationId);

    const overallRisk =
      apiResult.risk_level.toLowerCase() as PredictionData['overallRisk'];

    return {
      ...existingData,
      timestamp: new Date().toISOString(),
      overallRisk: overallRisk,
      riskScore: apiResult.risk_percentage,
      confidence: apiResult.risk_percentage,
    };
  },

  async getPrediction(locationId: string): Promise<PredictionData> {
    return getPredictionData(locationId);
  },

  getRiskColor(risk: string): string {
    switch (risk) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'moderate':
        return '#d97706';
      case 'low':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  },

  getRiskBgColor(risk: string): string {
    switch (risk) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'moderate':
        return 'bg-amber-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  },

  getRiskGradient(risk: string): string {
    switch (risk) {
      case 'critical':
        return 'from-red-600 to-red-800';
      case 'high':
        return 'from-orange-500 to-red-600';
      case 'moderate':
        return 'from-amber-400 to-orange-500';
      case 'low':
        return 'from-green-400 to-green-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  },
};