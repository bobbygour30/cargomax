'use client';

import React, { useState } from 'react';
import { Search, Download, Clock, AlertTriangle, Eye } from 'lucide-react';

interface GeofenceAlert {
  id: string;
  alertId: string;
  timestamp: string;
  location: string;
  locationType: 'Hub' | 'Spoke';
  vehicleNumber: string;
  geofenceRadius: number;
  alertType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  recipient: string;
  status: 'Sent' | 'Delivered' | 'Acknowledged' | 'Missed';
  remarks?: string;
}

const initialAlerts: GeofenceAlert[] = [
  {
    id: '1',
    alertId: 'GFA-240530001',
    timestamp: 'May 30, 2026 09:45 AM',
    location: 'Patna Mother Hub',
    locationType: 'Hub',
    vehicleNumber: 'BR01AB1234',
    geofenceRadius: 25,
    alertType: 'Unauthorized Entry',
    severity: 'High',
    recipient: 'Ramesh Gupta',
    status: 'Acknowledged',
    remarks: 'Vehicle entered from wrong gate',
  },
  {
    id: '2',
    alertId: 'GFA-240530002',
    timestamp: 'May 30, 2026 11:20 AM',
    location: 'Madhubani Spoke',
    locationType: 'Spoke',
    vehicleNumber: 'BR01CD5678',
    geofenceRadius: 40,
    alertType: 'Prolonged Stay',
    severity: 'Medium',
    recipient: 'Vijay Jha',
    status: 'Delivered',
    remarks: '',
  },
  {
    id: '3',
    alertId: 'GFA-240530003',
    timestamp: 'May 30, 2026 02:15 PM',
    location: 'Ranchi Regional Hub',
    locationType: 'Hub',
    vehicleNumber: 'JH05XY9012',
    geofenceRadius: 18,
    alertType: 'Night Entry',
    severity: 'Critical',
    recipient: 'Deepak Gupta',
    status: 'Sent',
    remarks: 'Entry after 10 PM',
  },
  {
    id: '4',
    alertId: 'GFA-240529001',
    timestamp: 'May 29, 2026 04:50 PM',
    location: 'Dhanbad Spoke',
    locationType: 'Spoke',
    vehicleNumber: 'BR01EF3456',
    geofenceRadius: 30,
    alertType: 'Wrong Direction',
    severity: 'High',
    recipient: 'Suresh Mondal',
    status: 'Acknowledged',
    remarks: 'Vehicle entered from exit gate',
  },
];

export default function GeofenceAlertLogPage() {
  const [alerts, setAlerts] = useState<GeofenceAlert[]>(initialAlerts);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<GeofenceAlert | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocationType, setFilterLocationType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.alertId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterLocationType || alert.locationType === filterLocationType;
    const matchesSeverity = !filterSeverity || alert.severity === filterSeverity;
    const matchesStatus = !filterStatus || alert.status === filterStatus;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const openDetail = (alert: GeofenceAlert) => {
    setSelectedAlert(alert);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geofence Alert Log</h1>
          <p className="text-gray-600 mt-1">Complete history of all geofence violations and alerts</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-medium">
          <Download size={18} />
          Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Alert ID or Vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location Type</label>
          <select value={filterLocationType} onChange={(e) => setFilterLocationType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All</option>
            <option value="Hub">Hub</option>
            <option value="Spoke">Spoke</option>
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
            <option value="Sent">Sent</option>
            <option value="Delivered">Delivered</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Missed">Missed</option>
          </select>
        </div>

        <div className="flex items-end">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium">
            Apply Filters
          </button>
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
                <th className="px-6 py-4 text-left">Vehicle Number</th>
                <th className="px-6 py-4 text-left">Alert Type</th>
                <th className="px-6 py-4 text-left">Severity</th>
                <th className="px-6 py-4 text-left">Recipient</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{alert.alertId}</td>
                  <td className="px-6 py-5 text-sm">{alert.timestamp}</td>
                  <td className="px-6 py-5">
                    {alert.location}
                    <span className="ml-2 text-xs text-gray-500">({alert.locationType})</span>
                  </td>
                  <td className="px-6 py-5 font-mono">{alert.vehicleNumber}</td>
                  <td className="px-6 py-5 text-sm">{alert.alertType}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${alert.severity === 'Critical' ? 'bg-red-100 text-red-700' : ''}
                      ${alert.severity === 'High' ? 'bg-orange-100 text-orange-700' : ''}
                      ${alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${alert.severity === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-5">{alert.recipient}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${alert.status === 'Acknowledged' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${alert.status === 'Delivered' ? 'bg-blue-100 text-blue-700' : ''}
                      ${alert.status === 'Sent' ? 'bg-purple-100 text-purple-700' : ''}
                      ${alert.status === 'Missed' ? 'bg-red-100 text-red-700' : ''}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => openDetail(alert)}
                      className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      <Eye size={18} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {isDetailOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">Alert Details</h2>
              <p className="text-gray-500 mt-1">{selectedAlert.alertId}</p>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-500">Timestamp</p>
                  <p className="font-medium">{selectedAlert.timestamp}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{selectedAlert.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vehicle</p>
                  <p className="font-medium">{selectedAlert.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Alert Type</p>
                  <p className="font-medium">{selectedAlert.alertType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Severity</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                    ${selectedAlert.severity === 'Critical' ? 'bg-red-100 text-red-700' : ''}
                    ${selectedAlert.severity === 'High' ? 'bg-orange-100 text-orange-700' : ''}
                    ${selectedAlert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${selectedAlert.severity === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                    {selectedAlert.severity}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                    ${selectedAlert.status === 'Acknowledged' ? 'bg-emerald-100 text-emerald-700' : ''}
                    ${selectedAlert.status === 'Delivered' ? 'bg-blue-100 text-blue-700' : ''}
                    ${selectedAlert.status === 'Sent' ? 'bg-purple-100 text-purple-700' : ''}
                    ${selectedAlert.status === 'Missed' ? 'bg-red-100 text-red-700' : ''}`}>
                    {selectedAlert.status}
                  </span>
                </div>
              </div>

              {selectedAlert.remarks && (
                <div>
                  <p className="text-gray-500 mb-2">Remarks</p>
                  <p className="bg-gray-50 p-4 rounded-2xl">{selectedAlert.remarks}</p>
                </div>
              )}
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