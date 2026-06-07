'use client';

import React, { useState } from 'react';
import { AlertTriangle, Clock, TrendingUp, Search, Eye } from 'lucide-react';

interface Bottleneck {
  id: string;
  location: string;
  locationType: 'Hub' | 'Spoke' | 'Route';
  bottleneckType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  avgDelay: string;
  impactedRoutes: number;
  impactedShipments: number;
  status: 'Active' | 'Monitoring' | 'Resolved';
  detectedTime: string;
  description: string;
}

const initialBottlenecks: Bottleneck[] = [
  {
    id: '1',
    location: 'Patna Mother Hub - Dock Area',
    locationType: 'Hub',
    bottleneckType: 'Dock Congestion',
    severity: 'Critical',
    avgDelay: '65 mins',
    impactedRoutes: 12,
    impactedShipments: 450,
    status: 'Active',
    detectedTime: 'May 30, 2026 09:15 AM',
    description: '8 vehicles waiting for unloading. Severe backlog.',
  },
  {
    id: '2',
    location: 'Patna → Madhubani Route',
    locationType: 'Route',
    bottleneckType: 'Traffic Jam',
    severity: 'High',
    avgDelay: '45 mins',
    impactedRoutes: 5,
    impactedShipments: 180,
    status: 'Monitoring',
    detectedTime: 'May 30, 2026 10:40 AM',
    description: 'NH-27 heavy traffic due to construction.',
  },
  {
    id: '3',
    location: 'Ranchi Regional Hub',
    locationType: 'Hub',
    bottleneckType: 'Zone Overload',
    severity: 'Medium',
    avgDelay: '32 mins',
    impactedRoutes: 8,
    impactedShipments: 210,
    status: 'Active',
    detectedTime: 'May 30, 2026 01:25 PM',
    description: 'Zone A reaching maximum capacity.',
  },
  {
    id: '4',
    location: 'Dhanbad Spoke',
    locationType: 'Spoke',
    bottleneckType: 'Staff Shortage',
    severity: 'High',
    avgDelay: '55 mins',
    impactedRoutes: 3,
    impactedShipments: 95,
    status: 'Monitoring',
    detectedTime: 'May 29, 2026 04:10 PM',
    description: 'Only 60% staff available during peak hours.',
  },
];

export default function BottleneckDetectionPage() {
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>(initialBottlenecks);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBottleneck, setSelectedBottleneck] = useState<Bottleneck | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredBottlenecks = bottlenecks.filter(b => {
    const matchesSearch = 
      b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bottleneckType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || b.bottleneckType === filterType;
    const matchesSeverity = !filterSeverity || b.severity === filterSeverity;
    const matchesStatus = !filterStatus || b.status === filterStatus;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const criticalCount = bottlenecks.filter(b => b.severity === 'Critical').length;

  const openDetail = (bottleneck: Bottleneck) => {
    setSelectedBottleneck(bottleneck);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bottleneck Detection</h1>
          <p className="text-gray-600 mt-1">AI-powered real-time bottleneck identification and alerts</p>
        </div>
        <div className="flex items-center gap-3 text-sm bg-red-50 text-red-600 px-4 py-2 rounded-xl">
          <AlertTriangle size={20} />
          <span>{criticalCount} Critical Bottlenecks Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Active Bottlenecks</p>
          <p className="text-4xl font-bold mt-2">{bottlenecks.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Critical Bottlenecks</p>
          <p className="text-4xl font-bold text-red-600 mt-2">{criticalCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Delay</p>
          <p className="text-4xl font-bold mt-2">48 mins</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Impacted Shipments</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">935</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Location or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bottleneck Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Types</option>
            <option value="Dock Congestion">Dock Congestion</option>
            <option value="Traffic Jam">Traffic Jam</option>
            <option value="Zone Overload">Zone Overload</option>
            <option value="Staff Shortage">Staff Shortage</option>
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
            <option value="Monitoring">Monitoring</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Bottleneck Type</th>
                <th className="px-6 py-4 text-left">Avg Delay</th>
                <th className="px-6 py-4 text-left">Impacted Routes</th>
                <th className="px-6 py-4 text-left">Impacted Shipments</th>
                <th className="px-6 py-4 text-left">Severity</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBottlenecks.map((bottleneck) => (
                <tr key={bottleneck.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5">
                    <div>{bottleneck.location}</div>
                    <div className="text-xs text-gray-500">({bottleneck.locationType})</div>
                  </td>
                  <td className="px-6 py-5 text-sm">{bottleneck.detectedTime}</td>
                  <td className="px-6 py-5 font-medium">{bottleneck.bottleneckType}</td>
                  <td className="px-6 py-5 font-medium text-red-600">{bottleneck.avgDelay}</td>
                  <td className="px-6 py-5 font-medium">{bottleneck.impactedRoutes}</td>
                  <td className="px-6 py-5 font-medium">{bottleneck.impactedShipments}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${bottleneck.severity === 'Critical' ? 'bg-red-100 text-red-700' : ''}
                      ${bottleneck.severity === 'High' ? 'bg-orange-100 text-orange-700' : ''}
                      ${bottleneck.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${bottleneck.severity === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                      {bottleneck.severity}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${bottleneck.status === 'Active' ? 'bg-red-100 text-red-700' : ''}
                      ${bottleneck.status === 'Monitoring' ? 'bg-amber-100 text-amber-700' : ''}
                      ${bottleneck.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                      {bottleneck.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => openDetail(bottleneck)}
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

      {/* Detail Modal */}
      {isDetailOpen && selectedBottleneck && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">Bottleneck Details</h2>
              <p className="text-gray-500 mt-1">{selectedBottleneck.id}</p>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="font-medium mt-1">{selectedBottleneck.location}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="font-medium mt-1">{selectedBottleneck.bottleneckType}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Severity</p>
                <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium
                  ${selectedBottleneck.severity === 'Critical' ? 'bg-red-100 text-red-700' : ''}
                  ${selectedBottleneck.severity === 'High' ? 'bg-orange-100 text-orange-700' : ''}
                  ${selectedBottleneck.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${selectedBottleneck.severity === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                  {selectedBottleneck.severity}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Avg Delay</p>
                  <p className="font-medium mt-1">{selectedBottleneck.avgDelay}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Impacted Shipments</p>
                  <p className="font-medium mt-1">{selectedBottleneck.impactedShipments}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Description</p>
                <p className="mt-2 bg-gray-50 p-4 rounded-2xl">{selectedBottleneck.description}</p>
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