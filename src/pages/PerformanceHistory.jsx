// src/pages/PerformanceHistory.jsx
import React from 'react';
import PerformanceHistory from '../components/tools/PerformanceHistory/PerformanceHistory';

const PerformanceHistoryPage = () => {
  return (
    <div className="min-h-screen bg-slate-bg antialiased">
      {/* Header - same style but with different background */}
      <header className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 py-12 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Performance History</h1>
          <p className="text-green-700">
            Track and analyze your historical Instagram performance. See trends and patterns over time.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-10 py-8">
        <PerformanceHistory />
      </div>
    </div>
  );
};

export default PerformanceHistoryPage;