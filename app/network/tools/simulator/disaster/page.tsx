// app/disaster-recovery/page.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';

// --- Type Definitions ---
type DisasterType = 'outage' | 'data_breach' | 'natural_disaster' | 'cyber_attack' | 'hardware_failure';
type RecoveryStatus = 'operational' | 'degraded' | 'failed' | 'recovering' | 'recovered';
type BackupType = 'full' | 'incremental' | 'differential';

type Backup = {
  id: string;
  type: BackupType;
  timestamp: Date;
  size: string;
  status: 'success' | 'failed' | 'in_progress';
  location: string;
};

type RecoveryPlan = {
  id: string;
  name: string;
  description: string;
  rto: number; // Recovery Time Objective in minutes
  rpo: number; // Recovery Point Objective in minutes
  steps: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  testedAt: Date | null;
  lastTestResult: 'success' | 'failed' | null;
};

type SystemHealth = {
  status: RecoveryStatus;
  uptime: number;
  lastIncident: Date | null;
  activeAlerts: number;
  components: {
    name: string;
    status: 'healthy' | 'degraded' | 'down';
    recoveryETA: number | null;
  }[];
};

type DRScenario = {
  id: string;
  name: string;
  type: DisasterType;
  impact: 'critical' | 'major' | 'minor';
  simulationActive: boolean;
};

// --- Mock Data ---
const mockBackups: Backup[] = [
  {
    id: 'backup-001',
    type: 'full',
    timestamp: new Date('2024-01-15T02:00:00'),
    size: '2.4 TB',
    status: 'success',
    location: 'AWS S3 - us-east-1',
  },
  {
    id: 'backup-002',
    type: 'incremental',
    timestamp: new Date('2024-01-16T02:00:00'),
    size: '120 GB',
    status: 'success',
    location: 'AWS S3 - us-east-1',
  },
  {
    id: 'backup-003',
    type: 'incremental',
    timestamp: new Date('2024-01-17T02:00:00'),
    size: '95 GB',
    status: 'success',
    location: 'AWS S3 - us-east-1',
  },
  {
    id: 'backup-004',
    type: 'full',
    timestamp: new Date('2024-01-18T03:00:00'),
    size: '2.5 TB',
    status: 'in_progress',
    location: 'Azure Blob - westus2',
  },
];

const mockRecoveryPlans: RecoveryPlan[] = [
  {
    id: 'plan-001',
    name: 'Critical Systems Recovery',
    description: 'Recovery plan for core business applications and databases',
    rto: 15,
    rpo: 5,
    priority: 'critical',
    steps: [
      'Activate incident response team',
      'Assess scope of disaster',
      'Initiate failover to secondary region',
      'Verify data integrity from latest backup',
      'Redirect traffic to DR site',
      'Verify system functionality',
      'Monitor for 30 minutes',
    ],
    testedAt: new Date('2024-01-10T10:00:00'),
    lastTestResult: 'success',
  },
  {
    id: 'plan-002',
    name: 'Database Recovery',
    description: 'Specialized recovery for database systems',
    rto: 30,
    rpo: 15,
    priority: 'high',
    steps: [
      'Stop all write operations',
      'Restore from latest consistent backup',
      'Apply transaction logs',
      'Verify data consistency',
      'Resume operations',
    ],
    testedAt: new Date('2024-01-05T14:30:00'),
    lastTestResult: 'success',
  },
  {
    id: 'plan-003',
    name: 'Network Infrastructure',
    description: 'Recovery for network components and connectivity',
    rto: 45,
    rpo: 0,
    priority: 'medium',
    steps: [
      'Diagnose network failure point',
      'Activate backup network paths',
      'Reconfigure firewall rules',
      'Test connectivity',
      'Monitor network performance',
    ],
    testedAt: new Date('2023-12-20T09:00:00'),
    lastTestResult: 'failed',
  },
];

const mockSystemHealth: SystemHealth = {
  status: 'operational',
  uptime: 99.95,
  lastIncident: null,
  activeAlerts: 0,
  components: [
    { name: 'Primary Database', status: 'healthy', recoveryETA: null },
    { name: 'Application Servers', status: 'healthy', recoveryETA: null },
    { name: 'Load Balancers', status: 'healthy', recoveryETA: null },
    { name: 'CDN Network', status: 'healthy', recoveryETA: null },
    { name: 'Backup Storage', status: 'healthy', recoveryETA: null },
    { name: 'Secondary Region', status: 'healthy', recoveryETA: null },
  ],
};

const mockDRScenarios: DRScenario[] = [
  { id: 'scenario-001', name: 'Primary Region Outage', type: 'outage', impact: 'critical', simulationActive: false },
  { id: 'scenario-002', name: 'Ransomware Attack', type: 'cyber_attack', impact: 'critical', simulationActive: false },
  { id: 'scenario-003', name: 'Database Corruption', type: 'hardware_failure', impact: 'major', simulationActive: false },
  { id: 'scenario-004', name: 'DDoS Attack', type: 'cyber_attack', impact: 'major', simulationActive: false },
];

