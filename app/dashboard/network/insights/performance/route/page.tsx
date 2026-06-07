'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, MapPin, Award, Search } from 'lucide-react';

interface RoutePerformance {
  id: string;
  routeCode: string;
  fromLocation: string;
  toLocation: string;
  distance: number;
  avgTransitTime: string;
  onTimePercentage: number;
  totalTrips: number;
  performanceScore: number;
  trend: 'up' | 'down';
  lastUpdated: string;
}

const initialRoutePerformance: RoutePerformance[] = [
  {
    id: '1',
    routeCode: 'PTR-PAT-001',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Madhubani Spoke',
    distance: 132,
    avgTransitTime: '4h 10m',
    onTimePercentage: 96.2,
    totalTrips: 245,
    performanceScore: 94,
    trend: 'up',
    lastUpdated: 'Just now',
  },
  {
    id: '2',
    routeCode: 'PTR-PAT-002',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Darbhanga Spoke',
    distance: 108,
    avgTransitTime: '3h 35m',
    onTimePercentage: 91.8,
    totalTrips: 198,
    performanceScore: 89,
    trend: 'down',
    lastUpdated: '2 hours ago',
  },
  {
    id: '3',
    routeCode: 'RAN-DHN-001',
    fromLocation: 'Ranchi Regional Hub',
    toLocation: 'Dhanbad Spoke',
    distance: 155,
    avgTransitTime: '4h 45m',
    onTimePercentage: 88.5,
    totalTrips: 156,
    performanceScore: 85,
    trend: 'up',
    lastUpdated: 'Yesterday',
  },
  {
    id: '4',
    routeCode: 'PAT-GYA-003',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Gaya Spoke',
    distance: 98,
    avgTransitTime: '3h 20m',
    onTimePercentage: 97.4,
    totalTrips: 134,
    performanceScore: 96,
    trend: 'up',
    lastUpdated: 'Just now',
  },
];

export default function RoutePerformancePage() {
  const [routes, setRoutes] = useState<RoutePerformance[]>(initialRoutePerformance);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState('today');

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.toLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const avgOnTime = (filteredRoutes.reduce((sum, r) => sum + r.onTimePercentage, 0) / filteredRoutes.length).toFixed(1);
  const totalTrips = filteredRoutes.reduce((sum, r) => sum + r.totalTrips, 0);
  const avgPerformance = Math.round(filteredRoutes.reduce((sum, r) => sum + r.performanceScore, 0) / filteredRoutes.length);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Performance</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze performance of all operational routes</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-xl px-5 py-3"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Average On-Time</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{avgOnTime}%</p>
          <div className="flex items-center gap-1 text-emerald-500 mt-2 text-sm">
            <TrendingUp size={18} /> +2.3% from last week
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Trips</p>
          <p className="text-4xl font-bold mt-2">{totalTrips.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Performance Score</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{avgPerformance}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Routes Monitored</p>
          <p className="text-4xl font-bold mt-2">{filteredRoutes.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm font-medium mb-2">Search Route</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Route code or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Route Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded-xl px-5 py-3 min-w-[180px]">
            <option value="">All Routes</option>
            <option value="Hub to Spoke">Hub to Spoke</option>
            <option value="Hub to Hub">Hub to Hub</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Route Code</th>
                <th className="px-6 py-4 text-left">From → To</th>
                <th className="px-6 py-4 text-left">Distance</th>
                <th className="px-6 py-4 text-left">Avg Transit Time</th>
                <th className="px-6 py-4 text-left">On-Time %</th>
                <th className="px-6 py-4 text-left">Total Trips</th>
                <th className="px-6 py-4 text-left">Performance Score</th>
                <th className="px-6 py-4 text-left">Trend</th>
                <th className="px-6 py-4 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{route.routeCode}</td>
                  <td className="px-6 py-5">
                    <div className="font-medium">{route.fromLocation}</div>
                    <div className="text-gray-400 text-sm">→ {route.toLocation}</div>
                  </td>
                  <td className="px-6 py-5">{route.distance} km</td>
                  <td className="px-6 py-5">{route.avgTransitTime}</td>
                  <td className="px-6 py-5">
                    <span className={`font-bold ${route.onTimePercentage >= 95 ? 'text-emerald-600' : route.onTimePercentage >= 85 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {route.onTimePercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium">{route.totalTrips}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{route.performanceScore}</span>
                      <span className="text-xs text-gray-500">/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {route.trend === 'up' ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp size={18} /> Improving
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingDown size={18} /> Declining
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">{route.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-10 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8">
        <h3 className="text-xl font-semibold mb-6">Route Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-emerald-600">Best Performing Route</p>
            <p className="text-2xl font-bold mt-3">PTR-PAT-001</p>
            <p className="text-sm text-gray-500 mt-1">96.2% On-Time • Patna → Madhubani</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-amber-600">Needs Attention</p>
            <p className="text-2xl font-bold mt-3">RAN-DHN-001</p>
            <p className="text-sm text-gray-500 mt-1">88.5% On-Time</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-blue-600">Total Distance Covered</p>
            <p className="text-2xl font-bold mt-3">12,450 km</p>
            <p className="text-sm text-gray-500 mt-1">This month across all routes</p>
          </div>
        </div>
      </div>
    </div>
  );
}