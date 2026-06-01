'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Grid3X3 } from 'lucide-react';

interface FloorAllocation {
  id: string;
  hubName: string;
  zoneCode: string;
  zoneName: string;
  totalArea: number;
  allocatedArea: number;
  utilization: number;
  status: 'Active' | 'Maintenance' | 'Full';
  description: string;
}

const initialAllocations: FloorAllocation[] = [
  {
    id: '1',
    hubName: 'Patna Mother Hub',
    zoneCode: 'ZA',
    zoneName: 'Zone A - North Bihar',
    totalArea: 12000,
    allocatedArea: 9800,
    utilization: 82,
    status: 'Active',
    description: 'North Bihar & Nepal Border shipments',
  },
  {
    id: '2',
    hubName: 'Patna Mother Hub',
    zoneCode: 'ZB',
    zoneName: 'Zone B - South Bihar',
    totalArea: 8500,
    allocatedArea: 8500,
    utilization: 100,
    status: 'Full',
    description: 'Gaya, Aurangabad & Nawada region',
  },
  {
    id: '3',
    hubName: 'Patna Mother Hub',
    zoneCode: 'ZC',
    zoneName: 'Zone C - East Bihar',
    totalArea: 9500,
    allocatedArea: 7200,
    utilization: 76,
    status: 'Active',
    description: 'Purnia, Katihar & Araria',
  },
  {
    id: '4',
    hubName: 'Ranchi Regional Hub',
    zoneCode: 'ZA',
    zoneName: 'Zone A - Jharkhand',
    totalArea: 6800,
    allocatedArea: 5200,
    utilization: 76,
    status: 'Active',
    description: 'Ranchi & surrounding areas',
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];

export default function FloorAllocationPage() {
  const [allocations, setAllocations] = useState<FloorAllocation[]>(initialAllocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<FloorAllocation | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    hubName: '',
    zoneCode: '',
    zoneName: '',
    totalArea: 0,
    allocatedArea: 0,
    status: 'Active' as 'Active' | 'Maintenance' | 'Full',
    description: '',
  });

  const filteredAllocations = allocations.filter(item => {
    const matchesSearch = 
      item.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hubName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !filterHub || item.hubName === filterHub;
    const matchesStatus = !filterStatus || item.status === filterStatus;

    return matchesSearch && matchesHub && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      hubName: '',
      zoneCode: '',
      zoneName: '',
      totalArea: 0,
      allocatedArea: 0,
      status: 'Active',
      description: '',
    });
    setEditingAllocation(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (allocation: FloorAllocation) => {
    setEditingAllocation(allocation);
    setFormData({
      hubName: allocation.hubName,
      zoneCode: allocation.zoneCode,
      zoneName: allocation.zoneName,
      totalArea: allocation.totalArea,
      allocatedArea: allocation.allocatedArea,
      status: allocation.status,
      description: allocation.description,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.hubName || !formData.zoneCode || !formData.zoneName) {
      alert('Hub Name, Zone Code and Zone Name are required');
      return;
    }

    const utilization = formData.totalArea > 0 
      ? Math.round((formData.allocatedArea / formData.totalArea) * 100) 
      : 0;

    const newAllocation: FloorAllocation = {
      id: editingAllocation ? editingAllocation.id : Date.now().toString(),
      hubName: formData.hubName,
      zoneCode: formData.zoneCode.toUpperCase(),
      zoneName: formData.zoneName,
      totalArea: formData.totalArea,
      allocatedArea: formData.allocatedArea,
      utilization: utilization,
      status: formData.status,
      description: formData.description,
    };

    if (editingAllocation) {
      setAllocations(allocations.map(a => a.id === editingAllocation.id ? newAllocation : a));
    } else {
      setAllocations([...allocations, newAllocation]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Floor Allocation</h1>
          <p className="text-gray-600 mt-1">Manage warehouse floor space and zone utilization across hubs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Floor Allocation
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
              placeholder="Zone or Hub name..."
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
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Full">Full</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Zone Code</th>
                <th className="px-6 py-4 text-left">Zone Name</th>
                <th className="px-6 py-4 text-left">Total Area (sq ft)</th>
                <th className="px-6 py-4 text-left">Allocated Area</th>
                <th className="px-6 py-4 text-left">Utilization</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAllocations.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{item.hubName}</td>
                  <td className="px-6 py-5 font-mono font-semibold">{item.zoneCode}</td>
                  <td className="px-6 py-5">{item.zoneName}</td>
                  <td className="px-6 py-5">{item.totalArea.toLocaleString()}</td>
                  <td className="px-6 py-5">{item.allocatedArea.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.utilization > 90 ? 'bg-red-500' : item.utilization > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${item.utilization}%` }}
                        />
                      </div>
                      <span className="font-medium text-sm">{item.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${item.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' : ''}
                      ${item.status === 'Full' ? 'bg-red-100 text-red-700' : ''}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(item)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setAllocations(allocations.filter(a => a.id !== item.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
              <Grid3X3 className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">
                {editingAllocation ? 'Edit Floor Allocation' : 'New Floor Allocation'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
                  <select value={formData.hubName} onChange={(e) => setFormData({ ...formData, hubName: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Hub</option>
                    {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zone Code <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.zoneCode} onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="ZA" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Zone Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.zoneName} onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="North Bihar Deliveries" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Total Area (sq ft) <span className="text-red-500">*</span></label>
                  <input type="number" value={formData.totalArea} onChange={(e) => setFormData({ ...formData, totalArea: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Allocated Area (sq ft)</label>
                  <input type="number" value={formData.allocatedArea} onChange={(e) => setFormData({ ...formData, allocatedArea: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Full">Full</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full border rounded-xl px-4 py-3" placeholder="Details about this zone..." />
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingAllocation ? 'Update Allocation' : 'Create Allocation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}