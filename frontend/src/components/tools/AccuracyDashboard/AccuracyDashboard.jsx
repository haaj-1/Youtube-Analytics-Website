// src/components/tools/AccuracyDashboard/AccuracyDashboard.jsx
import React, { useState } from 'react';
import './AccuracyDashboard.css';

const AccuracyDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const accuracyData = {
    overallAccuracy: 86.4,
    modelVersion: 'v2.1.3',
    lastUpdated: '2024-01-26',
    metrics: [
      { label: 'Likes Prediction', value: 88.2, trend: 'up' },
      { label: 'Comments Prediction', value: 82.5, trend: 'up' },
      { label: 'Saves Prediction', value: 84.7, trend: 'stable' },
      { label: 'Engagement Rate', value: 85.9, trend: 'up' },
    ],
    dailyAccuracy: [
      { date: 'Jan 20', accuracy: 85.2 },
      { date: 'Jan 21', accuracy: 86.1 },
      { date: 'Jan 22', accuracy: 84.8 },
      { date: 'Jan 23', accuracy: 87.3 },
      { date: 'Jan 24', accuracy: 86.5 },
      { date: 'Jan 25', accuracy: 87.9 },
      { date: 'Jan 26', accuracy: 86.4 },
    ],
    modelComparison: [
      { version: 'v2.1.3', accuracy: 86.4, date: 'Jan 2024' },
      { version: 'v2.1.2', accuracy: 84.7, date: 'Dec 2023' },
      { version: 'v2.1.1', accuracy: 82.1, date: 'Nov 2023' },
      { version: 'v2.1.0', accuracy: 79.8, date: 'Oct 2023' },
    ]
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Model Accuracy Dashboard</h2>
            <p className="text-slate-600 mt-1">Track prediction accuracy and model performance over time</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {['7d', '30d', '90d', 'all'].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Overall Accuracy Card */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="text-sm font-medium text-blue-100 mb-2">Overall Accuracy</div>
              <div className="text-5xl font-bold mb-2">{accuracyData.overallAccuracy}%</div>
              <div className="flex items-center text-blue-100">
                <span className="mr-2">↑</span>
                <span>+2.3% from last month</span>
              </div>
              <div className="text-sm text-blue-100/80 mt-4">
                Model: {accuracyData.modelVersion} • Updated: {accuracyData.lastUpdated}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="text-sm font-medium text-slate-600 mb-4">Accuracy Trend</div>
              <div className="flex items-end h-24 space-x-2">
                {accuracyData.dailyAccuracy.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg"
                      style={{ height: `${(day.accuracy - 80) * 4}px` }}
                    ></div>
                    <div className="text-xs text-slate-500 mt-2">{day.date}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="text-sm font-medium text-slate-600 mb-4">Prediction Errors</div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">RMSE</span>
                    <span className="font-medium text-slate-900">142.3</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 rounded-full h-2" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">MAE</span>
                    <span className="font-medium text-slate-900">89.7</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-500 rounded-full h-2" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Prediction Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {accuracyData.metrics.map((metric, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-slate-700">{metric.label}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'bg-green-100 text-green-800' :
                    metric.trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {metric.trend === 'up' ? '↑ Improving' : metric.trend === 'down' ? '↓ Declining' : '→ Stable'}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">{metric.value}%</div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2"
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Model Version Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Version</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Accuracy</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Release Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Change</th>
                </tr>
              </thead>
              <tbody>
                {accuracyData.modelComparison.map((model, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{model.version}</div>
                      {index === 0 && <div className="text-xs text-blue-600 font-medium">Current</div>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{model.accuracy}%</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{model.date}</td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-green-100 text-green-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {index === 0 ? 'Active' : 'Archived'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center text-sm font-medium ${
                        index > 0 && model.accuracy > accuracyData.modelComparison[index - 1]?.accuracy
                          ? 'text-green-600'
                          : index > 0 ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {index > 0 ? (
                          <>
                            {model.accuracy > accuracyData.modelComparison[index - 1]?.accuracy ? '↑' : '↓'}
                            {Math.abs(model.accuracy - accuracyData.modelComparison[index - 1]?.accuracy).toFixed(1)}%
                          </>
                        ) : '—'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccuracyDashboard;