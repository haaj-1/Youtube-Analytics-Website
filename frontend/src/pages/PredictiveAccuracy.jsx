import React from 'react';
import AccuracyDashboard from '../components/tools/AccuracyDashboard/AccuracyDashboard';

const PredictiveAccuracyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Predictive Accuracy</h1>
          <p className="text-gray-500 text-sm">
            Model architecture, performance metrics, and limitations — fully transparent.
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
