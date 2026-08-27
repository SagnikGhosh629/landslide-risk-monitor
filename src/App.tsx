import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './component/Layout';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import Analysis from './pages/Analysis';
import PredictionResult from './pages/PredictionResult';
import PredictionDetails from './pages/PredictionDetails';
import RiskMap from './pages/RiskMap';
import SafetyRecommendations from './pages/SafetyRecommendations';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Emergency from './pages/Emergency';
import NerDashboard from './pages/NerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="prediction" element={<PredictionResult />} />
          <Route path="details" element={<PredictionDetails />} />
          <Route path="risk-map" element={<RiskMap />} />
          <Route path="recommendations" element={<SafetyRecommendations />} />
          <Route path="about" element={<About />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="dashboard" element={<NerDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
