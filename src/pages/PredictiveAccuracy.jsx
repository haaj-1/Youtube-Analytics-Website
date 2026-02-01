// src/pages/PredictiveAccuracy.jsx
import React from 'react';
import AccuracyDashboard from '../components/tools/AccuracyDashboard/AccuracyDashboard';

const PredictiveAccuracyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - same style */}
      <header className="bg-slate-bg border-b border-slate-50 py-10 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Predictive Accuracy</h1>
          <p className="text-slate-600">
            Track and analyze the accuracy of our prediction models. See how well our algorithms perform over time.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-10 py-8">
        <AccuracyDashboard />
      </div>
    </div>
  );
};

export default PredictiveAccuracyPage;