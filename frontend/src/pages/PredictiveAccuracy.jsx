// src/pages/PredictiveAccuracy.jsx
import React from 'react';
import AccuracyDashboard from '../components/tools/AccuracyDashboard/AccuracyDashboard';

const PredictiveAccuracyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - same style */}
      <header className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 py-12 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-red-900 mb-2">Predictive Accuracy</h1>
          <p className="text-red-700">
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