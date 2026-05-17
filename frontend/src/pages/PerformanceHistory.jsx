import React from 'react';
import PerformanceHistory from '../components/tools/PerformanceHistory/PerformanceHistory';

const PerformanceHistoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <header className="bg-white border-b border-gray-200 px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Performance History</h1>
          <p className="text-gray-500 text-sm">
            Track and analyze your historical YouTube performance trends over time.
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
