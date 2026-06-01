'use client';

import React, { useState } from 'react';
import { Clock, TrendingUp, BarChart3, Search } from 'lucide-react';

interface PeakHourData {
  id: string;
  hubName: string;
  peakHour: string;
  volume: number;
  percentageOfDay: number;
  avgVehicles: number;
  status: 'Normal' | 'High' | 'Critical';
}

const initialPeakHours: PeakHourData[] = [
  {
    id: '1',
    hubName: 'Patna Mother Hub',
    peakHour: '10:00 AM - 12:00 PM',
    volume: 1240,
    percentageOfDay: 42,
    avgVehicles: 18,
    status: 'High',
  },
  {
    id: '2',
    hubName: 'Ranchi Regional Hub',
    peakHour: '02:00 PM - 04:00 PM',
    volume: 680,
    percentageOfDay: 38,
    avgVehicles: 12,
    status: 'Normal',
  },
  {
    id: '3',
    hubName: 'Dadri Mother Hub',
    peakHour: '09:30 AM - 11:30 AM',
    volume: 950,
    percentageOfDay: 45,
    avgVehicles: 15,
    status: 'High',
  },
  {
    id: '4',
    hubName: 'Dankuni Hub',
    peakHour: '11:00 AM - 01:00 PM',
    volume: 520,
    percentageOfDay: 35,
    avgVehicles: 9,
    status: 'Normal',
  },
];

export default function PeakHoursPage() {
  const [peakData, setPeakData] = useState<PeakHourData[]>(initialPeakHours);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHub, setSelectedHub] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-05-30');

  const filteredData = peakData.filter(item => {
    const matchesSearch = item.hubName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHub = !selectedHub || item.hubName === selectedHub;
    return matchesSearch && matchesHub;
  });

  const totalPeakVolume = filteredData.reduce((sum, item) => sum + item.volume, 0);
  const highestPeak = [...filteredData].sort((a, b) => b.percentageOfDay - a.percentageOfDay)[0];

  const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dadri Mother Hub', 'Dankuni Hub'];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peak Hours Analysis</h1>
          <p className="text-gray-600 mt-1">Identify busiest hours and optimize resource allocation</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="border rounded-xl px-4 py-3"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Peak Volume</p>
          <p className="text-4xl font-bold mt-2">{totalPeakVolume.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Shipments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Highest Peak</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">{highestPeak?.percentageOfDay || 0}%</p>
          <p className="text-sm text-gray-500 mt-1">{highestPeak?.peakHour}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Vehicles in Peak</p>
          <p className="text-4xl font-bold mt-2">
            {Math.round(filteredData.reduce((sum, item) => sum + item.avgVehicles, 0) / filteredData.length)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Critical Peak Hubs</p>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {filteredData.filter(item => item.status === 'High').length}
          </p>
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
              placeholder="Search hub name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Hub</label>
          <select 
            value={selectedHub} 
            onChange={(e) => setSelectedHub(e.target.value)} 
            className="border rounded-xl px-5 py-3 min-w-[220px]"
          >
            <option value="">All Hubs</option>
            {hubs.map(hub => (
              <option key={hub} value={hub}>{hub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Peak Hour</th>
                <th className="px-6 py-4 text-left">Volume</th>
                <th className="px-6 py-4 text-left">% of Daily Volume</th>
                <th className="px-6 py-4 text-left">Avg Vehicles</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{item.hubName}</td>
                  <td className="px-6 py-5 font-medium flex items-center gap-2">
                    <Clock size={18} className="text-gray-400" />
                    {item.peakHour}
                  </td>
                  <td className="px-6 py-5 font-bold text-lg">{item.volume.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-2.5 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${item.percentageOfDay}%` }}
                        />
                      </div>
                      <span className="font-medium">{item.percentageOfDay}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium">{item.avgVehicles}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${item.status === 'High' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm border">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" /> Peak Hours Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <p className="font-medium">Most Congested Hub</p>
            <p className="text-2xl font-bold mt-3">Patna Mother Hub</p>
            <p className="text-sm text-gray-500 mt-1">42% volume between 10 AM - 12 PM</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <p className="font-medium">Best Time to Schedule</p>
            <p className="text-2xl font-bold mt-3">After 4:00 PM</p>
            <p className="text-sm text-gray-500 mt-1">Lowest congestion across network</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <p className="font-medium">Recommendation</p>
            <p className="text-lg font-medium mt-3">Add more staff during 10 AM - 12 PM at Patna Hub</p>
          </div>
        </div>
      </div>
    </div>
  );
}