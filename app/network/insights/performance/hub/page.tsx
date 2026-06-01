'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Package, Users, Award } from 'lucide-react';

interface HubPerformance {
  id: string;
  hubName: string;
  hubCode: string;
  onTimeDelivery: number;
  utilization: number;
  dailyThroughput: number;
  avgLoadingTime: string;
  activeVehicles: number;
  performanceScore: number;
  trend: 'up' | 'down';
}

const initialPerformance: HubPerformance[] = [
  {
    id: '1',
    hubName: 'Patna Mother Hub',
    hubCode: 'PATNA-01',
    onTimeDelivery: 94.5,
    utilization: 87,
    dailyThroughput: 1240,
    avgLoadingTime: '42 mins',
    activeVehicles: 18,
    performanceScore: 92,
    trend: 'up',
  },
  {
    id: '2',
    hubName: 'Ranchi Regional Hub',
    hubCode: 'RANCHI-01',
    onTimeDelivery: 89.2,
    utilization: 76,
    dailyThroughput: 680,
    avgLoadingTime: '51 mins',
    activeVehicles: 12,
    performanceScore: 84,
    trend: 'down',
  },
  {
    id: '3',
    hubName: 'Dadri Mother Hub',
    hubCode: 'DADRI-01',
    onTimeDelivery: 96.8,
    utilization: 91,
    dailyThroughput: 980,
    avgLoadingTime: '38 mins',
    activeVehicles: 15,
    performanceScore: 95,
    trend: 'up',
  },
  {
    id: '4',
    hubName: 'Dankuni Hub',
    hubCode: 'DANKUNI-01',
    onTimeDelivery: 82.4,
    utilization: 68,
    dailyThroughput: 450,
    avgLoadingTime: '55 mins',
    activeVehicles: 8,
    performanceScore: 78,
    trend: 'down',
  },
];

export default function HubPerformancePage() {
  const [performance, setPerformance] = useState<HubPerformance[]>(initialPerformance);
  const [selectedHub, setSelectedHub] = useState('');
  const [dateRange, setDateRange] = useState('today');

  const filteredPerformance = selectedHub 
    ? performance.filter(h => h.hubName === selectedHub) 
    : performance;

  const avgOnTime = (filteredPerformance.reduce((sum, h) => sum + h.onTimeDelivery, 0) / filteredPerformance.length).toFixed(1);
  const avgUtilization = Math.round(filteredPerformance.reduce((sum, h) => sum + h.utilization, 0) / filteredPerformance.length);
  const totalThroughput = filteredPerformance.reduce((sum, h) => sum + h.dailyThroughput, 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hub Performance</h1>
          <p className="text-gray-600 mt-1">Real-time performance monitoring across all hubs</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select 
            value={selectedHub} 
            onChange={(e) => setSelectedHub(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="">All Hubs</option>
            {performance.map(h => (
              <option key={h.id} value={h.hubName}>{h.hubName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Avg On-Time Delivery</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">{avgOnTime}%</p>
            </div>
            <TrendingUp className="text-emerald-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Avg Utilization</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{avgUtilization}%</p>
            </div>
            <TrendingUp className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Daily Throughput</p>
              <p className="text-4xl font-bold mt-2">{totalThroughput.toLocaleString()}</p>
            </div>
            <Package className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Overall Score</p>
              <p className="text-4xl font-bold text-amber-600 mt-2">88.5</p>
            </div>
            <Award className="text-amber-500" size={32} />
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">On-Time Delivery</th>
                <th className="px-6 py-4 text-left">Utilization</th>
                <th className="px-6 py-4 text-left">Daily Throughput</th>
                <th className="px-6 py-4 text-left">Avg Loading Time</th>
                <th className="px-6 py-4 text-left">Active Vehicles</th>
                <th className="px-6 py-4 text-left">Performance Score</th>
                <th className="px-6 py-4 text-left">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPerformance.map((hub) => (
                <tr key={hub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{hub.hubName}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{hub.onTimeDelivery}%</span>
                      {hub.trend === 'up' ? (
                        <TrendingUp className="text-emerald-500" size={18} />
                      ) : (
                        <TrendingDown className="text-red-500" size={18} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${hub.utilization}%` }}
                        />
                      </div>
                      <span>{hub.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium">{hub.dailyThroughput.toLocaleString()}</td>
                  <td className="px-6 py-5">{hub.avgLoadingTime}</td>
                  <td className="px-6 py-5 font-medium">{hub.activeVehicles}</td>
                  <td className="px-6 py-5">
                    <span className={`font-bold text-lg ${hub.performanceScore >= 90 ? 'text-emerald-600' : hub.performanceScore >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {hub.performanceScore}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {hub.trend === 'up' ? '📈' : '📉'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Award className="text-indigo-600" /> Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl">
            <p className="text-emerald-600 font-medium">Best Performing Hub</p>
            <p className="text-2xl font-bold mt-2">Dadri Mother Hub</p>
            <p className="text-sm text-gray-500 mt-1">96.8% On-Time • 91% Utilization</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p className="text-amber-600 font-medium">Area of Improvement</p>
            <p className="text-2xl font-bold mt-2">Dankuni Hub</p>
            <p className="text-sm text-gray-500 mt-1">Avg Loading Time: 55 mins</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p className="text-blue-600 font-medium">Today's Throughput</p>
            <p className="text-2xl font-bold mt-2">{totalThroughput.toLocaleString()} packages</p>
            <p className="text-sm text-gray-500 mt-1">Across all hubs</p>
          </div>
        </div>
      </div>
    </div>
  );
}