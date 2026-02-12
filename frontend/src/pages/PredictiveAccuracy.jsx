// src/pages/PredictiveAccuracy.jsx
import React from 'react';
import AccuracyDashboard from '../components/tools/AccuracyDashboard/AccuracyDashboard';

const PredictiveAccuracyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - same style */}
      <header className="bg-gradient-to-r from-blue-50 to-purple-100 border-b border-blue-200 py-12 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Model Transparency</h1>
          <p className="text-blue-700">
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