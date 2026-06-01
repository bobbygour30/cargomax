'use client';

import React, { useState, useEffect } from 'react';
import { Truck, AlertTriangle, CheckCircle, Clock, MapPin, Activity, Search, Package } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'Hub' | 'Spoke';
  status: 'Operational' | 'Delayed' | 'Congested' | 'Offline';
  activeVehicles: number;
  pendingShipments: number;
  avgDelay: string;
  lastUpdated: string;
}

const initialNetwork: NetworkNode[] = [
  {
    id: '1',
    name: 'Patna Mother Hub',
    type: 'Hub',
    status: 'Operational',
    activeVehicles: 24,
    pendingShipments: 145,
    avgDelay: '12 mins',
    lastUpdated: 'Just now',
  },
  {
    id: '2',
    name: 'Ranchi Regional Hub',
    type: 'Hub',
    status: 'Congested',
    activeVehicles: 14,
    pendingShipments: 98,
    avgDelay: '48 mins',
    lastUpdated: '2 mins ago',
  },
  {
    id: '3',
    name: 'Dadri Mother Hub',
    type: 'Hub',
    status: 'Operational',
    activeVehicles: 19,
    pendingShipments: 87,
    avgDelay: '8 mins',
    lastUpdated: 'Just now',
  },
  {
    id: '4',
    name: 'Madhubani Spoke',
    type: 'Spoke',
    status: 'Delayed',
    activeVehicles: 7,
    pendingShipments: 65,
    avgDelay: '55 mins',
    lastUpdated: '5 mins ago',
  },
  {
    id: '5',
    name: 'Dhanbad Spoke',
    type: 'Spoke',
    status: 'Operational',
    activeVehicles: 9,
    pendingShipments: 42,
    avgDelay: '15 mins',
    lastUpdated: 'Just now',
  },
];

export default function LiveNetworkStatusPage() {
  const [network, setNetwork] = useState<NetworkNode[]>(initialNetwork);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetwork(prev => prev.map(node => ({
        ...node,
        lastUpdated: Math.random() > 0.7 ? 'Just now' : node.lastUpdated,
      })));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredNetwork = network.filter(node => {
    const matchesSearch = 
      node.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || node.type === filterType;
    const matchesStatus = !filterStatus || node.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const operationalCount = network.filter(n => n.status === 'Operational').length;
  const delayedCount = network.filter(n => n.status === 'Delayed' || n.status === 'Congested').length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Operational': return 'bg-emerald-100 text-emerald-700';
      case 'Delayed': return 'bg-amber-100 text-amber-700';
      case 'Congested': return 'bg-orange-100 text-orange-700';
      case 'Offline': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Network Status</h1>
          <p className="text-gray-600 mt-1">Real-time visibility of entire logistics network</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          Live • Updated just now
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="bg-emerald-100 p-4 rounded-xl">
            <CheckCircle className="text-emerald-600" size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Operational Nodes</p>
            <p className="text-4xl font-bold text-emerald-600">{operationalCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="bg-amber-100 p-4 rounded-xl">
            <AlertTriangle className="text-amber-600" size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Delayed / Congested</p>
            <p className="text-4xl font-bold text-amber-600">{delayedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <Truck className="text-blue-600" size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Vehicles</p>
            <p className="text-4xl font-bold">{network.reduce((sum, n) => sum + n.activeVehicles, 0)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-xl">
            <Package className="text-purple-600" size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Shipments</p>
            <p className="text-4xl font-bold">{network.reduce((sum, n) => sum + n.pendingShipments, 0)}</p>
          </div>
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
              placeholder="Hub or Spoke name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Locations</option>
            <option value="Hub">Hub</option>
            <option value="Spoke">Spoke</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Operational">Operational</option>
            <option value="Delayed">Delayed</option>
            <option value="Congested">Congested</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Live Network Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Active Vehicles</th>
                <th className="px-6 py-4 text-left">Pending Shipments</th>
                <th className="px-6 py-4 text-left">Avg Delay</th>
                <th className="px-6 py-4 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNetwork.map((node) => (
                <tr key={node.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{node.name}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${node.type === 'Hub' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {node.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                      {node.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium">{node.activeVehicles}</td>
                  <td className="px-6 py-5 font-medium">{node.pendingShipments}</td>
                  <td className="px-6 py-5 text-red-600 font-medium">{node.avgDelay}</td>
                  <td className="px-6 py-5 text-sm text-gray-500">{node.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Health Bar */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-4">Network Health Overview</h3>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-400" style={{ width: '78%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Excellent</span>
          <span>78% Network Health</span>
          <span>Some Congestion Detected</span>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch(status) {
    case 'Operational': return 'bg-emerald-100 text-emerald-700';
    case 'Delayed': return 'bg-amber-100 text-amber-700';
    case 'Congested': return 'bg-orange-100 text-orange-700';
    case 'Offline': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}