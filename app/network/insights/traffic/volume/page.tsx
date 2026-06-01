'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, BarChart3, Package } from 'lucide-react';

interface VolumeData {
  id: string;
  date: string;
  hubName: string;
  inboundVolume: number;
  outboundVolume: number;
  totalVolume: number;
  peakHour: string;
  growth: number;
}

const initialVolumeData: VolumeData[] = [
  {
    id: '1',
    date: 'May 30, 2026',
    hubName: 'Patna Mother Hub',
    inboundVolume: 1240,
    outboundVolume: 980,
    totalVolume: 2220,
    peakHour: '10:00 AM - 12:00 PM',
    growth: 12.5,
  },
  {
    id: '2',
    date: 'May 30, 2026',
    hubName: 'Ranchi Regional Hub',
    inboundVolume: 680,
    outboundVolume: 520,
    totalVolume: 1200,
    peakHour: '02:00 PM - 04:00 PM',
    growth: -3.2,
  },
  {
    id: '3',
    date: 'May 30, 2026',
    hubName: 'Dadri Mother Hub',
    inboundVolume: 950,
    outboundVolume: 780,
    totalVolume: 1730,
    peakHour: '09:00 AM - 11:00 AM',
    growth: 18.7,
  },
  {
    id: '4',
    date: 'May 29, 2026',
    hubName: 'Patna Mother Hub',
    inboundVolume: 1150,
    outboundVolume: 920,
    totalVolume: 2070,
    peakHour: '11:00 AM - 01:00 PM',
    growth: 8.4,
  },
];

export default function VolumeAnalysisPage() {
  const [volumeData, setVolumeData] = useState<VolumeData[]>(initialVolumeData);
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [selectedHub, setSelectedHub] = useState('');

  const filteredData = selectedHub 
    ? volumeData.filter(item => item.hubName === selectedHub) 
    : volumeData;

  const totalInbound = filteredData.reduce((sum, item) => sum + item.inboundVolume, 0);
  const totalOutbound = filteredData.reduce((sum, item) => sum + item.outboundVolume, 0);
  const totalVolume = totalInbound + totalOutbound;
  const avgGrowth = (filteredData.reduce((sum, item) => sum + item.growth, 0) / filteredData.length).toFixed(1);

  const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dadri Mother Hub', 'Dankuni Hub'];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volume Analysis</h1>
          <p className="text-gray-600 mt-1">Daily inbound, outbound and throughput analysis across network</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedDateRange} 
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="border rounded-xl px-5 py-3"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select 
            value={selectedHub} 
            onChange={(e) => setSelectedHub(e.target.value)}
            className="border rounded-xl px-5 py-3"
          >
            <option value="">All Hubs</option>
            {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Inbound</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalInbound.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Shipments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Outbound</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{totalOutbound.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Shipments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Volume</p>
          <p className="text-4xl font-bold mt-2">{totalVolume.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Shipments Processed</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Daily Growth</p>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-4xl font-bold text-emerald-600">{avgGrowth}%</p>
            {parseFloat(avgGrowth) > 0 ? (
              <TrendingUp className="text-emerald-500" size={32} />
            ) : (
              <TrendingDown className="text-red-500" size={32} />
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Inbound Volume</th>
                <th className="px-6 py-4 text-left">Outbound Volume</th>
                <th className="px-6 py-4 text-left">Total Volume</th>
                <th className="px-6 py-4 text-left">Peak Hour</th>
                <th className="px-6 py-4 text-left">Growth %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5">{item.date}</td>
                  <td className="px-6 py-5 font-medium">{item.hubName}</td>
                  <td className="px-6 py-5 font-medium text-blue-600">{item.inboundVolume.toLocaleString()}</td>
                  <td className="px-6 py-5 font-medium text-emerald-600">{item.outboundVolume.toLocaleString()}</td>
                  <td className="px-6 py-5 font-bold">{item.totalVolume.toLocaleString()}</td>
                  <td className="px-6 py-5 text-sm text-gray-600">{item.peakHour}</td>
                  <td className="px-6 py-5">
                    <span className={`font-medium flex items-center gap-1 ${item.growth > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {item.growth > 0 ? '↑' : '↓'} {item.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volume Insights */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Package className="text-blue-600" /> Top Performing Hub
          </h3>
          <div className="text-4xl font-bold">Patna Mother Hub</div>
          <p className="text-gray-600 mt-2">Highest daily volume with consistent growth</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <h3 className="text-xl font-semibold mb-6">Peak Volume Hours</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>10:00 AM - 12:00 PM</span>
              <span className="font-medium">42% of daily volume</span>
            </div>
            <div className="flex justify-between items-center">
              <span>02:00 PM - 04:00 PM</span>
              <span className="font-medium">31% of daily volume</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}