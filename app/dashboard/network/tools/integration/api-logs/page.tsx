// app/api-logs/page.tsx
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';

// --- Type Definitions ---
type LogLevel = 'info' | 'warning' | 'error' | 'debug';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

type ApiLog = {
  id: string;
  timestamp: Date;
  method: HttpMethod;
  endpoint: string;
  statusCode: number;
  responseTime: number; // in milliseconds
  level: LogLevel;
  requestBody?: any;
  responseBody?: any;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
};

type LogFilter = {
  level: LogLevel | 'all';
  method: HttpMethod | 'all';
  statusCode: string;
  search: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
};

type LogStats = {
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  successRate: number;
  requestsByMethod: Record<HttpMethod, number>;
  requestsByStatus: Record<number, number>;
  topEndpoints: { endpoint: string; count: number }[];
};

// --- Mock Data Generator ---
const generateMockLogs = (count: number = 100): ApiLog[] => {
  const endpoints = [
    '/api/users', '/api/products', '/api/orders', '/api/auth/login',
    '/api/auth/logout', '/api/payments', '/api/webhooks', '/api/reports',
    '/api/settings', '/api/notifications', '/api/search', '/api/analytics'
  ];
  
  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const statusCodes = [200, 201, 204, 400, 401, 403, 404, 500, 502, 503];
  
  const logs: ApiLog[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const method = methods[Math.floor(Math.random() * methods.length)];
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    const responseTime = Math.floor(Math.random() * 1000) + 10;
    
    let level: LogLevel = 'info';
    if (statusCode >= 500) level = 'error';
    else if (statusCode >= 400) level = 'warning';
    else level = 'info';
    
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    logs.push({
      id: `log-${i}-${Date.now()}`,
      timestamp,
      method,
      endpoint,
      statusCode,
      responseTime,
      level,
      requestBody: method !== 'GET' ? { key: 'value', test: Math.random() > 0.5 ? 'data' : undefined } : undefined,
      responseBody: { success: statusCode < 400, data: { id: i, name: `Item ${i}` } },
      headers: { 'content-type': 'application/json', 'authorization': 'Bearer ***' },
      queryParams: method === 'GET' ? { page: '1', limit: '10', sort: 'desc' } : undefined,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: Math.random() > 0.5 ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      errorMessage: statusCode >= 400 ? `Error: ${statusCode} - Something went wrong` : undefined,
    });
  }
  
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// --- Helper Functions ---
const calculateStats = (logs: ApiLog[]): LogStats => {
  if (logs.length === 0) {
    return {
      totalRequests: 0,
      avgResponseTime: 0,
      errorRate: 0,
      successRate: 0,
      requestsByMethod: {} as Record<HttpMethod, number>,
      requestsByStatus: {},
      topEndpoints: [],
    };
  }

  const successful = logs.filter(l => l.statusCode < 400).length;
  const failed = logs.filter(l => l.statusCode >= 400).length;
  const avgResponseTime = Math.round(logs.reduce((sum, l) => sum + l.responseTime, 0) / logs.length);
  
  const requestsByMethod: Record<HttpMethod, number> = {} as Record<HttpMethod, number>;
  const requestsByStatus: Record<number, number> = {};
  const endpointCount: Record<string, number> = {};
  
  logs.forEach(log => {
    requestsByMethod[log.method] = (requestsByMethod[log.method] || 0) + 1;
    requestsByStatus[log.statusCode] = (requestsByStatus[log.statusCode] || 0) + 1;
    endpointCount[log.endpoint] = (endpointCount[log.endpoint] || 0) + 1;
  });
  
  const topEndpoints = Object.entries(endpointCount)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    totalRequests: logs.length,
    avgResponseTime,
    errorRate: (failed / logs.length) * 100,
    successRate: (successful / logs.length) * 100,
    requestsByMethod,
    requestsByStatus,
    topEndpoints,
  };
};

