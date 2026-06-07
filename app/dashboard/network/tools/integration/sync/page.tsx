// app/data-sync-status/page.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

// --- Type Definitions ---
type SyncStatus = 'idle' | 'syncing' | 'success' | 'failed' | 'paused' | 'pending';
type DataSource = 'database' | 'api' | 'file' | 'queue' | 'cache' | 'search';
type SyncType = 'full' | 'incremental' | 'realtime' | 'batch';

type SyncJob = {
  id: string;
  name: string;
  source: DataSource;
  destination: DataSource;
  type: SyncType;
  status: SyncStatus;
  progress: number;
  recordsProcessed: number;
  totalRecords: number;
  recordsFailed: number;
  startTime: Date | null;
  endTime: Date | null;
  lastSyncTime: Date | null;
  nextSyncTime: Date | null;
  errorMessage?: string;
  speed: number; // records per second
  duration: number; // seconds
};

type SyncHistory = {
  id: string;
  jobId: string;
  timestamp: Date;
  status: SyncStatus;
  recordsSynced: number;
  duration: number;
  errorCount: number;
};

type SyncStats = {
  totalJobs: number;
  activeJobs: number;
  totalRecordsSynced: number;
  avgSyncSpeed: number;
  successRate: number;
  pendingRecords: number;
  failedJobs: number;
};

// --- Mock Data Generator ---
const generateSyncJobs = (): SyncJob[] => {
  const jobs: SyncJob[] = [
    {
      id: 'job_1',
      name: 'Primary Database to Data Warehouse',
      source: 'database',
      destination: 'database',
      type: 'full',
      status: 'idle',
      progress: 100,
      recordsProcessed: 1523400,
      totalRecords: 1523400,
      recordsFailed: 23,
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 1800000),
      lastSyncTime: new Date(Date.now() - 1800000),
      nextSyncTime: new Date(Date.now() + 86400000),
      speed: 423,
      duration: 3600,
    },
    {
      id: 'job_2',
      name: 'User Data to Search Index',
      source: 'database',
      destination: 'search',
      type: 'realtime',
      status: 'syncing',
      progress: 67,
      recordsProcessed: 45230,
      totalRecords: 67500,
      recordsFailed: 12,
      startTime: new Date(Date.now() - 1200000),
      endTime: null,
      lastSyncTime: new Date(Date.now() - 1200000),
      nextSyncTime: null,
      speed: 156,
      duration: 0,
    },
    {
      id: 'job_3',
      name: 'Orders to Analytics Queue',
      source: 'database',
      destination: 'queue',
      type: 'batch',
      status: 'pending',
      progress: 0,
      recordsProcessed: 0,
      totalRecords: 12500,
      recordsFailed: 0,
      startTime: null,
      endTime: null,
      lastSyncTime: new Date(Date.now() - 3600000),
      nextSyncTime: new Date(Date.now() + 1800000),
      speed: 0,
      duration: 0,
    },
    {
      id: 'job_4',
      name: 'Cache Refresh from API',
      source: 'api',
      destination: 'cache',
      type: 'incremental',
      status: 'failed',
      progress: 34,
      recordsProcessed: 3420,
      totalRecords: 10000,
      recordsFailed: 156,
      startTime: new Date(Date.now() - 300000),
      endTime: new Date(Date.now() - 60000),
      lastSyncTime: new Date(Date.now() - 60000),
      nextSyncTime: new Date(Date.now() + 300000),
      speed: 68,
      duration: 300,
      errorMessage: 'Connection timeout while fetching from source API',
    },
    {
      id: 'job_5',
      name: 'File System to Object Storage',
      source: 'file',
      destination: 'database',
      type: 'full',
      status: 'syncing',
      progress: 89,
      recordsProcessed: 8900,
      totalRecords: 10000,
      recordsFailed: 45,
      startTime: new Date(Date.now() - 800000),
      endTime: null,
      lastSyncTime: new Date(Date.now() - 800000),
      nextSyncTime: null,
      speed: 112,
      duration: 0,
    },
    {
      id: 'job_6',
      name: 'Payment Events to Ledger',
      source: 'queue',
      destination: 'database',
      type: 'realtime',
      status: 'idle',
      progress: 100,
      recordsProcessed: 89200,
      totalRecords: 89200,
      recordsFailed: 8,
      startTime: new Date(Date.now() - 7200000),
      endTime: new Date(Date.now() - 3600000),
      lastSyncTime: new Date(Date.now() - 3600000),
      nextSyncTime: new Date(Date.now() + 600000),
      speed: 245,
      duration: 7200,
    },
  ];
  return jobs;
};

