'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Clock, AlertTriangle } from 'lucide-react';

interface AlternateRoute {
  id: string;
  routeCode: string;
  primaryRouteCode: string;
  originHub: string;
  destination: string;
  destinationType: 'Hub' | 'Spoke';
  distance: number;
  estimatedTime: string;
  reason: string;
  vehicleType: string;
  status: 'Active' | 'Inactive';
  priority: 'High' | 'Medium' | 'Low';
}

const initialAlternateRoutes: AlternateRoute[] = [
  {
    id: '1',
    routeCode: 'ALT-PTR-MDH-01',
    primaryRouteCode: 'PTR-PAT-001',
    originHub: 'Patna Mother Hub',
    destination: 'Madhubani Spoke',
    destinationType: 'Spoke',
    distance: 155,
    estimatedTime: '5 hrs 15 mins',
    reason: 'Main road construction',
    vehicleType: 'HCV',
    status: 'Active',
    priority: 'High',
  },
  {
    id: '2',
    routeCode: 'ALT-PTR-DBG-01',
    primaryRouteCode: 'PTR-PAT-002',
    originHub: 'Patna Mother Hub',
    destination: 'Darbhanga Spoke',
    destinationType: 'Spoke',
    distance: 128,
    estimatedTime: '4 hrs 20 mins',
    reason: 'Peak hour congestion',
    vehicleType: 'LCV',
    status: 'Active',
    priority: 'Medium',
  },
  {
    id: '3',
    routeCode: 'ALT-RAN-DHN-01',
    primaryRouteCode: 'RAN-DHN-001',
    originHub: 'Ranchi Regional Hub',
    destination: 'Dhanbad Spoke',
    destinationType: 'Spoke',
    distance: 180,
    estimatedTime: '5 hrs 10 mins',
    reason: 'Monsoon affected road',
    vehicleType: 'HCV',
    status: 'Active',
    priority: 'High',
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];
const vehicleTypes = ['LCV', 'HCV', 'Two Wheeler', 'Auto', 'Mini Truck'];

export default function AlternateRoutesPage() {
  const [routes, setRoutes] = useState<AlternateRoute[]>(initialAlternateRoutes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<AlternateRoute | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    routeCode: '',
    primaryRouteCode: '',
    originHub: '',
    destination: '',
    destinationType: 'Spoke' as 'Hub' | 'Spoke',
    distance: 0,
    estimatedTime: '',
    reason: '',
    vehicleType: '',
    status: 'Active' as 'Active' | 'Inactive',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
  });

  // Filtered Routes
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.primaryRouteCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrigin = !filterOrigin || route.originHub === filterOrigin;
    const matchesPriority = !filterPriority || route.priority === filterPriority;
    const matchesStatus = !filterStatus || route.status === filterStatus;

    return matchesSearch && matchesOrigin && matchesPriority && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      routeCode: '',
      primaryRouteCode: '',
      originHub: '',
      destination: '',
      destinationType: 'Spoke',
      distance: 0,
      estimatedTime: '',
      reason: '',
      vehicleType: '',
      status: 'Active',
      priority: 'Medium',
    });
    setEditingRoute(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (route: AlternateRoute) => {
    setEditingRoute(route);
    setFormData({
      routeCode: route.routeCode,
      primaryRouteCode: route.primaryRouteCode,
      originHub: route.originHub,
      destination: route.destination,
      destinationType: route.destinationType,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      reason: route.reason,
      vehicleType: route.vehicleType,
      status: route.status,
      priority: route.priority,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.routeCode || !formData.originHub || !formData.destination || !formData.reason) {
      alert('Route Code, Origin, Destination aur Reason zaroori hain');
      return;
    }

    const newRoute: AlternateRoute = {
      id: editingRoute ? editingRoute.id : Date.now().toString(),
      routeCode: formData.routeCode.toUpperCase(),
      primaryRouteCode: formData.primaryRouteCode.toUpperCase(),
      originHub: formData.originHub,
      destination: formData.destination,
      destinationType: formData.destinationType,
      distance: formData.distance,
      estimatedTime: formData.estimatedTime,
      reason: formData.reason,
      vehicleType: formData.vehicleType,
      status: formData.status,
      priority: formData.priority,
    };

    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? newRoute : r));
    } else {
      setRoutes([...routes, newRoute]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alternate Routes</h1>
          <p className="text-gray-600 mt-1">Manage backup and contingency routes for operational continuity</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Alternate Route
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
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
          <label className="block text-sm font-medium mb-2">Origin Hub</label>
          <select value={filterOrigin} onChange={(e) => setFilterOrigin(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Hubs</option>
            {hubs.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Alternate Route Code</th>
                <th className="px-6 py-4 text-left">Primary Route</th>
                <th className="px-6 py-4 text-left">Origin Hub</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Distance</th>
                <th className="px-6 py-4 text-left">Est. Time</th>
                <th className="px-6 py-4 text-left">Reason</th>
                <th className="px-6 py-4 text-left">Priority</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{route.routeCode}</td>
                  <td className="px-6 py-5 text-gray-600">{route.primaryRouteCode}</td>
                  <td className="px-6 py-5">{route.originHub}</td>
                  <td className="px-6 py-5 font-medium">{route.destination}</td>
                  <td className="px-6 py-5">{route.distance} km</td>
                  <td className="px-6 py-5 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {route.estimatedTime}
                  </td>
                  <td className="px-6 py-5 text-sm text-amber-600 max-w-xs truncate">
                    {route.reason}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${route.priority === 'High' ? 'bg-red-100 text-red-700' : ''}
                      ${route.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : ''}
                      ${route.priority === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                      {route.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${route.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(route)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setRoutes(routes.filter(r => r.id !== route.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b flex items-center gap-3">
              <AlertTriangle className="text-amber-500" size={28} />
              <h2 className="text-2xl font-semibold">
                {editingRoute ? 'Edit Alternate Route' : 'Create Alternate Route'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Alternate Route Code <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.routeCode} onChange={(e) => setFormData({ ...formData, routeCode: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="ALT-PTR-MDH-01" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Route Code</label>
                  <input type="text" value={formData.primaryRouteCode} onChange={(e) => setFormData({ ...formData, primaryRouteCode: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="PTR-PAT-001" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Origin Hub <span className="text-red-500">*</span></label>
                  <select value={formData.originHub} onChange={(e) => setFormData({ ...formData, originHub: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Origin Hub</option>
                    {hubs.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Madhubani Spoke" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination Type</label>
                  <select value={formData.destinationType} onChange={(e) => setFormData({ ...formData, destinationType: e.target.value as 'Hub' | 'Spoke' })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Spoke">Spoke</option>
                    <option value="Hub">Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Distance (km)</label>
                  <input type="number" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Time</label>
                  <input type="text" value={formData.estimatedTime} onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="5 hrs 15 mins" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                  <select value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Vehicle</option>
                    {vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Reason for Alternate Route <span className="text-red-500">*</span></label>
                  <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} rows={3} className="w-full border rounded-xl px-4 py-3" placeholder="Main road under construction / Heavy traffic" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'High' | 'Medium' | 'Low' })} className="w-full border rounded-xl px-4 py-3">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingRoute ? 'Update Route' : 'Create Alternate Route'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}