'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Truck, Clock, CheckCircle } from 'lucide-react';

interface VehicleLoading {
  id: string;
  loadingId: string;
  hubName: string;
  vehicleNumber: string;
  driverName: string;
  bagsCount: number;
  loadingStart: string;
  loadingEnd: string;
  status: 'Pending' | 'Loading' | 'Loaded' | 'Dispatched';
  destination: string;
}

const initialLoadings: VehicleLoading[] = [
  {
    id: '1',
    loadingId: 'LD-PAT-240501',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01AB1234',
    driverName: 'Rajesh Kumar',
    bagsCount: 28,
    loadingStart: '09:15 AM',
    loadingEnd: '10:05 AM',
    status: 'Loaded',
    destination: 'Madhubani Spoke',
  },
  {
    id: '2',
    loadingId: 'LD-PAT-240502',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01CD5678',
    driverName: 'Manoj Singh',
    bagsCount: 35,
    loadingStart: '10:30 AM',
    loadingEnd: '',
    status: 'Loading',
    destination: 'Darbhanga Spoke',
  },
  {
    id: '3',
    loadingId: 'LD-RAN-240501',
    hubName: 'Ranchi Regional Hub',
    vehicleNumber: 'JH05XY9012',
    driverName: 'Suresh Yadav',
    bagsCount: 22,
    loadingStart: '01:45 PM',
    loadingEnd: '02:30 PM',
    status: 'Dispatched',
    destination: 'Dhanbad Spoke',
  },
  {
    id: '4',
    loadingId: 'LD-PAT-240503',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01EF3456',
    driverName: 'Vikash Pandey',
    bagsCount: 19,
    loadingStart: '11:20 AM',
    loadingEnd: '',
    status: 'Pending',
    destination: 'Gaya Spoke',
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];

export default function VehicleLoadingPage() {
  const [loadings, setLoadings] = useState<VehicleLoading[]>(initialLoadings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoading, setEditingLoading] = useState<VehicleLoading | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    loadingId: '',
    hubName: '',
    vehicleNumber: '',
    driverName: '',
    bagsCount: 0,
    loadingStart: '',
    loadingEnd: '',
    status: 'Pending' as 'Pending' | 'Loading' | 'Loaded' | 'Dispatched',
    destination: '',
  });

  const filteredLoadings = loadings.filter(item => {
    const matchesSearch = 
      item.loadingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !filterHub || item.hubName === filterHub;
    const matchesStatus = !filterStatus || item.status === filterStatus;

    return matchesSearch && matchesHub && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      loadingId: '',
      hubName: '',
      vehicleNumber: '',
      driverName: '',
      bagsCount: 0,
      loadingStart: '',
      loadingEnd: '',
      status: 'Pending',
      destination: '',
    });
    setEditingLoading(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (loading: VehicleLoading) => {
    setEditingLoading(loading);
    setFormData({
      loadingId: loading.loadingId,
      hubName: loading.hubName,
      vehicleNumber: loading.vehicleNumber,
      driverName: loading.driverName,
      bagsCount: loading.bagsCount,
      loadingStart: loading.loadingStart,
      loadingEnd: loading.loadingEnd,
      status: loading.status,
      destination: loading.destination,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.loadingId || !formData.hubName || !formData.vehicleNumber) {
      alert('Loading ID, Hub Name and Vehicle Number are required');
      return;
    }

    const newLoading: VehicleLoading = {
      id: editingLoading ? editingLoading.id : Date.now().toString(),
      loadingId: formData.loadingId.toUpperCase(),
      hubName: formData.hubName,
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      driverName: formData.driverName,
      bagsCount: formData.bagsCount,
      loadingStart: formData.loadingStart,
      loadingEnd: formData.loadingEnd,
      status: formData.status,
      destination: formData.destination,
    };

    if (editingLoading) {
      setLoadings(loadings.map(l => l.id === editingLoading.id ? newLoading : l));
    } else {
      setLoadings([...loadings, newLoading]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Loading</h1>
          <p className="text-gray-600 mt-1">Manage loading of bags and shipments into vehicles</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          New Vehicle Loading
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
              placeholder="Loading ID, Vehicle or Driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hub</label>
          <select value={filterHub} onChange={(e) => setFilterHub(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Hubs</option>
            {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Loading">Loading</option>
            <option value="Loaded">Loaded</option>
            <option value="Dispatched">Dispatched</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Loading ID</th>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Vehicle Number</th>
                <th className="px-6 py-4 text-left">Driver Name</th>
                <th className="px-6 py-4 text-left">Bags Count</th>
                <th className="px-6 py-4 text-left">Loading Start</th>
                <th className="px-6 py-4 text-left">Loading End</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLoadings.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{item.loadingId}</td>
                  <td className="px-6 py-5">{item.hubName}</td>
                  <td className="px-6 py-5 font-mono">{item.vehicleNumber}</td>
                  <td className="px-6 py-5">{item.driverName}</td>
                  <td className="px-6 py-5 font-medium">{item.bagsCount}</td>
                  <td className="px-6 py-5">{item.loadingStart}</td>
                  <td className="px-6 py-5">{item.loadingEnd || '-'}</td>
                  <td className="px-6 py-5 text-sm">{item.destination}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${item.status === 'Loading' ? 'bg-blue-100 text-blue-700' : ''}
                      ${item.status === 'Loaded' ? 'bg-purple-100 text-purple-700' : ''}
                      ${item.status === 'Dispatched' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(item)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setLoadings(loadings.filter(l => l.id !== item.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
              <Truck className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">
                {editingLoading ? 'Edit Vehicle Loading' : 'New Vehicle Loading'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Loading ID <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.loadingId} onChange={(e) => setFormData({ ...formData, loadingId: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="LD-PAT-240505" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
                  <select value={formData.hubName} onChange={(e) => setFormData({ ...formData, hubName: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Hub</option>
                    {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Number <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.vehicleNumber} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="BR01AB1234" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Driver Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.driverName} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Madhubani Spoke" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bags Count</label>
                  <input type="number" value={formData.bagsCount} onChange={(e) => setFormData({ ...formData, bagsCount: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Loading Start Time</label>
                  <input type="text" value={formData.loadingStart} onChange={(e) => setFormData({ ...formData, loadingStart: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="09:15 AM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Loading End Time</label>
                  <input type="text" value={formData.loadingEnd} onChange={(e) => setFormData({ ...formData, loadingEnd: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="10:05 AM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Pending">Pending</option>
                    <option value="Loading">Loading</option>
                    <option value="Loaded">Loaded</option>
                    <option value="Dispatched">Dispatched</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingLoading ? 'Update Loading' : 'Start Loading'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}