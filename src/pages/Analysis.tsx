import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mountain, CloudRain, Droplets, Thermometer, Layers, Shield, Loader, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { predictionService } from '../services/predictionService';

const analysisSteps = [
  { label: 'Fetching location data...', icon: Mountain, duration: 800 },
  { label: 'Analyzing terrain & slope geometry...', icon: Layers, duration: 1200 },
  { label: 'Processing rainfall patterns...', icon: CloudRain, duration: 1000 },
  { label: 'Evaluating soil moisture levels...', icon: Droplets, duration: 900 },
  { label: 'Assessing temperature & humidity...', icon: Thermometer, duration: 700 },
  { label: 'Running AI prediction model...', icon: Brain, duration: 1500 },
  { label: 'Generating risk assessment...', icon: Shield, duration: 800 },
];

export default function Analysis() {
  const { selectedLocation, setPredictionData, setIsAnalyzing } = useAppStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!selectedLocation) {
      navigate('/search');
      return;
    }

    setIsAnalyzing(true);

    let stepIndex = 0;
    const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const runStep = () => {
      if (stepIndex < analysisSteps.length) {
        setCurrentStep(stepIndex);
        elapsed += analysisSteps[stepIndex].duration;
        setProgress(Math.min(95, (elapsed / totalDuration) * 100));

        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, stepIndex]);
          stepIndex++;
          runStep();
        }, analysisSteps[stepIndex].duration);
      } else {
        setProgress(100);
        predictionService.analyzeLocation(selectedLocation.id).then((data) => {
          setPredictionData(data);
          setIsAnalyzing(false);
          navigate('/prediction');
        });
      }
    };

    runStep();
  }, [selectedLocation]);

  if (!selectedLocation) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto px-4 w-full">
        {/* Location badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <Mountain className="w-4 h-4" />
            Analyzing: {selectedLocation.name}, {selectedLocation.state}
          </div>
          <h2 className="text-2xl font-bold text-white">AI Risk Assessment</h2>
          <p className="text-slate-400 text-sm mt-1">Processing environmental and geological data</p>
        </div>

        {/* Main progress */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 mb-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Analysis Progress</span>
              <span className="text-emerald-400 text-sm font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {analysisSteps.map((step, idx) => {
              const isCompleted = completedSteps.includes(idx);
              const isCurrent = idx === currentStep && !isCompleted;
              const isPending = idx > currentStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500/5'
                      : isCurrent
                      ? 'bg-emerald-500/10'
                      : 'bg-transparent opacity-40'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader className="w-5 h-5 text-emerald-400 animate-spin" />
                    ) : (
                      <step.icon className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isCompleted
                        ? 'text-emerald-300'
                        : isCurrent
                        ? 'text-white font-medium'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 text-sm font-medium">AI-Generated Assessment</p>
            <p className="text-slate-400 text-xs mt-1">
              This analysis is based on simulated data for demonstration. Always follow official government advisories and evacuation orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
