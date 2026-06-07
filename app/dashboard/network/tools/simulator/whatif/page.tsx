// app/what-if-analysis/page.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';

// --- Type Definitions ---
type Scenario = {
  id: string;
  name: string;
  description: string;
  assumptions: {
    priceChange: number; // percentage
    trafficChange: number; // percentage
    conversionChange: number; // percentage
    costReduction: number; // percentage
  };
};

type Metrics = {
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  conversionRate: number;
  customerCount: number;
};

type ComparisonResult = {
  scenario: Scenario;
  metrics: Metrics;
  difference: {
    revenue: number;
    profit: number;
    margin: number;
  };
};

// --- Helper Functions ---
const calculateMetrics = (
  baseMetrics: Metrics,
  assumptions: Scenario['assumptions']
): Metrics => {
  const newRevenue = baseMetrics.revenue * (1 + assumptions.priceChange / 100) * (1 + assumptions.trafficChange / 100);
  const newConversionRate = baseMetrics.conversionRate * (1 + assumptions.conversionChange / 100);
  const newCustomerCount = baseMetrics.customerCount * (1 + assumptions.trafficChange / 100) * (1 + assumptions.conversionChange / 100);
  const newCost = baseMetrics.cost * (1 - assumptions.costReduction / 100);
  const newProfit = newRevenue - newCost;
  const newMargin = (newProfit / newRevenue) * 100;

  return {
    revenue: Math.round(newRevenue),
    cost: Math.round(newCost),
    profit: Math.round(newProfit),
    margin: Number(newMargin.toFixed(1)),
    conversionRate: Number(newConversionRate.toFixed(2)),
    customerCount: Math.round(newCustomerCount),
  };
};

const predefinedScenarios: Scenario[] = [
  {
    id: 'optimistic',
    name: 'Optimistic Growth',
    description: 'Best case scenario with high growth in all areas',
    assumptions: {
      priceChange: 10,
      trafficChange: 30,
      conversionChange: 15,
      costReduction: 10,
    },
  },
  {
    id: 'pessimistic',
    name: 'Pessimistic Outlook',
    description: 'Worst case scenario with market downturn',
    assumptions: {
      priceChange: -5,
      trafficChange: -20,
      conversionChange: -10,
      costReduction: -5,
    },
  },
  {
    id: 'priceFocus',
    name: 'Price Optimization',
    description: 'Focus on pricing strategy',
    assumptions: {
      priceChange: 15,
      trafficChange: -5,
      conversionChange: -8,
      costReduction: 0,
    },
  },
  {
    id: 'costFocus',
    name: 'Cost Reduction',
    description: 'Focus on operational efficiency',
    assumptions: {
      priceChange: 0,
      trafficChange: 0,
      conversionChange: 0,
      costReduction: 20,
    },
  },
  {
    id: 'trafficFocus',
    name: 'Traffic Growth',
    description: 'Aggressive marketing campaign',
    assumptions: {
      priceChange: -5,
      trafficChange: 50,
      conversionChange: 5,
      costReduction: 0,
    },
  },
  {
    id: 'conversionFocus',
    name: 'Conversion Boost',
    description: 'Improve user experience and checkout',
    assumptions: {
      priceChange: 0,
      trafficChange: 0,
      conversionChange: 25,
      costReduction: 0,
    },
  },
];

