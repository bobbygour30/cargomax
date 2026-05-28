'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Clock, MapPin } from 'lucide-react';

interface PrimaryRoute {
  id: string;
  routeCode: string;
  originHub: string;
  destination: string;
  destinationType: 'Hub' | 'Spoke';
  distance: number;
  estimatedTime: string;
  vehicleType: string;
  frequency: string;
  status: 'Active' | 'Inactive';
  stops: number;
}

const initialRoutes: PrimaryRoute[] = [
  {
    id: '1',
    routeCode: 'PTR-PAT-001',
    originHub: 'Patna Mother Hub',
    destination: 'Madhubani Spoke',
    destinationType: 'Spoke',
    distance: 140,
    estimatedTime: '4 hrs 30 mins',
    vehicleType: 'HCV',
    frequency: 'Daily',
    status: 'Active',
    stops: 3,
  },
  {
    id: '2',
    routeCode: 'PTR-PAT-002',
    originHub: 'Patna Mother Hub',
    destination: 'Darbhanga Spoke',
    destinationType: 'Spoke',
    distance: 115,
    estimatedTime: '3 hrs 45 mins',
    vehicleType: 'HCV',
    frequency: 'Daily',
    status: 'Active',
    stops: 2,
  },
  {
    id: '3',
    routeCode: 'PTR-RAN-001',
    originHub: 'Patna Mother Hub',
    destination: 'Ranchi Regional Hub',
    destinationType: 'Hub',
    distance: 380,
    estimatedTime: '9 hrs 15 mins',
    vehicleType: 'HCV',
    frequency: 'Twice a week',
    status: 'Active',
    stops: 5,
  },
  {
    id: '4',
    routeCode: 'RAN-DHN-001',
    originHub: 'Ranchi Regional Hub',
    destination: 'Dhanbad Spoke',
    destinationType: 'Spoke',
    distance: 165,
    estimatedTime: '4 hrs 10 mins',
    vehicleType: 'LCV',
    frequency: 'Daily',
    status: 'Active',
    stops: 4,
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];
const vehicleTypes = ['LCV', 'HCV', 'Two Wheeler', 'Auto', 'Mini Truck'];

export default function PrimaryRoutesPage() {
  const [routes, setRoutes] = useState<PrimaryRoute[]>(initialRoutes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<PrimaryRoute | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterDestinationType, setFilterDestinationType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    routeCode: '',
    originHub: '',
    destination: '',
    destinationType: 'Spoke' as 'Hub' | 'Spoke',
    distance: 0,
    estimatedTime: '',
    vehicleType: '',
    frequency: 'Daily',
    status: 'Active' as 'Active' | 'Inactive',
    stops: 0,
  });

  // Filtered Routes
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrigin = !filterOrigin || route.originHub === filterOrigin;
    const matchesDestType = !filterDestinationType || route.destinationType === filterDestinationType;
    const matchesStatus = !filterStatus || route.status === filterStatus;

    return matchesSearch && matchesOrigin && matchesDestType && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      routeCode: '',
      originHub: '',
      destination: '',
      destinationType: 'Spoke',
      distance: 0,
      estimatedTime: '',
      vehicleType: '',
      frequency: 'Daily',
      status: 'Active',
      stops: 0,
    });
    setEditingRoute(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (route: PrimaryRoute) => {
    setEditingRoute(route);
    setFormData({
      routeCode: route.routeCode,
      originHub: route.originHub,
      destination: route.destination,
      destinationType: route.destinationType,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      vehicleType: route.vehicleType,
      frequency: route.frequency,
      status: route.status,
      stops: route.stops,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.routeCode || !formData.originHub || !formData.destination) {
      alert('Route Code, Origin Hub aur Destination zaroori hain');
      return;
    }

    const newRoute: PrimaryRoute = {
      id: editingRoute ? editingRoute.id : Date.now().toString(),
      routeCode: formData.routeCode.toUpperCase(),
      originHub: formData.originHub,
      destination: formData.destination,
      destinationType: formData.destinationType,
      distance: formData.distance,
      estimatedTime: formData.estimatedTime,
      vehicleType: formData.vehicleType,
      frequency: formData.frequency,
      status: formData.status,
      stops: formData.stops,
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
          <h1 className="text-3xl font-bold text-gray-900">Primary Routes</h1>
          <p className="text-gray-600 mt-1">Manage main transportation routes between hubs and spokes</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Primary Route
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
          <label className="block text-sm font-medium mb-2">Destination Type</label>
          <select value={filterDestinationType} onChange={(e) => setFilterDestinationType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All</option>
            <option value="Hub">Hub</option>
            <option value="Spoke">Spoke</option>
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
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Route Code</th>
                <th className="px-6 py-4 text-left">Origin Hub</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Distance</th>
                <th className="px-6 py-4 text-left">Est. Time</th>
                <th className="px-6 py-4 text-left">Vehicle</th>
                <th className="px-6 py-4 text-left">Frequency</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{route.routeCode}</td>
                  <td className="px-6 py-5">{route.originHub}</td>
                  <td className="px-6 py-5 font-medium">{route.destination}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs ${route.destinationType === 'Hub' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {route.destinationType}
                    </span>
                  </td>
                  <td className="px-6 py-5">{route.distance} km</td>
                  <td className="px-6 py-5 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {route.estimatedTime}
                  </td>
                  <td className="px-6 py-5">{route.vehicleType}</td>
                  <td className="px-6 py-5">{route.frequency}</td>
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
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">
                {editingRoute ? 'Edit Primary Route' : 'Create Primary Route'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Route Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.routeCode}
                    onChange={(e) => setFormData({ ...formData, routeCode: e.target.value.toUpperCase() })}
                    className="w-full border rounded-xl px-4 py-3 font-mono"
                    placeholder="PTR-PAT-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Origin Hub <span className="text-red-500">*</span></label>
                  <select
                    value={formData.originHub}
                    onChange={(e) => setFormData({ ...formData, originHub: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">Select Origin Hub</option>
                    {hubs.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                    placeholder="Madhubani Spoke"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination Type</label>
                  <select
                    value={formData.destinationType}
                    onChange={(e) => setFormData({ ...formData, destinationType: e.target.value as 'Hub' | 'Spoke' })}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="Spoke">Spoke</option>
                    <option value="Hub">Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Distance (km) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Time</label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                    placeholder="4 hrs 30 mins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice a week">Twice a week</option>
                    <option value="Thrice a week">Thrice a week</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Stops</label>
                  <input
                    type="number"
                    value={formData.stops}
                    onChange={(e) => setFormData({ ...formData, stops: Number(e.target.value) })}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingRoute ? 'Update Route' : 'Create Route'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}