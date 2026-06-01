// app/load-testing/page.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

// --- Type Definitions ---
type TestConfig = {
  concurrentUsers: number;
  requestsPerSecond: number;
  testDuration: number; // in seconds
  endpoint: string;
  requestType: 'GET' | 'POST' | 'PUT' | 'DELETE';
  payload?: string;
};

type RequestResult = {
  timestamp: number;
  responseTime: number;
  statusCode: number;
  success: boolean;
  error?: string;
};

type TestMetrics = {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
};

type TestStatus = 'idle' | 'running' | 'completed' | 'stopped';

// --- Helper Functions ---
const calculateMetrics = (results: RequestResult[]): TestMetrics => {
  if (results.length === 0) {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      requestsPerSecond: 0,
      errorRate: 0,
    };
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const responseTimes = results.map(r => r.responseTime).sort((a, b) => a - b);
  const totalTime = (results[results.length - 1]?.timestamp - results[0]?.timestamp) / 1000 || 1;

  const p95Index = Math.floor(responseTimes.length * 0.95);
  const p99Index = Math.floor(responseTimes.length * 0.99);

  return {
    totalRequests: results.length,
    successfulRequests: successful,
    failedRequests: failed,
    avgResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / results.length),
    minResponseTime: responseTimes[0],
    maxResponseTime: responseTimes[responseTimes.length - 1],
    p95ResponseTime: responseTimes[p95Index] || 0,
    p99ResponseTime: responseTimes[p99Index] || 0,
    requestsPerSecond: Number((results.length / totalTime).toFixed(1)),
    errorRate: (failed / results.length) * 100,
  };
};

