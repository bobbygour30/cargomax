'use client';

import React, { useState } from 'react';
import { Plus, Edit2, TrendingUp, TrendingDown, AlertTriangle, Search } from 'lucide-react';

interface HubCapacity {
  id: string;
  hubName: string;
  hubCode: string;
  totalCapacity: number;
  utilizedCapacity: number;
  availableCapacity: number;
  utilization: number;
  maxDailyThroughput: number;
  currentThroughput: number;
  status: 'Optimal' | 'Moderate' | 'High' | 'Critical';
}

const initialCapacity: HubCapacity[] = [
  {
    id: '1',
    hubName: 'Patna Mother Hub',
    hubCode: 'PATNA-01',
    totalCapacity: 45000,
    utilizedCapacity: 37800,
    availableCapacity: 7200,
    utilization: 84,
    maxDailyThroughput: 1800,
    currentThroughput: 1420,
    status: 'Moderate',
  },
  {
    id: '2',
    hubName: 'Dadri Mother Hub',
    hubCode: 'DADRI-01',
    totalCapacity: 52000,
    utilizedCapacity: 46800,
    availableCapacity: 5200,
    utilization: 90,
    maxDailyThroughput: 2100,
    currentThroughput: 1950,
    status: 'High',
  },
  {
    id: '3',
    hubName: 'Ranchi Regional Hub',
    hubCode: 'RANCHI-01',
    totalCapacity: 28000,
    utilizedCapacity: 18200,
    availableCapacity: 9800,
    utilization: 65,
    maxDailyThroughput: 950,
    currentThroughput: 680,
    status: 'Optimal',
  },
  {
    id: '4',
    hubName: 'Dankuni Hub',
    hubCode: 'DANKUNI-01',
    totalCapacity: 32000,
    utilizedCapacity: 29800,
    availableCapacity: 2200,
    utilization: 93,
    maxDailyThroughput: 1200,
    currentThroughput: 980,
    status: 'Critical',
  },
];

