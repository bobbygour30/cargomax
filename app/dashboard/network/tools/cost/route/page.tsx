'use client';

import React, { useState } from 'react';
import { Search, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface RouteCost {
  id: string;
  routeCode: string;
  fromLocation: string;
  toLocation: string;
  distance: number;
  totalTrips: number;
  fuelCost: number;
  maintenanceCost: number;
  driverCost: number;
  totalCost: number;
  costPerKm: number;
  trend: 'up' | 'down';
}

const initialRouteCosts: RouteCost[] = [
  {
    id: '1',
    routeCode: 'PTR-PAT-001',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Madhubani Spoke',
    distance: 132,
    totalTrips: 245,
    fuelCost: 45200,
    maintenanceCost: 12400,
    driverCost: 18900,
    totalCost: 76500,
    costPerKm: 2.35,
    trend: 'down',
  },
  {
    id: '2',
    routeCode: 'PTR-PAT-002',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Darbhanga Spoke',
    distance: 108,
    totalTrips: 198,
    fuelCost: 32400,
    maintenanceCost: 9800,
    driverCost: 15200,
    totalCost: 57400,
    costPerKm: 2.68,
    trend: 'up',
  },
  {
    id: '3',
    routeCode: 'RAN-DHN-001',
    fromLocation: 'Ranchi Regional Hub',
    toLocation: 'Dhanbad Spoke',
    distance: 155,
    totalTrips: 156,
    fuelCost: 52800,
    maintenanceCost: 16800,
    driverCost: 23400,
    totalCost: 93000,
    costPerKm: 3.87,
    trend: 'down',
  },
  {
    id: '4',
    routeCode: 'PAT-GYA-003',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Gaya Spoke',
    distance: 98,
    totalTrips: 134,
    fuelCost: 28900,
    maintenanceCost: 7600,
    driverCost: 9800,
    totalCost: 46300,
    costPerKm: 2.41,
    trend: 'up',
  },
];

export default function RouteCostAnalysisPage() {
  const [routes, setRoutes] = useState<RouteCost[]>(initialRouteCosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('June');

  const filteredRoutes = routes.filter(route => 
    route.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.toLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCost = filteredRoutes.reduce((sum, r) => sum + r.totalCost, 0);
  const avgCostPerKm = (filteredRoutes.reduce((sum, r) => sum + r.costPerKm, 0) / filteredRoutes.length).toFixed(2);
  const totalTrips = filteredRoutes.reduce((sum, r) => sum + r.totalTrips, 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Cost Analysis</h1>
          <p className="text-gray-600 mt-1">Detailed cost breakdown and performance analysis of all routes</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-medium">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-4xl font-bold mt-2">₹{(totalCost/100000).toFixed(1)}L</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Cost per KM</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">₹{avgCostPerKm}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Trips</p>
          <p className="text-4xl font-bold mt-2">{totalTrips}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Cost Trend</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingDown className="text-emerald-600" size={28} />
            <span className="text-3xl font-bold text-emerald-600">-4.2%</span>
          </div>
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
          <label className="block text-sm font-medium mb-2">Month</label>
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)} 
            className="border rounded-xl px-5 py-3 min-w-[160px]"
          >
            <option value="May">May 2026</option>
            <option value="June">June 2026</option>
            <option value="July">July 2026</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Route Code</th>
                <th className="px-6 py-4 text-left">Route</th>
                <th className="px-6 py-4 text-left">Distance</th>
                <th className="px-6 py-4 text-left">Total Trips</th>
                <th className="px-6 py-4 text-left">Fuel Cost</th>
                <th className="px-6 py-4 text-left">Maintenance</th>
                <th className="px-6 py-4 text-left">Driver Cost</th>
                <th className="px-6 py-4 text-left">Total Cost</th>
                <th className="px-6 py-4 text-left">Cost/KM</th>
                <th className="px-6 py-4 text-left">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{route.routeCode}</td>
                  <td className="px-6 py-5">
                    <div>{route.fromLocation}</div>
                    <div className="text-xs text-gray-500">→ {route.toLocation}</div>
                  </td>
                  <td className="px-6 py-5">{route.distance} km</td>
                  <td className="px-6 py-5 font-medium">{route.totalTrips}</td>
                  <td className="px-6 py-5">₹{route.fuelCost.toLocaleString()}</td>
                  <td className="px-6 py-5">₹{route.maintenanceCost.toLocaleString()}</td>
                  <td className="px-6 py-5">₹{route.driverCost.toLocaleString()}</td>
                  <td className="px-6 py-5 font-bold">₹{route.totalCost.toLocaleString()}</td>
                  <td className="px-6 py-5 font-medium">₹{route.costPerKm}</td>
                  <td className="px-6 py-5">
                    {route.trend === 'down' ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingDown size={18} /> Improving
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingUp size={18} /> Increasing
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
        <h3 className="text-xl font-semibold mb-6">Cost Analysis Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-emerald-600">Most Cost Efficient Route</p>
            <p className="text-2xl font-bold mt-3">PTR-PAT-001</p>
            <p className="text-sm text-gray-500 mt-1">₹2.35 / km</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-amber-600">Highest Cost Route</p>
            <p className="text-2xl font-bold mt-3">RAN-DHN-001</p>
            <p className="text-sm text-gray-500 mt-1">₹3.87 / km</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-blue-600">Monthly Cost Trend</p>
            <p className="text-2xl font-bold mt-3">-4.8%</p>
            <p className="text-sm text-gray-500 mt-1">Cost optimization successful</p>
          </div>
        </div>
      </div>
    </div>
  );
}