// --- UI Components ---
const MetricCard = ({ title, value, prefix = '', suffix = '', change = null }: { 
  title: string; 
  value: number | string; 
  prefix?: string; 
  suffix?: string;
  change?: number | null;
}) => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <div className="flex items-baseline">
      <p className="text-2xl font-bold text-gray-900">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
      {change !== null && change !== undefined && (
        <span className={`ml-2 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
  </div>
);

const GaugeChart = ({ value, max = 100, label }: { value: number; max?: number; label: string }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            percentage > 70 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// --- Main Component ---
export default function WhatIfAnalysisPage() {
  // Base metrics state
  const [baseMetrics, setBaseMetrics] = useState<Metrics>({
    revenue: 100000,
    cost: 60000,
    profit: 40000,
    margin: 40,
    conversionRate: 3.5,
    customerCount: 5000,
  });

  // Custom scenario state
  const [customAssumptions, setCustomAssumptions] = useState({
    priceChange: 0,
    trafficChange: 0,
    conversionChange: 0,
    costReduction: 0,
  });

  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [showCustomScenario, setShowCustomScenario] = useState(false);

  // Calculate custom scenario metrics
  const customMetrics = useMemo(
    () => calculateMetrics(baseMetrics, customAssumptions),
    [baseMetrics, customAssumptions]
  );

  // Calculate predefined scenarios metrics
  const scenarioResults = useMemo(() => {
    const results: ComparisonResult[] = [];
    for (const scenario of predefinedScenarios) {
      const metrics = calculateMetrics(baseMetrics, scenario.assumptions);
      results.push({
        scenario,
        metrics,
        difference: {
          revenue: ((metrics.revenue - baseMetrics.revenue) / baseMetrics.revenue) * 100,
          profit: ((metrics.profit - baseMetrics.profit) / baseMetrics.profit) * 100,
          margin: metrics.margin - baseMetrics.margin,
        },
      });
    }
    return results;
  }, [baseMetrics]);

  // Handle input changes for base metrics
  const handleBaseMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setBaseMetrics((prev) => {
      const newMetrics = { ...prev, [name]: numValue };
      // Recalculate profit and margin if revenue or cost changes
      if (name === 'revenue' || name === 'cost') {
        newMetrics.profit = newMetrics.revenue - newMetrics.cost;
        newMetrics.margin = (newMetrics.profit / newMetrics.revenue) * 100;
      }
      return newMetrics;
    });
    setSelectedScenarioId(null);
  };

  // Handle custom assumption changes
  const handleCustomAssumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomAssumptions((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
    setSelectedScenarioId(null);
  };

  // Apply predefined scenario
  const applyScenario = (scenario: Scenario) => {
    setCustomAssumptions(scenario.assumptions);
    setSelectedScenarioId(scenario.id);
    setShowCustomScenario(true);
  };

  // Reset to baseline
  const resetToBaseline = () => {
    setCustomAssumptions({
      priceChange: 0,
      trafficChange: 0,
      conversionChange: 0,
      costReduction: 0,
    });
    setSelectedScenarioId(null);
    setShowCustomScenario(false);
  };

  // Get selected scenario name for display
  const selectedScenario = predefinedScenarios.find(s => s.id === selectedScenarioId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            What-If Analysis
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Simulate different business scenarios and see their impact on key metrics
          </p>
        </div>

        {/* Base Metrics Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">📊 Current Business Metrics</h2>
            <p className="text-sm text-gray-600 mt-1">Edit these baseline values to customize your analysis</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Revenue ($)</label>
                <input
                  type="number"
                  name="revenue"
                  value={baseMetrics.revenue}
                  onChange={handleBaseMetricChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Cost ($)</label>
                <input
                  type="number"
                  name="cost"
                  value={baseMetrics.cost}
                  onChange={handleBaseMetricChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Rate (%)</label>
                <input
                  type="number"
                  name="conversionRate"
                  value={baseMetrics.conversionRate}
                  onChange={handleBaseMetricChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <MetricCard title="Current Profit" value={baseMetrics.profit} prefix="$" />
              <MetricCard title="Current Margin" value={baseMetrics.margin} suffix="%" />
              <MetricCard title="Monthly Customers" value={baseMetrics.customerCount} />
            </div>
          </div>
        </div>

        {/* Predefined Scenarios */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🎯 Quick Scenarios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {predefinedScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => applyScenario(scenario)}
                className={`text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  selectedScenarioId === scenario.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800">{scenario.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{scenario.description}</p>
                <div className="mt-2 text-xs text-gray-400">
                  Price: {scenario.assumptions.priceChange > 0 ? '+' : ''}{scenario.assumptions.priceChange}% | 
                  Traffic: {scenario.assumptions.trafficChange > 0 ? '+' : ''}{scenario.assumptions.trafficChange}% | 
                  Conversion: {scenario.assumptions.conversionChange > 0 ? '+' : ''}{scenario.assumptions.conversionChange}% | 
                  Cost: {scenario.assumptions.costReduction > 0 ? '-' : '+'}{Math.abs(scenario.assumptions.costReduction)}%
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Scenario Builder */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">🔧 Custom Scenario Builder</h2>
              <p className="text-sm text-gray-600 mt-1">Adjust sliders to create your own what-if scenario</p>
            </div>
            <button
              onClick={resetToBaseline}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Reset to Baseline
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Change: <span className="font-bold text-indigo-600">{customAssumptions.priceChange > 0 ? '+' : ''}{customAssumptions.priceChange}%</span>
                </label>
                <input
                  type="range"
                  name="priceChange"
                  value={customAssumptions.priceChange}
                  onChange={handleCustomAssumptionChange}
                  min="-30"
                  max="30"
                  step="1"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-30% (Discount)</span>
                  <span>0%</span>
                  <span>+30% (Premium)</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traffic Change: <span className="font-bold text-indigo-600">{customAssumptions.trafficChange > 0 ? '+' : ''}{customAssumptions.trafficChange}%</span>
                </label>
                <input
                  type="range"
                  name="trafficChange"
                  value={customAssumptions.trafficChange}
                  onChange={handleCustomAssumptionChange}
                  min="-50"
                  max="100"
                  step="1"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-50%</span>
                  <span>0%</span>
                  <span>+100%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conversion Change: <span className="font-bold text-indigo-600">{customAssumptions.conversionChange > 0 ? '+' : ''}{customAssumptions.conversionChange}%</span>
                </label>
                <input
                  type="range"
                  name="conversionChange"
                  value={customAssumptions.conversionChange}
                  onChange={handleCustomAssumptionChange}
                  min="-50"
                  max="50"
                  step="1"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-50%</span>
                  <span>0%</span>
                  <span>+50%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Reduction: <span className="font-bold text-indigo-600">{customAssumptions.costReduction > 0 ? '-' : '+'}{Math.abs(customAssumptions.costReduction)}%</span>
                </label>
                <input
                  type="range"
                  name="costReduction"
                  value={customAssumptions.costReduction}
                  onChange={handleCustomAssumptionChange}
                  min="-20"
                  max="40"
                  step="1"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>+20% (Increase)</span>
                  <span>0%</span>
                  <span>-40% (Reduce)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showCustomScenario && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">📈</span>
                Scenario Results: {selectedScenario ? selectedScenario.name : 'Custom Scenario'}
              </h2>
              {selectedScenario && (
                <p className="text-sm text-gray-600 mt-1">{selectedScenario.description}</p>
              )}
            </div>
            <div className="p-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Projected Revenue</div>
                  <div className="text-2xl font-bold text-gray-900">${customMetrics.revenue.toLocaleString()}</div>
                  <div className={`text-sm ${customMetrics.revenue >= baseMetrics.revenue ? 'text-green-600' : 'text-red-600'}`}>
                    {customMetrics.revenue >= baseMetrics.revenue ? '↑' : '↓'} {Math.abs(((customMetrics.revenue - baseMetrics.revenue) / baseMetrics.revenue) * 100).toFixed(1)}% vs baseline
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Projected Profit</div>
                  <div className="text-2xl font-bold text-gray-900">${customMetrics.profit.toLocaleString()}</div>
                  <div className={`text-sm ${customMetrics.profit >= baseMetrics.profit ? 'text-green-600' : 'text-red-600'}`}>
                    {customMetrics.profit >= baseMetrics.profit ? '↑' : '↓'} {Math.abs(((customMetrics.profit - baseMetrics.profit) / baseMetrics.profit) * 100).toFixed(1)}% vs baseline
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Projected Margin</div>
                  <div className="text-2xl font-bold text-gray-900">{customMetrics.margin}%</div>
                  <div className={`text-sm ${customMetrics.margin >= baseMetrics.margin ? 'text-green-600' : 'text-red-600'}`}>
                    {customMetrics.margin >= baseMetrics.margin ? '+' : ''}{(customMetrics.margin - baseMetrics.margin).toFixed(1)}% vs baseline
                  </div>
                </div>
              </div>

              {/* Detailed Comparison */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Detailed Impact Analysis</h3>
                <div className="space-y-3">
                  <GaugeChart value={customMetrics.margin} max={100} label="Profit Margin" />
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Customer Count:</span>
                    <span className="font-semibold">{customMetrics.customerCount.toLocaleString()}</span>
                    <span className={`text-sm ${customMetrics.customerCount >= baseMetrics.customerCount ? 'text-green-600' : 'text-red-600'}`}>
                      {customMetrics.customerCount >= baseMetrics.customerCount ? '+' : ''}{((customMetrics.customerCount - baseMetrics.customerCount) / baseMetrics.customerCount * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Conversion Rate:</span>
                    <span className="font-semibold">{customMetrics.conversionRate}%</span>
                    <span className={`text-sm ${customMetrics.conversionRate >= baseMetrics.conversionRate ? 'text-green-600' : 'text-red-600'}`}>
                      {customMetrics.conversionRate >= baseMetrics.conversionRate ? '+' : ''}{(customMetrics.conversionRate - baseMetrics.conversionRate).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm text-indigo-800">
                  <span className="font-semibold">💡 Insight:</span>{' '}
                  {customMetrics.profit > baseMetrics.profit
                    ? `This scenario would increase your profit by $${(customMetrics.profit - baseMetrics.profit).toLocaleString()} (${(((customMetrics.profit - baseMetrics.profit) / baseMetrics.profit) * 100).toFixed(1)}%). Consider implementing these changes gradually to minimize risk.`
                    : `This scenario would reduce your profit by $${(baseMetrics.profit - customMetrics.profit).toLocaleString()}. Review your assumptions and consider alternative strategies.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scenario Comparison Table */}
        {!showCustomScenario && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">📊 Scenario Comparison</h2>
              <p className="text-sm text-gray-600 mt-1">Compare all scenarios side by side</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">vs Baseline</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scenarioResults.map((result) => (
                    <tr key={result.scenario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{result.scenario.name}</div>
                        <div className="text-xs text-gray-500">{result.scenario.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${result.metrics.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${result.metrics.profit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.metrics.margin}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.difference.profit > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.difference.profit > 0 ? '+' : ''}{result.difference.profit.toFixed(1)}% profit
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}