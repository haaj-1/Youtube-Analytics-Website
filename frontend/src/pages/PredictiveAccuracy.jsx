// src/pages/PredictiveAccuracy.jsx
import React from 'react';
import AccuracyDashboard from '../components/tools/AccuracyDashboard/AccuracyDashboard';

const PredictiveAccuracyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - same style */}
      <header className="bg-gradient-to-r from-red-50 to-orange-100 border-b border-red-200 py-12 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-red-900 mb-2">Model Transparency</h1>
          <p className="text-red-700">
            Understanding how our AI works - model architecture, performance metrics, and limitations
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