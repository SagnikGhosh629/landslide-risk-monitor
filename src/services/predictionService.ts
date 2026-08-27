import { Location, PredictionData } from '../types';
import { nerLocations, searchLocations } from '../data/locations';
import { getPredictionData } from '../data/predictions';

// Simulate API delay for realistic feel
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
    // Simulate AI analysis with realistic delay
    await delay(3000 + Math.random() * 2000);
    return getPredictionData(locationId);
  },

  async getPrediction(locationId: string): Promise<PredictionData> {
    await delay(200);
    return getPredictionData(locationId);
  },

  getRiskColor(risk: string): string {
    switch (risk) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'moderate': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  },

  getRiskBgColor(risk: string): string {
    switch (risk) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  },

  getRiskGradient(risk: string): string {
    switch (risk) {
      case 'critical': return 'from-red-600 to-red-800';
      case 'high': return 'from-orange-500 to-red-600';
      case 'moderate': return 'from-amber-400 to-orange-500';
      case 'low': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  },
};
