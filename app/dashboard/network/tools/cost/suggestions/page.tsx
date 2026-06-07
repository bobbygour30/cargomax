// app/optimization-suggestions/page.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';

// --- Type Definitions ---
type Suggestion = {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  category: 'Performance' | 'Cost' | 'Maintainability' | 'Security';
};

type ScenarioInput = {
  avgUsers: number;
  responseTime: number;
  serverCost: number;
  codeComplexity: number; // 1-10
  securityScore: number; // 1-10
};

// --- Helper Functions ---
const generateSuggestions = (inputs: ScenarioInput): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  // Performance suggestions based on users and response time
  if (inputs.avgUsers > 1000 && inputs.responseTime > 300) {
    suggestions.push({
      id: 'perf-1',
      title: 'Implement Database Indexing & Query Optimization',
      description: `With ${inputs.avgUsers} concurrent users and ${inputs.responseTime}ms response time, database queries are likely a bottleneck. Add proper indexes and optimize slow queries.`,
      impact: 'High',
      effort: 'Medium',
      category: 'Performance',
    });
  }

  if (inputs.responseTime > 500) {
    suggestions.push({
      id: 'perf-2',
      title: 'Add Redis Caching Layer',
      description: 'Response times exceed 500ms. Implement Redis caching for frequently accessed data to reduce latency by 60-80%.',
      impact: 'High',
      effort: 'Medium',
      category: 'Performance',
    });
  }

  // Cost optimization
  if (inputs.serverCost > 500 && inputs.avgUsers < 500) {
    suggestions.push({
      id: 'cost-1',
      title: 'Right-size Your Server Instances',
      description: `You're paying $${inputs.serverCost}/month for ${inputs.avgUsers} users. Consider downsizing or switching to reserved instances to save 30-40%.`,
      impact: 'High',
      effort: 'Low',
      category: 'Cost',
    });
  }

  if (inputs.avgUsers > 2000) {
    suggestions.push({
      id: 'cost-2',
      title: 'Implement Auto-scaling & Spot Instances',
      description: 'High user load detected. Use auto-scaling groups with spot instances for non-critical workloads to optimize costs during peak hours.',
      impact: 'Medium',
      effort: 'High',
      category: 'Cost',
    });
  }

  // Maintainability suggestions
  if (inputs.codeComplexity > 7) {
    suggestions.push({
      id: 'maintain-1',
      title: 'Reduce Technical Debt',
      description: `Code complexity score ${inputs.codeComplexity}/10 indicates high technical debt. Refactor modules, add unit tests, and implement CI/CD pipelines.`,
      impact: 'High',
      effort: 'High',
      category: 'Maintainability',
    });
  }

  if (inputs.codeComplexity > 5 && inputs.codeComplexity <= 7) {
    suggestions.push({
      id: 'maintain-2',
      title: 'Improve Code Documentation & Linting',
      description: 'Moderate complexity detected. Enforce strict linting rules, add JSDoc comments, and implement pre-commit hooks.',
      impact: 'Medium',
      effort: 'Low',
      category: 'Maintainability',
    });
  }

  // Security suggestions
  if (inputs.securityScore < 5) {
    suggestions.push({
      id: 'sec-1',
      title: 'Critical Security Hardening Required',
      description: `Security score ${inputs.securityScore}/10 is critical. Immediately implement: rate limiting, input sanitization, CSP headers, and security scanning.`,
      impact: 'High',
      effort: 'Medium',
      category: 'Security',
    });
  }

  if (inputs.securityScore >= 5 && inputs.securityScore < 8) {
    suggestions.push({
      id: 'sec-2',
      title: 'Enhance Security Monitoring',
      description: 'Implement real-time security monitoring, WAF rules, and regular dependency vulnerability scanning (Snyk/Dependabot).',
      impact: 'Medium',
      effort: 'Medium',
      category: 'Security',
    });
  }

  // Default suggestion if no specific ones apply
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'general-1',
      title: 'Continuous Optimization Review',
      description: 'Your system metrics look good! Schedule monthly performance reviews and keep monitoring key metrics for early detection of issues.',
      impact: 'Low',
      effort: 'Low',
      category: 'Maintainability',
    });
  }

  return suggestions.sort((a, b) => {
    const impactOrder = { High: 3, Medium: 2, Low: 1 };
    return impactOrder[b.impact] - impactOrder[a.impact];
  });
};

// --- UI Components ---
const ImpactBadge = ({ impact }: { impact: Suggestion['impact'] }) => {
  const styles = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[impact]}`}>
      {impact} Impact
    </span>
  );
};

const EffortBadge = ({ effort }: { effort: Suggestion['effort'] }) => {
  const styles = {
    High: 'bg-purple-100 text-purple-800 border-purple-200',
    Medium: 'bg-blue-100 text-blue-800 border-blue-200',
    Low: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[effort]}`}>
      {effort} Effort
    </span>
  );
};