// --- UI Components ---
const StatusIndicator = ({ status }: { status: RecoveryStatus | 'healthy' | 'degraded' | 'down' }) => {
  const statusConfig = {
    operational: { color: 'bg-green-500', text: 'Operational', pulse: false },
    healthy: { color: 'bg-green-500', text: 'Healthy', pulse: false },
    degraded: { color: 'bg-yellow-500', text: 'Degraded', pulse: true },
    recovering: { color: 'bg-blue-500', text: 'Recovering', pulse: true },
    failed: { color: 'bg-red-500', text: 'Failed', pulse: true },
    recovered: { color: 'bg-green-500', text: 'Recovered', pulse: false },
    down: { color: 'bg-red-500', text: 'Down', pulse: true },
  };
  const config = statusConfig[status] || statusConfig.operational;
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span className="text-sm font-medium text-gray-700">{config.text}</span>
    </div>
  );
};

const MetricCard = ({ title, value, unit = '', icon, trend = null }: any) => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
      {trend && (
        <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

const AlertBanner = ({ message, type = 'warning', onDismiss }: { message: string; type?: 'warning' | 'error' | 'info' | 'success'; onDismiss?: () => void }) => {
  const styles = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };
  
  return (
    <div className={`rounded-lg border p-4 mb-4 ${styles[type]} relative`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
export default function DisasterRecoveryPage() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(mockSystemHealth);
  const [backups, setBackups] = useState<Backup[]>(mockBackups);
  const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>(mockRecoveryPlans);
  const [drScenarios, setDrScenarios] = useState<DRScenario[]>(mockDRScenarios);
  const [activeSimulation, setActiveSimulation] = useState<DRScenario | null>(null);
  const [recoveryProgress, setRecoveryProgress] = useState(0);
  const [showRunbook, setShowRunbook] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSimulation) {
      interval = setInterval(() => {
        setRecoveryProgress(prev => {
          if (prev >= 100) {
            setActiveSimulation(null);
            setAlert({
              message: `✅ ${activeSimulation.name} simulation completed. System successfully recovered.`,
              type: 'success',
            });
            setSystemHealth(prev => ({ ...prev, status: 'operational' }));
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeSimulation]);

  const startDisasterSimulation = (scenario: DRScenario) => {
    if (activeSimulation) {
      setAlert({ message: 'Another simulation is already in progress. Please wait or reset.', type: 'warning' });
      return;
    }
    
    setActiveSimulation(scenario);
    setRecoveryProgress(0);
    setSystemHealth({
      ...systemHealth,
      status: 'failed',
      activeAlerts: systemHealth.activeAlerts + 1,
      components: systemHealth.components.map(comp => ({
        ...comp,
        status: comp.name === 'Secondary Region' ? 'healthy' : 'down',
        recoveryETA: comp.name === 'Primary Database' ? 15 : null,
      })),
    });
    
    setAlert({
      message: `⚠️ DISASTER SIMULATION: ${scenario.name} (${scenario.type}). Recovery process initiated.`,
      type: 'error',
    });
  };

  const cancelSimulation = () => {
    setActiveSimulation(null);
    setRecoveryProgress(0);
    setSystemHealth(mockSystemHealth);
    setAlert({ message: 'Simulation cancelled. System reset to normal state.', type: 'info' });
  };

  const executeRecoveryPlan = (planId: string) => {
    const plan = recoveryPlans.find(p => p.id === planId);
    if (!plan) return;
    
    setAlert({
      message: `🔄 Executing recovery plan: ${plan.name}. Estimated RTO: ${plan.rto} minutes.`,
      type: 'info',
    });
    
    setSystemHealth(prev => ({
      ...prev,
      status: 'recovering',
      components: prev.components.map(comp => ({
        ...comp,
        status: comp.status === 'down' ? 'degraded' : comp.status,
      })),
    }));
    
    // Simulate recovery completion
    setTimeout(() => {
      setAlert({
        message: `✅ Recovery plan "${plan.name}" completed successfully. System is operational.`,
        type: 'success',
      });
      setSystemHealth(prev => ({
        ...prev,
        status: 'operational',
        components: prev.components.map(comp => ({ ...comp, status: 'healthy' })),
      }));
    }, 3000);
  };

  const testBackupRestore = (backupId: string) => {
    setAlert({ message: `Testing restore from backup ${backupId}...`, type: 'info' });
    setTimeout(() => {
      setAlert({ message: `✅ Backup ${backupId} restore test completed successfully. Data integrity verified.`, type: 'success' });
    }, 2000);
  };

  const runDRTest = (planId: string) => {
    setAlert({ message: `🧪 Running disaster recovery drill for plan...`, type: 'info' });
    setTimeout(() => {
      setAlert({ message: `✅ DR drill completed. All recovery steps validated. RTO achieved: 12 minutes.`, type: 'success' });
      setRecoveryPlans(prev => prev.map(p => 
        p.id === planId ? { ...p, lastTestResult: 'success', testedAt: new Date() } : p
      ));
    }, 3000);
  };

  const getRTOStatus = (rto: number) => {
    if (rto <= 15) return 'text-green-600';
    if (rto <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            🛡️ Disaster Recovery Command Center
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor system health, manage backups, and execute recovery plans with confidence
          </p>
        </div>

        {/* Active Alert */}
        {alert && (
          <AlertBanner 
            message={alert.message} 
            type={alert.type as any} 
            onDismiss={() => setAlert(null)}
          />
        )}

        {/* Active Simulation Banner */}
        {activeSimulation && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-red-800">🚨 DISASTER SIMULATION ACTIVE</h3>
                <p className="text-sm text-red-700">{activeSimulation.name} - {activeSimulation.type}</p>
              </div>
              <div className="flex-1 max-w-md">
                <div className="flex justify-between text-sm text-red-700 mb-1">
                  <span>Recovery Progress</span>
                  <span>{recoveryProgress}%</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${recoveryProgress}%` }} />
                </div>
              </div>
              <button
                onClick={cancelSimulation}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
              >
                Cancel Simulation
              </button>
            </div>
          </div>
        )}

        {/* System Health Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">📊 System Health Dashboard</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <MetricCard title="System Status" value={systemHealth.status} icon="🟢" />
                <MetricCard title="Uptime (30d)" value={systemHealth.uptime} unit="%" icon="⏱️" />
                <MetricCard title="Active Alerts" value={systemHealth.activeAlerts} icon="⚠️" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700 mb-2">Component Status</h3>
                {systemHealth.components.map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{comp.name}</span>
                    <StatusIndicator status={comp.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">🎯 RTO/RPO Targets</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Average RTO Achieved</span>
                    <span className="font-medium text-green-600">12 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: 15 min</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Average RPO Achieved</span>
                    <span className="font-medium text-green-600">4 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: 5 min</p>
                </div>
                <div className="pt-4">
                  <div className="text-sm text-gray-600">Last DR Test</div>
                  <div className="font-medium">Jan 10, 2024 - Successful</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disaster Scenarios - Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🚨 Disaster Scenarios (Simulation)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {drScenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => startDisasterSimulation(scenario)}
                disabled={!!activeSimulation}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  activeSimulation 
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                    : 'bg-white border-gray-200 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="text-2xl mb-2">
                  {scenario.type === 'outage' && '⚡'}
                  {scenario.type === 'cyber_attack' && '💀'}
                  {scenario.type === 'hardware_failure' && '💾'}
                  {scenario.type === 'natural_disaster' && '🌊'}
                </div>
                <h3 className="font-semibold text-gray-800">{scenario.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Impact: {scenario.impact}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recovery Plans */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Recovery Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recoveryPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`px-4 py-3 ${
                  plan.priority === 'critical' ? 'bg-red-50' : 
                  plan.priority === 'high' ? 'bg-orange-50' : 'bg-gray-50'
                } border-b border-gray-200`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      plan.priority === 'critical' ? 'bg-red-200 text-red-800' :
                      plan.priority === 'high' ? 'bg-orange-200 text-orange-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {plan.priority}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">RTO:</span>
                    <span className={`font-medium ${getRTOStatus(plan.rto)}`}>{plan.rto} min</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">RPO:</span>
                    <span className="font-medium">{plan.rpo} min</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-500">Last Test:</span>
                    <span className={plan.lastTestResult === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {plan.testedAt ? plan.testedAt.toLocaleDateString() : 'Never'} - {plan.lastTestResult}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => executeRecoveryPlan(plan.id)}
                      className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition"
                    >
                      Execute
                    </button>
                    <button
                      onClick={() => runDRTest(plan.id)}
                      className="flex-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => setShowRunbook(showRunbook === plan.id ? null : plan.id)}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition"
                    >
                      📖
                    </button>
                  </div>
                  {showRunbook === plan.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-600 mb-2">Runbook Steps:</h4>
                      <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                        {plan.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backups */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">💾 Backup Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map(backup => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{backup.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        backup.type === 'full' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{backup.timestamp.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{backup.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{backup.location}</td>
                    <td className="px-6 py-4">
                      <StatusIndicator status={backup.status as any} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => testBackupRestore(backup.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Test Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance & Recommendations */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3">✅ Compliance Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Backup Frequency (Daily)</span>
                <span className="text-green-600">✓ Compliant</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>DR Test Frequency (Monthly)</span>
                <span className="text-yellow-600">⚠️ Due in 5 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>RTO/RPO Compliance</span>
                <span className="text-green-600">✓ Met</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 mb-3">💡 Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Schedule full DR drill for next quarter</li>
              <li>• Update runbook for Database Recovery plan</li>
              <li>• Consider adding offsite backup location</li>
              <li>• Review IAM roles for DR access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}