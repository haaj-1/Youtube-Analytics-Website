import React from 'react';
import AccuracyDashboard from '../components/tools/AccuracyDashboard/AccuracyDashboard';

const PredictiveAccuracyPage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0d1220', color: '#e2e8f0' }}>
      <header className="px-10 py-10 relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 0% 50%, rgba(239,68,68,0.07) 0%, transparent 60%)'
        }} />
        <div className="max-w-7xl mx-auto relative">
          <h1 className="text-2xl font-bold text-white mb-1">Predictive Accuracy</h1>
          <p className="text-slate-500 text-sm">
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