export default function HubCapacityPage() {
  const [capacityData, setCapacityData] = useState<HubCapacity[]>(initialCapacity);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHub, setEditingHub] = useState<HubCapacity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredData = capacityData.filter(hub => {
    const matchesSearch = hub.hubName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || hub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCapacity = capacityData.reduce((sum, h) => sum + h.totalCapacity, 0);
  const totalUtilized = capacityData.reduce((sum, h) => sum + h.utilizedCapacity, 0);
  const overallUtilization = Math.round((totalUtilized / totalCapacity) * 100);

  const openAddModal = () => {
    setEditingHub(null);
    setIsModalOpen(true);
  };

  const openEditModal = (hub: HubCapacity) => {
    setEditingHub(hub);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    const newHub: HubCapacity = {
      id: editingHub ? editingHub.id : Date.now().toString(),
      hubName: formData.hubName,
      hubCode: formData.hubCode.toUpperCase(),
      totalCapacity: Number(formData.totalCapacity),
      utilizedCapacity: Number(formData.utilizedCapacity),
      availableCapacity: Number(formData.totalCapacity) - Number(formData.utilizedCapacity),
      utilization: Math.round((Number(formData.utilizedCapacity) / Number(formData.totalCapacity)) * 100),
      maxDailyThroughput: Number(formData.maxDailyThroughput),
      currentThroughput: Number(formData.currentThroughput),
      status: formData.status,
    };

    if (editingHub) {
      setCapacityData(capacityData.map(h => h.id === editingHub.id ? newHub : h));
    } else {
      setCapacityData([...capacityData, newHub]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hub Capacity Management</h1>
          <p className="text-gray-600 mt-1">Monitor warehouse capacity utilization across all hubs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Hub Capacity
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Capacity</p>
          <p className="text-4xl font-bold mt-2">{(totalCapacity/1000).toFixed(1)}k sq ft</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Overall Utilization</p>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{overallUtilization}%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Available Space</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{((totalCapacity - totalUtilized)/1000).toFixed(1)}k sq ft</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Critical Hubs</p>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {capacityData.filter(h => h.status === 'Critical').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
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
          <label className="block text-sm font-medium mb-2">Status</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="border rounded-xl px-5 py-3 min-w-[180px]"
          >
            <option value="">All Status</option>
            <option value="Optimal">Optimal</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
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
                <th className="px-6 py-4 text-left">Total Capacity</th>
                <th className="px-6 py-4 text-left">Utilized</th>
                <th className="px-6 py-4 text-left">Available</th>
                <th className="px-6 py-4 text-left">Utilization</th>
                <th className="px-6 py-4 text-left">Daily Throughput</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((hub) => (
                <tr key={hub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{hub.hubName}</td>
                  <td className="px-6 py-5 font-medium">{hub.totalCapacity.toLocaleString()} sq ft</td>
                  <td className="px-6 py-5">{hub.utilizedCapacity.toLocaleString()} sq ft</td>
                  <td className="px-6 py-5 text-emerald-600 font-medium">{hub.availableCapacity.toLocaleString()} sq ft</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            hub.utilization > 90 ? 'bg-red-500' : 
                            hub.utilization > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${hub.utilization}%` }}
                        />
                      </div>
                      <span className="font-medium">{hub.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {hub.currentThroughput} / {hub.maxDailyThroughput}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${hub.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${hub.status === 'Moderate' ? 'bg-blue-100 text-blue-700' : ''}
                      ${hub.status === 'High' ? 'bg-amber-100 text-amber-700' : ''}
                      ${hub.status === 'Critical' ? 'bg-red-100 text-red-700' : ''}`}>
                      {hub.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => openEditModal(hub)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <HubCapacityModal 
          editingHub={editingHub} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}

// Modal Component
function HubCapacityModal({ 
  editingHub, 
  onClose, 
  onSave 
}: { 
  editingHub: HubCapacity | null; 
  onClose: () => void; 
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    hubName: editingHub?.hubName || '',
    hubCode: editingHub?.hubCode || '',
    totalCapacity: editingHub?.totalCapacity || 0,
    utilizedCapacity: editingHub?.utilizedCapacity || 0,
    maxDailyThroughput: editingHub?.maxDailyThroughput || 0,
    currentThroughput: editingHub?.currentThroughput || 0,
    status: editingHub?.status || 'Optimal',
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-semibold">
            {editingHub ? 'Edit Hub Capacity' : 'Add New Hub Capacity'}
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.hubName} 
                onChange={(e) => setFormData({...formData, hubName: e.target.value})} 
                className="w-full border rounded-xl px-4 py-3" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hub Code <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.hubCode} 
                onChange={(e) => setFormData({...formData, hubCode: e.target.value.toUpperCase()})} 
                className="w-full border rounded-xl px-4 py-3 font-mono" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Capacity (sq ft) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                value={formData.totalCapacity} 
                onChange={(e) => setFormData({...formData, totalCapacity: Number(e.target.value)})} 
                className="w-full border rounded-xl px-4 py-3" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Utilized Capacity (sq ft)</label>
              <input 
                type="number" 
                value={formData.utilizedCapacity} 
                onChange={(e) => setFormData({...formData, utilizedCapacity: Number(e.target.value)})} 
                className="w-full border rounded-xl px-4 py-3" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Daily Throughput</label>
              <input 
                type="number" 
                value={formData.maxDailyThroughput} 
                onChange={(e) => setFormData({...formData, maxDailyThroughput: Number(e.target.value)})} 
                className="w-full border rounded-xl px-4 py-3" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Throughput</label>
              <input 
                type="number" 
                value={formData.currentThroughput} 
                onChange={(e) => setFormData({...formData, currentThroughput: Number(e.target.value)})} 
                className="w-full border rounded-xl px-4 py-3" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value as any})} 
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="Optimal">Optimal</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t p-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
            {editingHub ? 'Update Capacity' : 'Save Capacity'}
          </button>
        </div>
      </div>
    </div>
  );
}