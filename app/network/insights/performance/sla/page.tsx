'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Award, Clock, AlertTriangle,Search } from 'lucide-react';

interface SLACompliance {
  id: string;
  slaType: string;
  location: string;
  locationType: 'Hub' | 'Spoke' | 'Route';
  targetSLA: string;
  actualPerformance: number;
  complianceRate: number;
  totalTrips: number;
  breachedTrips: number;
  status: 'Excellent' | 'Good' | 'Warning' | 'Critical';
}

const initialCompliance: SLACompliance[] = [
  {
    id: '1',
    slaType: 'Transit SLA',
    location: 'Patna → Madhubani',
    locationType: 'Route',
    targetSLA: '4 hrs 30 mins',
    actualPerformance: 4.1,
    complianceRate: 96.8,
    totalTrips: 245,
    breachedTrips: 8,
    status: 'Excellent',
  },
  {
    id: '2',
    slaType: 'Handling SLA',
    location: 'Patna Mother Hub',
    locationType: 'Hub',
    targetSLA: '45 mins',
    actualPerformance: 52,
    complianceRate: 82.4,
    totalTrips: 1240,
    breachedTrips: 218,
    status: 'Warning',
  },
  {
    id: '3',
    slaType: 'Delivery SLA',
    location: 'Madhubani Spoke',
    locationType: 'Spoke',
    targetSLA: '3 hrs',
    actualPerformance: 3.4,
    complianceRate: 88.7,
    totalTrips: 189,
    breachedTrips: 21,
    status: 'Good',
  },
  {
    id: '4',
    slaType: 'Transit SLA',
    location: 'Ranchi → Dhanbad',
    locationType: 'Route',
    targetSLA: '4 hrs 15 mins',
    actualPerformance: 5.2,
    complianceRate: 74.5,
    totalTrips: 156,
    breachedTrips: 40,
    status: 'Critical',
  },
];

export default function SLACompliancePage() {
  const [compliance, setCompliance] = useState<SLACompliance[]>(initialCompliance);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredCompliance = compliance.filter(item => {
    const matchesSearch = 
      item.slaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || item.slaType === filterType;
    const matchesStatus = !filterStatus || item.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const overallCompliance = Math.round(
    filteredCompliance.reduce((sum, item) => sum + item.complianceRate, 0) / filteredCompliance.length
  );

  const criticalCount = filteredCompliance.filter(item => item.status === 'Critical').length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SLA Compliance</h1>
          <p className="text-gray-600 mt-1">Monitor Service Level Agreement performance across network</p>
        </div>
      </div>

      {/* Overall KPI */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center">
        <div>
          <p className="text-blue-100">Overall SLA Compliance</p>
          <p className="text-6xl font-bold mt-2">{overallCompliance}%</p>
        </div>
        <div className="text-right">
          <p className="text-blue-100">Critical Breaches Today</p>
          <p className="text-5xl font-bold text-red-300 mt-1">{criticalCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="SLA Type or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SLA Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Types</option>
            <option value="Transit SLA">Transit SLA</option>
            <option value="Handling SLA">Handling SLA</option>
            <option value="Delivery SLA">Delivery SLA</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">SLA Type</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Target SLA</th>
                <th className="px-6 py-4 text-left">Actual Performance</th>
                <th className="px-6 py-4 text-left">Compliance Rate</th>
                <th className="px-6 py-4 text-left">Total Trips</th>
                <th className="px-6 py-4 text-left">Breached</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCompliance.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{item.slaType}</td>
                  <td className="px-6 py-5">{item.location}</td>
                  <td className="px-6 py-5">{item.targetSLA}</td>
                  <td className="px-6 py-5">{item.actualPerformance} hrs/mins</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.complianceRate >= 90 ? 'bg-emerald-500' : item.complianceRate >= 80 ? 'bg-blue-500' : 'bg-red-500'}`}
                          style={{ width: `${item.complianceRate}%` }}
                        />
                      </div>
                      <span className="font-semibold">{item.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium">{item.totalTrips}</td>
                  <td className="px-6 py-5 text-red-600 font-medium">{item.breachedTrips}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${item.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${item.status === 'Good' ? 'bg-blue-100 text-blue-700' : ''}
                      ${item.status === 'Warning' ? 'bg-amber-100 text-amber-700' : ''}
                      ${item.status === 'Critical' ? 'bg-red-100 text-red-700' : ''}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Total SLA Records: {filteredCompliance.length} • Last Updated: Just Now
      </div>
    </div>
  );
}