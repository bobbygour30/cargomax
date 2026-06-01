'use client';

import React, { useState } from 'react';
import { Search, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface HubOperatingCost {
  id: string;
  hubName: string;
  hubCode: string;
  month: string;
  totalCost: number;
  fuelCost: number;
  laborCost: number;
  maintenanceCost: number;
  utilityCost: number;
  rentCost: number;
  costPerShipment: number;
  change: number;
  status: 'Increasing' | 'Decreasing' | 'Stable';
}

const initialCosts: HubOperatingCost[] = [
  {
    id: '1',
    hubName: 'Patna Mother Hub',
    hubCode: 'PATNA-01',
    month: 'June 2026',
    totalCost: 1845000,
    fuelCost: 645000,
    laborCost: 520000,
    maintenanceCost: 285000,
    utilityCost: 185000,
    rentCost: 210000,
    costPerShipment: 1240,
    change: -4.2,
    status: 'Decreasing',
  },
  {
    id: '2',
    hubName: 'Ranchi Regional Hub',
    hubCode: 'RANCHI-01',
    month: 'June 2026',
    totalCost: 1240000,
    fuelCost: 385000,
    laborCost: 420000,
    maintenanceCost: 180000,
    utilityCost: 135000,
    rentCost: 120000,
    costPerShipment: 980,
    change: 2.8,
    status: 'Increasing',
  },
  {
    id: '3',
    hubName: 'Dadri Mother Hub',
    hubCode: 'DADRI-01',
    month: 'June 2026',
    totalCost: 2150000,
    fuelCost: 780000,
    laborCost: 680000,
    maintenanceCost: 320000,
    utilityCost: 210000,
    rentCost: 160000,
    costPerShipment: 1350,
    change: -6.5,
    status: 'Decreasing',
  },
  {
    id: '4',
    hubName: 'Dankuni Hub',
    hubCode: 'DANKUNI-01',
    month: 'June 2026',
    totalCost: 980000,
    fuelCost: 295000,
    laborCost: 340000,
    maintenanceCost: 145000,
    utilityCost: 95000,
    rentCost: 105000,
    costPerShipment: 890,
    change: 1.2,
    status: 'Increasing',
  },
];

export default function HubOperatingCostPage() {
  const [costs, setCosts] = useState<HubOperatingCost[]>(initialCosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('June 2026');

  const filteredCosts = costs.filter(cost => 
    cost.hubName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    cost.month === selectedMonth
  );

  const totalOperatingCost = filteredCosts.reduce((sum, c) => sum + c.totalCost, 0);
  const avgCostPerShipment = Math.round(filteredCosts.reduce((sum, c) => sum + c.costPerShipment, 0) / filteredCosts.length);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hub Operating Cost</h1>
          <p className="text-gray-600 mt-1">Detailed monthly operating cost analysis across all hubs</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-medium">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Operating Cost</p>
          <p className="text-4xl font-bold mt-2">₹{(totalOperatingCost/100000).toFixed(1)}L</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Cost per Shipment</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">₹{avgCostPerShipment}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Highest Cost Hub</p>
          <p className="text-2xl font-bold mt-2">Dadri Mother Hub</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Cost Trend</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingDown className="text-emerald-600" size={28} />
            <span className="text-3xl font-bold text-emerald-600">-3.8%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[280px]">
          <label className="block text-sm font-medium mb-2">Search Hub</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Hub name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Month</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)} 
            className="border rounded-xl px-5 py-3 min-w-[200px]"
          >
            <option value="May 2026">May 2026</option>
            <option value="June 2026">June 2026</option>
            <option value="July 2026">July 2026</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Total Cost</th>
                <th className="px-6 py-4 text-left">Fuel Cost</th>
                <th className="px-6 py-4 text-left">Labor Cost</th>
                <th className="px-6 py-4 text-left">Maintenance</th>
                <th className="px-6 py-4 text-left">Utilities</th>
                <th className="px-6 py-4 text-left">Rent</th>
                <th className="px-6 py-4 text-left">Cost/Shipment</th>
                <th className="px-6 py-4 text-left">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCosts.map((hub) => (
                <tr key={hub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{hub.hubName}</td>
                  <td className="px-6 py-5 font-bold">₹{hub.totalCost.toLocaleString()}</td>
                  <td className="px-6 py-5">₹{hub.fuelCost.toLocaleString()}</td>
                  <td className="px-6 py-5">₹{hub.laborCost.toLocaleString()}</td>
                  <td className="px-6 py-5">₹{hub.maintenanceCost.toLocaleString()}</td>
                  <td className="px-6 py-5">₹{hub.utilityCost.toLocaleString()}</td>
                  <td className="px-6 py-5">₹{hub.rentCost.toLocaleString()}</td>
                  <td className="px-6 py-5 font-medium">₹{hub.costPerShipment}</td>
                  <td className="px-6 py-5">
                    {hub.change < 0 ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingDown size={18} /> {hub.change}%
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingUp size={18} /> +{hub.change}%
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
        <h3 className="text-xl font-semibold mb-6">Cost Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-emerald-600">Most Efficient Hub</p>
            <p className="text-2xl font-bold mt-3">Ranchi Regional Hub</p>
            <p className="text-sm text-gray-500 mt-1">₹980 per shipment</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-amber-600">Highest Operating Cost</p>
            <p className="text-2xl font-bold mt-3">Dadri Mother Hub</p>
            <p className="text-sm text-gray-500 mt-1">₹21.5 Lakh</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <p className="font-medium text-blue-600">Major Cost Driver</p>
            <p className="text-2xl font-bold mt-3">Fuel (38%)</p>
            <p className="text-sm text-gray-500 mt-1">Across all hubs</p>
          </div>
        </div>
      </div>
    </div>
  );
}