const CategoryIcon = ({ category }: { category: Suggestion['category'] }) => {
  const icons = {
    Performance: '⚡',
    Cost: '💰',
    Maintainability: '🔧',
    Security: '🛡️',
  };
  return <span className="text-lg mr-2">{icons[category]}</span>;
};

// --- Main Component ---
export default function OptimizationSuggestionsPage() {
  const [inputs, setInputs] = useState<ScenarioInput>({
    avgUsers: 500,
    responseTime: 200,
    serverCost: 400,
    codeComplexity: 5,
    securityScore: 6,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputs((prev) => ({
        ...prev,
        [name]: name === 'avgUsers' || name === 'serverCost' ? parseInt(value) || 0 : parseFloat(value) || 0,
      }));
      setShowSuggestions(false);
    },
    []
  );

  const suggestions = useMemo(() => generateSuggestions(inputs), [inputs]);

  const handleAnalyze = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Optimization Assistant
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Get AI-powered optimization suggestions for your system based on real-time metrics
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">System Metrics Input</h2>
            <p className="text-sm text-gray-600 mt-1">Adjust the parameters below to get personalized recommendations</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Average Users */}
              <div>
                <label htmlFor="avgUsers" className="block text-sm font-medium text-gray-700 mb-1">
                  Average Concurrent Users
                </label>
                <input
                  type="number"
                  name="avgUsers"
                  id="avgUsers"
                  value={inputs.avgUsers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="100"
                />
                <p className="mt-1 text-xs text-gray-500">{inputs.avgUsers.toLocaleString()} users</p>
              </div>

              {/* Response Time */}
              <div>
                <label htmlFor="responseTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Average Response Time (ms)
                </label>
                <input
                  type="number"
                  name="responseTime"
                  id="responseTime"
                  value={inputs.responseTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {inputs.responseTime < 200 ? '✅ Good' : inputs.responseTime < 500 ? '⚠️ Moderate' : '❌ Slow'}
                </p>
              </div>

              {/* Server Cost */}
              <div>
                <label htmlFor="serverCost" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Server Cost ($)
                </label>
                <input
                  type="number"
                  name="serverCost"
                  id="serverCost"
                  value={inputs.serverCost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="50"
                />
                <p className="mt-1 text-xs text-gray-500">${inputs.serverCost.toLocaleString()}/month</p>
              </div>

              {/* Code Complexity */}
              <div>
                <label htmlFor="codeComplexity" className="block text-sm font-medium text-gray-700 mb-1">
                  Code Complexity (1-10)
                </label>
                <input
                  type="range"
                  name="codeComplexity"
                  id="codeComplexity"
                  value={inputs.codeComplexity}
                  onChange={handleInputChange}
                  className="w-full"
                  min="1"
                  max="10"
                  step="0.5"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Simple</span>
                  <span>Moderate</span>
                  <span>Complex</span>
                </div>
                <p className="text-center text-sm font-medium mt-1">{inputs.codeComplexity}/10</p>
              </div>

              {/* Security Score */}
              <div>
                <label htmlFor="securityScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Security Score (1-10)
                </label>
                <input
                  type="range"
                  name="securityScore"
                  id="securityScore"
                  value={inputs.securityScore}
                  onChange={handleInputChange}
                  className="w-full"
                  min="1"
                  max="10"
                  step="0.5"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
                <p className="text-center text-sm font-medium mt-1">{inputs.securityScore}/10</p>
              </div>

              {/* Analyze Button */}
              <div className="flex items-end">
                <button
                  onClick={handleAnalyze}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Generate Suggestions 🚀
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        {showSuggestions && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                Your Personalized Optimization Suggestions
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Based on your metrics, we recommend the following {suggestions.length} optimization(s)
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center">
                        <CategoryIcon category={suggestion.category} />
                        <h3 className="text-lg font-semibold text-gray-800">{suggestion.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <ImpactBadge impact={suggestion.impact} />
                        <EffortBadge effort={suggestion.effort} />
                      </div>
                    </div>
                    <p className="text-gray-600 ml-7">{suggestion.description}</p>
                    <div className="mt-3 ml-7">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium">Category: </span>
                        <span className="ml-1">{suggestion.category}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">Recommendation ID: </span>
                        <span className="ml-1 font-mono text-xs">{suggestion.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">✨ Pro Tip:</span> Start with High Impact, Low Effort suggestions first for quick wins, then plan the High Impact, High Effort changes in your next sprint.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showSuggestions && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Ready for Optimization</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Adjust the metrics above and click "Generate Suggestions" to receive AI-powered optimization recommendations for your system.
            </p>
          </div>
        )}
      </div>

      {/* Add custom animation CSS */}
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