const generateSyncHistory = (): SyncHistory[] => {
  const history: SyncHistory[] = [];
  for (let i = 0; i < 30; i++) {
    history.push({
      id: `hist_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 8)}`,
      jobId: `job_${Math.floor(Math.random() * 6) + 1}`,
      timestamp: new Date(Date.now() - i * 3600000),
      status: Math.random() > 0.2 ? 'success' : 'failed',
      recordsSynced: Math.floor(Math.random() * 50000),
      duration: Math.floor(Math.random() * 3600),
      errorCount: Math.floor(Math.random() * 10),
    });
  }
  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// --- Helper Functions ---
const calculateSyncStats = (jobs: SyncJob[]): SyncStats => {
  const activeJobs = jobs.filter(j => j.status === 'syncing').length;
  const failedJobs = jobs.filter(j => j.status === 'failed').length;
  const totalRecordsSynced = jobs.reduce((sum, j) => sum + j.recordsProcessed, 0);
  const jobsWithSpeed = jobs.filter(j => j.speed > 0);
  const avgSyncSpeed = jobsWithSpeed.length > 0 
    ? Math.round(jobsWithSpeed.reduce((sum, j) => sum + j.speed, 0) / jobsWithSpeed.length)
    : 0;
  const pendingRecords = jobs.reduce((sum, j) => sum + (j.totalRecords - j.recordsProcessed), 0);
  const successRate = jobs.length > 0 
    ? (jobs.filter(j => j.status === 'success' || j.status === 'idle').length / jobs.length) * 100 
    : 0;
  
  return {
    totalJobs: jobs.length,
    activeJobs,
    totalRecordsSynced,
    avgSyncSpeed,
    successRate,
    pendingRecords,
    failedJobs,
  };
};

const getStatusIcon = (status: SyncStatus): string => {
  switch (status) {
    case 'idle': return '⏸️';
    case 'syncing': return '🔄';
    case 'success': return '✅';
    case 'failed': return '❌';
    case 'paused': return '⏹️';
    case 'pending': return '⏳';
    default: return '📊';
  }
};

const getStatusColor = (status: SyncStatus): string => {
  switch (status) {
    case 'syncing': return 'bg-blue-100 text-blue-800';
    case 'success': return 'bg-green-100 text-green-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'paused': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSourceIcon = (source: DataSource): string => {
  const icons = {
    database: '🗄️',
    api: '🔌',
    file: '📁',
    queue: '📨',
    cache: '⚡',
    search: '🔍',
  };
  return icons[source];
};

const formatDuration = (seconds: number): string => {
  if (seconds === 0) return 'In progress';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// --- UI Components ---
const StatCard = ({ title, value, unit = '', icon }: { title: string; value: string | number; unit?: string; icon: string }) => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</span>
      {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
    </div>
  </div>
);

const ProgressBar = ({ progress, size = 'md' }: { progress: number; size?: 'sm' | 'md' | 'lg' }) => {
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[size]}`}>
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 rounded-full"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
};

const SyncDetailModal = ({ job, onClose }: { job: SyncJob | null; onClose: () => void }) => {
  if (!job) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Sync Job Details</h3>
            <p className="text-sm text-gray-500">{job.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase">Job Name</label>
              <p className="font-semibold">{job.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Status</label>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status} {getStatusIcon(job.status)}
              </span>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Source</label>
              <p>{getSourceIcon(job.source)} {job.source}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Destination</label>
              <p>{getSourceIcon(job.destination)} {job.destination}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Sync Type</label>
              <p className="capitalize">{job.type}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Speed</label>
              <p>{job.speed} records/sec</p>
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-500 uppercase">Progress</label>
            <ProgressBar progress={job.progress} size="lg" />
            <div className="flex justify-between text-sm mt-1">
              <span>{job.recordsProcessed.toLocaleString()} / {job.totalRecords.toLocaleString()} records</span>
              <span>{job.progress}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase">Failed Records</label>
              <p className="text-red-600">{job.recordsFailed.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Duration</label>
              <p>{formatDuration(job.duration)}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Last Sync</label>
              <p>{job.lastSyncTime ? job.lastSyncTime.toLocaleString() : 'Never'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Next Sync</label>
              <p>{job.nextSyncTime ? job.nextSyncTime.toLocaleString() : 'N/A'}</p>
            </div>
          </div>
          
          {job.errorMessage && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Error Message</label>
              <div className="bg-red-50 text-red-800 p-3 rounded text-sm">{job.errorMessage}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function DataSyncStatusPage() {
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [history, setHistory] = useState<SyncHistory[]>([]);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [selectedJob, setSelectedJob] = useState<SyncJob | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize data
  useEffect(() => {
    setJobs(generateSyncJobs());
    setHistory(generateSyncHistory());
  }, []);

  // Update stats when jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      setStats(calculateSyncStats(jobs));
    }
  }, [jobs]);

  // Auto-refresh simulation
  useEffect(() => {
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        setJobs(prevJobs => 
          prevJobs.map(job => {
            if (job.status === 'syncing') {
              const newProgress = Math.min(job.progress + Math.random() * 2, 100);
              const newProcessed = Math.min(job.recordsProcessed + Math.floor(Math.random() * 100), job.totalRecords);
              const newStatus = newProgress >= 100 ? 'success' : 'syncing';
              
              if (newProgress >= 100) {
                // Add to history when complete with unique ID
                const newHistory: SyncHistory = {
                  id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                  jobId: job.id,
                  timestamp: new Date(),
                  status: 'success',
                  recordsSynced: job.totalRecords,
                  duration: job.startTime ? (Date.now() - job.startTime.getTime()) / 1000 : 0,
                  errorCount: job.recordsFailed,
                };
                setHistory(prev => {
                  const updatedHistory = [newHistory, ...prev];
                  return updatedHistory.slice(0, 50);
                });
              }
              
              return {
                ...job,
                progress: newProgress,
                recordsProcessed: newProcessed,
                status: newStatus,
                endTime: newProgress >= 100 ? new Date() : job.endTime,
              };
            }
            return job;
          })
        );
      }, 3000);
    } else if (refreshInterval.current) {
      clearInterval(refreshInterval.current);
      refreshInterval.current = null;
    }
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  const startSync = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId && job.status === 'pending'
          ? { ...job, status: 'syncing', startTime: new Date(), progress: 0, recordsProcessed: 0 }
          : job
      )
    );
  };

  const pauseSync = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId && job.status === 'syncing'
          ? { ...job, status: 'paused' }
          : job
      )
    );
  };

  const retrySync = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId && job.status === 'failed'
          ? { ...job, status: 'pending', errorMessage: undefined, recordsFailed: 0 }
          : job
      )
    );
  };

  const filteredJobs = jobs.filter(job => {
    if (filterStatus !== 'all' && job.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            🔄 Data Sync Status
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor and manage data synchronization across all your data sources
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <StatCard title="Total Jobs" value={stats.totalJobs} icon="📋" />
            <StatCard title="Active Syncs" value={stats.activeJobs} icon="🔄" />
            <StatCard title="Records Synced" value={formatNumber(stats.totalRecordsSynced)} icon="📊" />
            <StatCard title="Avg Speed" value={stats.avgSyncSpeed} unit="/sec" icon="⚡" />
            <StatCard title="Success Rate" value={stats.successRate.toFixed(1)} unit="%" icon="✅" />
            <StatCard title="Pending Records" value={formatNumber(stats.pendingRecords)} icon="⏳" />
          </div>
        )}

        {/* Control Bar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">⚙️ Sync Controls</h2>
                <p className="text-sm text-gray-600">Monitor and manage your data synchronization jobs</p>
              </div>
              <div className="flex gap-3 items-center">
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            <div className="flex gap-2 flex-wrap">
              {['all', 'syncing', 'success', 'failed', 'pending', 'paused', 'idle'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sync Jobs Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">📋 Synchronization Jobs</h2>
            <p className="text-sm text-gray-500">Showing {filteredJobs.length} of {jobs.length} jobs</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source → Dest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No sync jobs found matching the current filters
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedJob(job)}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{job.name}</div>
                        <div className="text-xs text-gray-500">{job.id}</div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getSourceIcon(job.source)}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-lg">{getSourceIcon(job.destination)}</span>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-sm">{job.type}</span>
                       </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)} {job.status}
                        </span>
                       </td>
                      <td className="px-6 py-4 min-w-[150px]">
                        <ProgressBar progress={job.progress} size="sm" />
                        <div className="text-xs text-gray-500 mt-1">{job.progress}%</div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {formatNumber(job.recordsProcessed)} / {formatNumber(job.totalRecords)}
                        </div>
                        {job.recordsFailed > 0 && (
                          <div className="text-xs text-red-500">{job.recordsFailed} failed</div>
                        )}
                       </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{job.speed > 0 ? `${job.speed}/s` : '-'}</div>
                        <div className="text-xs text-gray-500">{formatDuration(job.duration)}</div>
                       </td>
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          {job.status === 'pending' && (
                            <button
                              onClick={() => startSync(job.id)}
                              className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition"
                            >
                              Start
                            </button>
                          )}
                          {job.status === 'syncing' && (
                            <button
                              onClick={() => pauseSync(job.id)}
                              className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition"
                            >
                              Pause
                            </button>
                          )}
                          {job.status === 'failed' && (
                            <button
                              onClick={() => retrySync(job.id)}
                              className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded transition"
                            >
                              Retry
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition"
                          >
                            Details
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sync History */}
        {history.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">📜 Recent Sync History</h3>
            </div>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records Synced</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Errors</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.slice(0, 10).map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {record.timestamp.toLocaleString()}
                       </td>
                      <td className="px-6 py-3 text-sm font-mono text-gray-600">
                        {record.jobId}
                       </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                       </td>
                      <td className="px-6 py-3 text-sm">
                        {record.recordsSynced.toLocaleString()}
                       </td>
                      <td className="px-6 py-3 text-sm">
                        {formatDuration(record.duration)}
                       </td>
                      <td className="px-6 py-3 text-sm text-red-600">
                        {record.errorCount}
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Data Source Overview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">🗄️ Data Sources</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Primary Database</span>
                <span className="text-green-600">● Connected</span>
              </div>
              <div className="flex justify-between">
                <span>API Gateway</span>
                <span className="text-green-600">● Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Message Queue</span>
                <span className="text-yellow-600">● Degraded</span>
              </div>
              <div className="flex justify-between">
                <span>Object Storage</span>
                <span className="text-green-600">● Connected</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">⚡ Performance Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Throughput (24h)</span>
                <span className="font-medium">1.2M records</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Latency</span>
                <span className="font-medium">234ms</span>
              </div>
              <div className="flex justify-between">
                <span>Peak Speed</span>
                <span className="font-medium">1,245 rec/s</span>
              </div>
              <div className="flex justify-between">
                <span>Queue Depth</span>
                <span className="font-medium">2,341</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">💡 Recommendations</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Optimize failed job: job_4</li>
              <li>• Scale worker for realtime sync</li>
              <li>• Review queue consumer lag</li>
              <li>• Schedule full sync during off-peak</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <SyncDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}