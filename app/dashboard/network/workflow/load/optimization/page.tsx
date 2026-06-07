'use client';

import React, { useState } from 'react';
import { Play, RefreshCw, Save, Map, Truck, Clock, TrendingDown,ArrowRightLeft } from 'lucide-react';

interface OptimizedRoute {
  id: string;
  routeCode: string;
  fromHub: string;
  toDestination: string;
  vehicleType: string;
  currentDistance: number;
  optimizedDistance: number;
  currentTime: string;
  optimizedTime: string;
  savings: number;
  status: 'Optimized' | 'Pending';
}

const initialRoutes: OptimizedRoute[] = [
  {
    id: '1',
    routeCode: 'PTR-PAT-001',
    fromHub: 'Patna Mother Hub',
    toDestination: 'Madhubani Spoke',
    vehicleType: 'HCV',
    currentDistance: 148,
    optimizedDistance: 132,
    currentTime: '4 hrs 50 mins',
    optimizedTime: '4 hrs 10 mins',
    savings: 16,
    status: 'Optimized',
  },
  {
    id: '2',
    routeCode: 'PTR-PAT-002',
    fromHub: 'Patna Mother Hub',
    toDestination: 'Darbhanga Spoke',
    vehicleType: 'HCV',
    currentDistance: 122,
    optimizedDistance: 108,
    currentTime: '4 hrs 05 mins',
    optimizedTime: '3 hrs 35 mins',
    savings: 14,
    status: 'Optimized',
  },
  {
    id: '3',
    routeCode: 'RAN-DHN-001',
    fromHub: 'Ranchi Regional Hub',
    toDestination: 'Dhanbad Spoke',
    vehicleType: 'LCV',
    currentDistance: 178,
    optimizedDistance: 155,
    currentTime: '5 hrs 20 mins',
    optimizedTime: '4 hrs 45 mins',
    savings: 23,
    status: 'Pending',
  },
];

export default function RouteOptimizationPage() {
  const [routes, setRoutes] = useState<OptimizedRoute[]>(initialRoutes);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedHub, setSelectedHub] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-05-30');

  const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];

  const optimizeRoutes = () => {
    setIsOptimizing(true);
    
    setTimeout(() => {
      const optimized = routes.map(route => ({
        ...route,
        optimizedDistance: Math.floor(route.currentDistance * 0.88),
        optimizedTime: route.currentTime.replace(/\d+/, (n) => (parseInt(n) - 0.5).toFixed(0)),
        savings: Math.floor(route.currentDistance * 0.12),
        status: 'Optimized' as const,
      }));
      
      setRoutes(optimized);
      setIsOptimizing(false);
      alert('✅ Routes optimized successfully! AI suggestions applied.');
    }, 1800);
  };

  const applyOptimization = () => {
    alert('🎉 Optimization applied to all routes. Updated in system.');
  };

  const totalSavings = routes.reduce((sum, r) => sum + r.savings, 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
          <p className="text-gray-600 mt-1">AI-powered route optimization to reduce distance, time & fuel</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={optimizeRoutes}
            disabled={isOptimizing}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-70"
          >
            <RefreshCw className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Optimize Routes'}
          </button>
          <button
            onClick={applyOptimization}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
          >
            <Save className="w-5 h-5" />
            Apply Changes
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Routes</p>
          <p className="text-4xl font-bold mt-2">{routes.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Distance Saved</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{totalSavings} km</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Est. Time Saved</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">~2.5 hrs</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Optimization Score</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">87%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Select Hub</label>
          <select value={selectedHub} onChange={(e) => setSelectedHub(e.target.value)} className="border rounded-xl px-4 py-3 min-w-[240px]">
            <option value="">All Hubs</option>
            {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="border rounded-xl px-4 py-3"
          />
        </div>

        <button 
          onClick={optimizeRoutes}
          className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Play size={18} />
          Run Optimization
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Route Code</th>
                <th className="px-6 py-4 text-left">From Hub</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Vehicle</th>
                <th className="px-6 py-4 text-left">Current Distance</th>
                <th className="px-6 py-4 text-left">Optimized Distance</th>
                <th className="px-6 py-4 text-left">Time Saved</th>
                <th className="px-6 py-4 text-left">Savings</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{route.routeCode}</td>
                  <td className="px-6 py-5">{route.fromHub}</td>
                  <td className="px-6 py-5 font-medium">{route.toDestination}</td>
                  <td className="px-6 py-5">{route.vehicleType}</td>
                  <td className="px-6 py-5">{route.currentDistance} km</td>
                  <td className="px-6 py-5 font-medium text-emerald-600">{route.optimizedDistance} km</td>
                  <td className="px-6 py-5 text-emerald-600 font-medium">
                    {route.currentTime} → {route.optimizedTime}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      <TrendingDown size={18} />
                      {route.savings} km
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${route.status === 'Optimized' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {route.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4">
        <div className="mt-1">
          <ArrowRightLeft className="text-blue-600" size={28} />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900">AI Route Optimization</h3>
          <p className="text-blue-700 mt-1">
            System considers traffic, road conditions, fuel efficiency, and delivery windows to suggest best routes.
          </p>
        </div>
      </div>
    </div>
  );
}