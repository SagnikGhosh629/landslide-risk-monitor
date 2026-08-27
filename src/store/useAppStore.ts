import { create } from 'zustand';
import { Location, PredictionData } from '../types';

interface AppState {
  selectedLocation: Location | null;
  searchQuery: string;
  predictionData: PredictionData | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  error: string | null;
  setSelectedLocation: (location: Location | null) => void;
  setSearchQuery: (query: string) => void;
  setPredictionData: (data: PredictionData | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisProgress: (v: number) => void;
  setError: (err: string | null) => void;
  resetAnalysis: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLocation: null,
  searchQuery: '',
  predictionData: null,
  isAnalyzing: false,
  analysisProgress: 0,
  error: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPredictionData: (data) => set({ predictionData: data }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setAnalysisProgress: (v) => set({ analysisProgress: v }),
  setError: (err) => set({ error: err }),
  resetAnalysis: () =>
    set({
      selectedLocation: null,
      predictionData: null,
      isAnalyzing: false,
      analysisProgress: 0,
      error: null,
    }),
}));
