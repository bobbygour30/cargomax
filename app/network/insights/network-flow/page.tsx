'use client';

import React, { useState } from 'react';
import { Search, Download, AlertTriangle, Clock, Eye, TrendingUp } from 'lucide-react';

interface NetworkFlowAlert {
  id: string;
  alertId: string;
  timestamp: string;
  alertType: string;
  location: string;
  affectedRoutes: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  resolvedBy?: string;
}

const initialAlerts: NetworkFlowAlert[] = [
  {
    id: '1',
    alertId: 'NFA-240530001',
    timestamp: 'May 30, 2026 08:45 AM',
    alertType: 'Route Delay',
    location: 'Patna → Madhubani',
    affectedRoutes: 3,
    severity: 'High',
    description: 'Heavy traffic on NH-27 causing 45 mins delay',
    status: 'Active',
  },
  {
    id: '2',
    alertId: 'NFA-240530002',
    timestamp: 'May 30, 2026 10:15 AM',
    alertType: 'Bottleneck',
    location: 'Patna Mother Hub',
    affectedRoutes: 7,
    severity: 'Critical',
    description: 'Dock congestion - 6 vehicles waiting',
    status: 'Acknowledged',
    resolvedBy: 'Ramesh Kumar',
  },
  {
    id: '3',
    alertId: 'NFA-240530003',
    timestamp: 'May 30, 2026 01:20 PM',
    alertType: 'SLA Violation',
    location: 'Ranchi → Dhanbad',
    affectedRoutes: 2,
    severity: 'Medium',
    description: 'Transit time exceeded by 1.5 hours',
    status: 'Resolved',
    resolvedBy: 'Deepak Sharma',
  },
  {
    id: '4',
    alertId: 'NFA-240529001',
    timestamp: 'May 29, 2026 04:50 PM',
    alertType: 'Vehicle Breakdown',
    location: 'Near Gaya',
    affectedRoutes: 1,
    severity: 'High',
    description: 'Vehicle BR01EF3456 reported breakdown',
    status: 'Active',
  },
];

export default function NetworkFlowAlertPage() {
  const [alerts, setAlerts] = useState<NetworkFlowAlert[]>(initialAlerts);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<NetworkFlowAlert | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.alertId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || alert.alertType === filterType;
    const matchesSeverity = !filterSeverity || alert.severity === filterSeverity;
    const matchesStatus = !filterStatus || alert.status === filterStatus;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const openDetail = (alert: NetworkFlowAlert) => {
    setSelectedAlert(alert);
    setIsDetailOpen(true);
  };

  const totalCritical = alerts.filter(a => a.severity === 'Critical').length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Flow Alert</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of network disruptions and flow anomalies</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-xl font-medium">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Critical Summary */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-center gap-6">
        <div className="text-red-600">
          <AlertTriangle size={48} />
        </div>
        <div>
          <p className="text-4xl font-bold text-red-600">{totalCritical}</p>
          <p className="text-red-700 font-medium">Critical Alerts Active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Alert</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Alert ID or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Alert Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Types</option>
            <option value="Route Delay">Route Delay</option>
            <option value="Bottleneck">Bottleneck</option>
            <option value="SLA Violation">SLA Violation</option>
            <option value="Vehicle Breakdown">Vehicle Breakdown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Severity</label>
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Alert ID</th>
                <th className="px-6 py-4 text-left">Timestamp</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Alert Type</th>
                <th className="px-6 py-4 text-left">Affected Routes</th>
                <th className="px-6 py-4 text-left">Severity</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{alert.alertId}</td>
                  <td className="px-6 py-5 text-sm">{alert.timestamp}</td>
                  <td className="px-6 py-5">{alert.location}</td>
                  <td className="px-6 py-5 text-sm">{alert.alertType}</td>
                  <td className="px-6 py-5 font-medium">{alert.affectedRoutes}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${alert.severity === 'Critical' ? 'bg-red-100 text-red-700' : ''}
                      ${alert.severity === 'High' ? 'bg-orange-100 text-orange-700' : ''}
                      ${alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${alert.severity === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${alert.status === 'Active' ? 'bg-red-100 text-red-700' : ''}
                      ${alert.status === 'Acknowledged' ? 'bg-amber-100 text-amber-700' : ''}
                      ${alert.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => openDetail(alert)}
                      className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">Alert Details</h2>
              <p className="text-gray-500 mt-1">{selectedAlert.alertId}</p>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Timestamp</p>
                  <p className="font-medium">{selectedAlert.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedAlert.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alert Type</p>
                  <p className="font-medium">{selectedAlert.alertType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Severity</p>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium inline-block mt-1
                    ${selectedAlert.severity === 'Critical' ? 'bg-red-100 text-red-700' : ''}
                    ${selectedAlert.severity === 'High' ? 'bg-orange-100 text-orange-700' : ''}
                    ${selectedAlert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${selectedAlert.severity === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                    {selectedAlert.severity}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Affected Routes</p>
                  <p className="font-medium">{selectedAlert.affectedRoutes} routes impacted</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="bg-gray-50 p-4 rounded-2xl mt-1">{selectedAlert.description}</p>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end">
              <button 
                onClick={() => setIsDetailOpen(false)} 
                className="px-8 py-3 border rounded-2xl hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}