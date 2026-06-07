'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Clock, Truck, Package, TrendingDown } from 'lucide-react';

interface HealthMetric {
  title: string;
  value: string | number;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

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

export default function NetworkHealthDashboard() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    { title: 'Overall Health', value: '92%', change: 3.2, status: 'good' },
    { title: 'Active Vehicles', value: 87, change: -2, status: 'good' },
    { title: 'Pending Shipments', value: 1240, change: 8, status: 'warning' },
    { title: 'Avg Transit Time', value: '3.8 hrs', change: -12, status: 'good' },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, message: 'High congestion at Patna Mother Hub Dock Area', severity: 'High', time: '2 mins ago' },
    { id: 2, message: 'Route NH-27 delay due to construction', severity: 'Medium', time: '17 mins ago' },
    { id: 3, message: 'Staff shortage at Ranchi Regional Hub', severity: 'Medium', time: '45 mins ago' },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map((m, i) => ({
        ...m,
        value: i === 0 ? `${Math.floor(Math.random() * 8) + 89}%` : m.value,
        change: i === 0 ? Math.floor(Math.random() * 5) : m.change,
      })));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'good') return 'text-emerald-600 bg-emerald-100';
    if (status === 'warning') return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Health Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time overview of entire logistics network performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          LIVE NETWORK
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500">{metric.title}</p>
              {metric.change > 0 ? (
                <div className="flex items-center text-emerald-600 text-sm">
                  <TrendingUp size={18} /> +{metric.change}%
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-sm">
                  <TrendingDown size={18} /> {metric.change}%
                </div>
              )}
            </div>
            <p className="text-5xl font-bold mt-4">{metric.value}</p>
            <div className={`inline-block mt-4 px-4 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
              {metric.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Status Map Simulation */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Network Overview</h3>
            <div className="text-sm text-gray-500">Live • 142 Nodes Connected</div>
          </div>
          
          <div className="bg-gray-100 h-[380px] rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <div className="text-7xl mb-6">🗺️</div>
              <p className="text-2xl font-semibold text-gray-700">Interactive Network Map</p>
              <p className="text-gray-500 mt-3">All major hubs and spokes are connected and monitored</p>
              
              <div className="mt-8 flex justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="text-red-500" /> Active Alerts
            </h3>
            <span className="text-red-600 font-medium">{alerts.length}</span>
          </div>

          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-2xl">
                <p className="font-medium text-sm">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Network Status Table */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Network Nodes Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Active Vehicles</th>
                <th className="px-6 py-4 text-left">Pending Shipments</th>
                <th className="px-6 py-4 text-left">Avg Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {initialNetwork.map((node) => (
                <tr key={node.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{node.name}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">{node.type}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                      node.status === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 
                      node.status === 'Congested' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {node.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium">{node.activeVehicles}</td>
                  <td className="px-6 py-5 font-medium">{node.pendingShipments}</td>
                  <td className="px-6 py-5 text-red-600 font-medium">{node.avgDelay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}