const simulateRequest = async (config: TestConfig): Promise<RequestResult> => {
  const startTime = performance.now();
  try {
    // Simulate API call with random delay and potential failure
    const simulateNetworkDelay = Math.random() * 200 + 50; // 50-250ms
    await new Promise(resolve => setTimeout(resolve, simulateNetworkDelay));
    
    // Simulate random failures (10% chance)
    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      throw new Error('Request failed');
    }

    const responseTime = performance.now() - startTime;
    return {
      timestamp: Date.now(),
      responseTime: Math.round(responseTime),
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    const responseTime = performance.now() - startTime;
    return {
      timestamp: Date.now(),
      responseTime: Math.round(responseTime),
      statusCode: 500,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// --- UI Components ---
const MetricCard = ({ title, value, unit = '', icon, color = 'blue' }: { 
  title: string; 
  value: string | number; 
  unit?: string;
  icon: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: TestStatus }) => {
  const styles = {
    idle: 'bg-gray-100 text-gray-800',
    running: 'bg-green-100 text-green-800 animate-pulse',
    completed: 'bg-blue-100 text-blue-800',
    stopped: 'bg-red-100 text-red-800',
  };

  const labels = {
    idle: 'Ready',
    running: 'Running Test...',
    completed: 'Completed',
    stopped: 'Stopped',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// --- Main Component ---
export default function LoadTestingPage() {
  const [testConfig, setTestConfig] = useState<TestConfig>({
    concurrentUsers: 10,
    requestsPerSecond: 5,
    testDuration: 30,
    endpoint: 'https://api.example.com/v1/users',
    requestType: 'GET',
    payload: '{"userId": 123}',
  });

  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [results, setResults] = useState<RequestResult[]>([]);
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [liveResults, setLiveResults] = useState<RequestResult[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isTestRunningRef = useRef<boolean>(false);

  // Update metrics when live results change
  useEffect(() => {
    if (liveResults.length > 0) {
      const newMetrics = calculateMetrics(liveResults);
      setMetrics(newMetrics);
    }
  }, [liveResults]);

  // Timer for test duration
  useEffect(() => {
    if (testStatus === 'running' && startTimeRef.current) {
      const timer = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setElapsedTime(Math.round(elapsed));
          
          if (elapsed >= testConfig.testDuration) {
            stopTest();
          }
        }
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [testStatus, testConfig.testDuration]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTestConfig(prev => ({
      ...prev,
      [name]: name === 'concurrentUsers' || name === 'requestsPerSecond' || name === 'testDuration'
        ? parseInt(value) || 0
        : value,
    }));
  };

  const sendRequest = useCallback(async () => {
    const result = await simulateRequest(testConfig);
    setLiveResults(prev => [...prev, result]);
  }, [testConfig]);

  const runLoadTest = useCallback(async () => {
    setIsLoading(true);
    setTestStatus('running');
    setLiveResults([]);
    setResults([]);
    setElapsedTime(0);
    startTimeRef.current = Date.now();
    isTestRunningRef.current = true;

    const requestsPerSecond = testConfig.requestsPerSecond;
    const intervalMs = 1000 / requestsPerSecond;
    let lastRequestTime = Date.now();

    const scheduleNextRequest = () => {
      if (!isTestRunningRef.current) return;
      
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      const delay = Math.max(0, intervalMs - timeSinceLastRequest);
      
      setTimeout(async () => {
        if (isTestRunningRef.current) {
          // Send batch of concurrent requests
          const batchPromises = [];
          for (let i = 0; i < testConfig.concurrentUsers; i++) {
            if (!isTestRunningRef.current) break;
            batchPromises.push(sendRequest());
          }
          await Promise.all(batchPromises);
          
          if (isTestRunningRef.current) {
            lastRequestTime = Date.now();
            scheduleNextRequest();
          }
        }
      }, delay);
    };

    scheduleNextRequest();
    setIsLoading(false);
  }, [testConfig, sendRequest]);

  const stopTest = useCallback(() => {
    isTestRunningRef.current = false;
    if (testIntervalRef.current) {
      clearInterval(testIntervalRef.current);
      testIntervalRef.current = null;
    }
    setTestStatus('stopped');
    setResults(liveResults);
    startTimeRef.current = null;
  }, [liveResults]);

  const startTest = useCallback(() => {
    if (testStatus === 'running' || isLoading) return;
    setTestStatus('idle');
    runLoadTest();
  }, [runLoadTest, testStatus, isLoading]);

  const resetTest = useCallback(() => {
    if (testStatus === 'running') {
      stopTest();
    }
    setResults([]);
    setLiveResults([]);
    setMetrics(null);
    setElapsedTime(0);
    setTestStatus('idle');
    setIsLoading(false);
    isTestRunningRef.current = false;
    startTimeRef.current = null;
  }, [stopTest, testStatus]);

  const exportResults = useCallback(() => {
    const data = {
      config: testConfig,
      metrics: metrics,
      results: results.length > 0 ? results : liveResults,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `load-test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [testConfig, metrics, results, liveResults]);

  const getResponseTimeColor = (time: number) => {
    if (time < 100) return 'text-green-600';
    if (time < 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isTestRunning = testStatus === 'running';
  const displayResults = liveResults.length > 0 ? liveResults : results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            🚀 Load Testing Suite
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Simulate high-traffic scenarios and analyze your application's performance under load
          </p>
        </div>

        {/* Test Configuration */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">⚙️ Test Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">Configure your load test parameters</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concurrent Users
                </label>
                <input
                  type="number"
                  name="concurrentUsers"
                  value={testConfig.concurrentUsers}
                  onChange={handleConfigChange}
                  disabled={isTestRunning}
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Number of simultaneous virtual users</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requests Per Second
                </label>
                <input
                  type="number"
                  name="requestsPerSecond"
                  value={testConfig.requestsPerSecond}
                  onChange={handleConfigChange}
                  disabled={isTestRunning}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Target request rate</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Duration (seconds)
                </label>
                <input
                  type="number"
                  name="testDuration"
                  value={testConfig.testDuration}
                  onChange={handleConfigChange}
                  disabled={isTestRunning}
                  min="5"
                  max="300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">How long the test will run</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Type
                </label>
                <select
                  name="requestType"
                  value={testConfig.requestType}
                  onChange={handleConfigChange}
                  disabled={isTestRunning}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Endpoint
                </label>
                <input
                  type="text"
                  name="endpoint"
                  value={testConfig.endpoint}
                  onChange={handleConfigChange}
                  disabled={isTestRunning}
                  placeholder="https://api.example.com/endpoint"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="mt-6 flex gap-3">
              {!isTestRunning ? (
                <button
                  onClick={startTest}
                  disabled={isTestRunning || isLoading}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Starting...' : '🚀 Start Load Test'}
                </button>
              ) : (
                <button
                  onClick={stopTest}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
                >
                  ⏹️ Stop Test
                </button>
              )}
              <button
                onClick={resetTest}
                disabled={isTestRunning}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 Reset
              </button>
              {displayResults.length > 0 && !isTestRunning && (
                <button
                  onClick={exportResults}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
                >
                  📥 Export Results
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Test Status & Metrics */}
        {(testStatus !== 'idle' || metrics) && (
          <div className="space-y-6">
            {/* Status Bar */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={testStatus} />
                {isTestRunning && (
                  <div className="text-sm text-gray-600">
                    Elapsed: {elapsedTime}s / {testConfig.testDuration}s
                  </div>
                )}
              </div>
              {isTestRunning && (
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(elapsedTime / testConfig.testDuration) * 100}%` }}
                  />
                </div>
              )}
              {metrics && (
                <div className="text-sm font-medium text-gray-600">
                  Total Requests: {metrics.totalRequests}
                </div>
              )}
            </div>

            {/* Metrics Grid */}
            {metrics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Requests"
                  value={metrics.totalRequests}
                  icon="📊"
                  color="blue"
                />
                <MetricCard
                  title="Success Rate"
                  value={`${(100 - metrics.errorRate).toFixed(1)}%`}
                  icon="✅"
                  color="green"
                />
                <MetricCard
                  title="Avg Response Time"
                  value={metrics.avgResponseTime}
                  unit="ms"
                  icon="⚡"
                  color={metrics.avgResponseTime < 200 ? 'green' : metrics.avgResponseTime < 500 ? 'yellow' : 'red'}
                />
                <MetricCard
                  title="Error Rate"
                  value={`${metrics.errorRate.toFixed(1)}%`}
                  icon="❌"
                  color={metrics.errorRate < 5 ? 'green' : metrics.errorRate < 10 ? 'yellow' : 'red'}
                />
                <MetricCard
                  title="P95 Response Time"
                  value={metrics.p95ResponseTime}
                  unit="ms"
                  icon="📈"
                  color="purple"
                />
                <MetricCard
                  title="P99 Response Time"
                  value={metrics.p99ResponseTime}
                  unit="ms"
                  icon="🎯"
                  color="purple"
                />
                <MetricCard
                  title="RPS"
                  value={metrics.requestsPerSecond}
                  unit="req/s"
                  icon="🔄"
                  color="blue"
                />
                <MetricCard
                  title="Failed Requests"
                  value={metrics.failedRequests}
                  icon="⚠️"
                  color="red"
                />
              </div>
            )}

            {/* Live Results Table */}
            {displayResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    📝 Request Log {isTestRunning && '(Live)'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Showing last {Math.min(displayResults.length, 50)} of {displayResults.length} requests
                  </p>
                </div>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayResults.slice().reverse().slice(0, 50).map((result, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm text-gray-600">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </td>
                          <td className={`px-6 py-3 text-sm font-medium ${getResponseTimeColor(result.responseTime)}`}>
                            {result.responseTime} ms
                          </td>
                          <td className="px-6 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.success ? `✓ ${result.statusCode}` : `✗ ${result.statusCode}`}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-500">
                            {result.error || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {testStatus === 'idle' && !metrics && displayResults.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🧪</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Ready for Load Testing</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Configure your test parameters and click "Start Load Test" to begin analyzing your application's performance under load.
            </p>
          </div>
        )}

        {/* Recommendations */}
        {metrics && !isTestRunning && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Performance Insights</h4>
            <div className="space-y-1 text-sm text-yellow-700">
              {metrics.avgResponseTime > 500 && (
                <p>• High average response time ({metrics.avgResponseTime}ms). Consider optimizing database queries and adding caching.</p>
              )}
              {metrics.errorRate > 5 && (
                <p>• Error rate is {metrics.errorRate.toFixed(1)}%. Check server logs and implement retry logic with exponential backoff.</p>
              )}
              {metrics.p95ResponseTime > metrics.avgResponseTime * 2 && (
                <p>• High variance in response times. Investigate slow queries and consider connection pooling.</p>
              )}
              {metrics.avgResponseTime <= 200 && metrics.errorRate <= 2 && (
                <p>• Great performance! Your application handles load well. Consider increasing concurrent users to find the breaking point.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}