const getStatusColor = (statusCode: number): string => {
  if (statusCode < 300) return 'text-green-600 bg-green-50';
  if (statusCode < 400) return 'text-blue-600 bg-blue-50';
  if (statusCode < 500) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

const getLevelIcon = (level: LogLevel): string => {
  switch (level) {
    case 'info': return 'ℹ️';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    case 'debug': return '🐛';
    default: return '📝';
  }
};

// --- UI Components ---
const StatCard = ({ title, value, unit = '', icon, trend }: any) => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
      {trend !== undefined && (
        <span className={`ml-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

const LogDetailModal = ({ log, onClose }: { log: ApiLog | null; onClose: () => void }) => {
  if (!log) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Request Details</h3>
            <p className="text-sm text-gray-500">{log.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase">Method</label>
              <p className="font-mono font-semibold">{log.method}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Status</label>
              <p className={`inline-block px-2 py-1 rounded text-sm font-medium ${getStatusColor(log.statusCode)}`}>
                {log.statusCode}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Response Time</label>
              <p className="font-mono">{log.responseTime}ms</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Timestamp</label>
              <p className="text-sm">{log.timestamp.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Endpoint */}
          <div>
            <label className="text-xs text-gray-500 uppercase">Endpoint</label>
            <p className="font-mono text-sm bg-gray-50 p-2 rounded">{log.endpoint}</p>
          </div>
          
          {/* Headers */}
          {log.headers && Object.keys(log.headers).length > 0 && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Headers</label>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.headers, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Query Params */}
          {log.queryParams && Object.keys(log.queryParams).length > 0 && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Query Parameters</label>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.queryParams, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Request Body */}
          {log.requestBody && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Request Body</label>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.requestBody, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Response Body */}
          {log.responseBody && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Response Body</label>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(log.responseBody, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Error Message */}
          {log.errorMessage && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Error Message</label>
              <div className="bg-red-50 text-red-800 p-3 rounded text-sm">{log.errorMessage}</div>
            </div>
          )}
          
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div>
              <label className="text-xs text-gray-500 uppercase">IP Address</label>
              <p className="text-sm font-mono">{log.ipAddress || '-'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">User Agent</label>
              <p className="text-xs text-gray-600">{log.userAgent || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function ApiLogsPage() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ApiLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [filter, setFilter] = useState<LogFilter>({
    level: 'all',
    method: 'all',
    statusCode: '',
    search: '',
    dateRange: { start: null, end: null },
  });
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize logs
  useEffect(() => {
    const initialLogs = generateMockLogs(150);
    setLogs(initialLogs);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...logs];
    
    // Filter by level
    if (filter.level !== 'all') {
      filtered = filtered.filter(log => log.level === filter.level);
    }
    
    // Filter by method
    if (filter.method !== 'all') {
      filtered = filtered.filter(log => log.method === filter.method);
    }
    
    // Filter by status code
    if (filter.statusCode) {
      filtered = filtered.filter(log => log.statusCode.toString().startsWith(filter.statusCode));
    }
    
    // Filter by search text
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.endpoint.toLowerCase().includes(searchLower) ||
        log.id.toLowerCase().includes(searchLower) ||
        log.errorMessage?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by date range
    if (filter.dateRange.start) {
      filtered = filtered.filter(log => log.timestamp >= filter.dateRange.start!);
    }
    if (filter.dateRange.end) {
      const endOfDay = new Date(filter.dateRange.end);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => log.timestamp <= endOfDay);
    }
    
    setFilteredLogs(filtered);
    setStats(calculateStats(filtered));
  }, [logs, filter]);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        const newLog = generateMockLogs(1)[0];
        setLogs(prev => [newLog, ...prev].slice(0, 500));
      }, 5000);
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh]);

  const handleFilterChange = (key: keyof LogFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilter({
      level: 'all',
      method: 'all',
      statusCode: '',
      search: '',
      dateRange: { start: null, end: null },
    });
  };

  const exportLogs = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      filter: filter,
      totalLogs: filteredLogs.length,
      logs: filteredLogs,
      stats: stats,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            📋 API Logs Dashboard
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor, analyze, and debug your API requests with comprehensive logging
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard title="Total Requests" value={stats.totalRequests} icon="📊" />
            <StatCard title="Avg Response Time" value={stats.avgResponseTime} unit="ms" icon="⚡" />
            <StatCard title="Success Rate" value={stats.successRate.toFixed(1)} unit="%" icon="✅" />
            <StatCard title="Error Rate" value={stats.errorRate.toFixed(1)} unit="%" icon="❌" />
            <StatCard title="Unique Endpoints" value={Object.keys(stats.requestsByMethod).length} icon="🔗" />
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">🔍 Filters</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
                <select
                  value={filter.level}
                  onChange={e => handleFilterChange('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Levels</option>
                  <option value="info">ℹ️ Info</option>
                  <option value="warning">⚠️ Warning</option>
                  <option value="error">❌ Error</option>
                  <option value="debug">🐛 Debug</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HTTP Method</label>
                <select
                  value={filter.method}
                  onChange={e => handleFilterChange('method', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Code</label>
                <select
                  value={filter.statusCode}
                  onChange={e => handleFilterChange('statusCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="2">2xx (Success)</option>
                  <option value="3">3xx (Redirect)</option>
                  <option value="4">4xx (Client Error)</option>
                  <option value="5">5xx (Server Error)</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={filter.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                  placeholder="Search by endpoint, ID, or error message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
                >
                  Clear Filters
                </button>
                <button
                  onClick={exportLogs}
                  disabled={filteredLogs.length === 0}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50"
                >
                  📥 Export
                </button>
                <button
                  onClick={clearLogs}
                  disabled={logs.length === 0}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-50"
                >
                  🗑️ Clear All
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Auto Refresh</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {autoRefresh ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Endpoints */}
        {stats && stats.topEndpoints.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">🔥 Top Endpoints</h3>
            <div className="flex flex-wrap gap-3">
              {stats.topEndpoints.map((ep, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg px-3 py-2">
                  <span className="font-mono text-sm text-blue-800">{ep.endpoint}</span>
                  <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                    {ep.count} req
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">📝 API Logs</h2>
              <p className="text-sm text-gray-500">Showing {filteredLogs.length} of {logs.length} logs</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No logs found matching the current filters
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLog(log)}>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {log.timestamp.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {log.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-800">{log.endpoint}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.statusCode)}`}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={log.responseTime > 500 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {log.responseTime}ms
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1">
                          <span>{getLevelIcon(log.level)}</span>
                          <span className="text-sm capitalize">{log.level}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Summary Footer */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{stats.requestsByStatus[200] || 0}</div>
              <div className="text-xs text-green-700">200 OK</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-600">{(stats.requestsByStatus[400] || 0) + (stats.requestsByStatus[401] || 0) + (stats.requestsByStatus[403] || 0) + (stats.requestsByStatus[404] || 0)}</div>
              <div className="text-xs text-yellow-700">4xx Errors</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{(stats.requestsByStatus[500] || 0) + (stats.requestsByStatus[502] || 0) + (stats.requestsByStatus[503] || 0)}</div>
              <div className="text-xs text-red-700">5xx Errors</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{(stats.requestsByMethod['GET'] || 0)}</div>
              <div className="text-xs text-blue-700">GET Requests</div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}