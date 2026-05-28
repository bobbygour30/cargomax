'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, Bell } from 'lucide-react';

interface HubGeofence {
  id: string;
  hubCode: string;
  hubName: string;
  hubType: string;
  radius: number;
  alertPhone: string;
  alertEmail: string;
  status: 'Active' | 'Inactive';
  lastTested: string;
}

const initialGeofences: HubGeofence[] = [
  {
    id: '1',
    hubCode: 'DADRI-01',
    hubName: 'Dadri Mother Hub',
    hubType: 'Mother Hub',
    radius: 20,
    alertPhone: '9876543210',
    alertEmail: 'dadri.alert@logistic.com',
    status: 'Active',
    lastTested: '2 days ago',
  },
  {
    id: '2',
    hubCode: 'PATNA-01',
    hubName: 'Patna Mother Hub',
    hubType: 'Mother Hub',
    radius: 25,
    alertPhone: '9876543211',
    alertEmail: 'patna.alert@logistic.com',
    status: 'Active',
    lastTested: 'Yesterday',
  },
  {
    id: '3',
    hubCode: 'RANCHI-01',
    hubName: 'Ranchi Regional Hub',
    hubType: 'Regional Hub',
    radius: 18,
    alertPhone: '9876543212',
    alertEmail: 'ranchi.alert@logistic.com',
    status: 'Active',
    lastTested: '5 days ago',
  },
  {
    id: '4',
    hubCode: 'DANKUNI-01',
    hubName: 'Dankuni Hub',
    hubType: 'Cross-Dock Hub',
    radius: 15,
    alertPhone: '9876543213',
    alertEmail: 'dankuni.alert@logistic.com',
    status: 'Active',
    lastTested: 'Today',
  },
];

export default function HubGeofencePage() {
  const [geofences, setGeofences] = useState<HubGeofence[]>(initialGeofences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<HubGeofence | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    hubCode: '',
    hubName: '',
    hubType: 'Mother Hub',
    radius: 20,
    alertPhone: '',
    alertEmail: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const filteredGeofences = geofences.filter(geo => {
    const matchesSearch = 
      geo.hubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      geo.hubCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || geo.hubType === filterType;
    const matchesStatus = !filterStatus || geo.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      hubCode: '',
      hubName: '',
      hubType: 'Mother Hub',
      radius: 20,
      alertPhone: '',
      alertEmail: '',
      status: 'Active',
    });
    setEditingGeofence(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (geo: HubGeofence) => {
    setEditingGeofence(geo);
    setFormData({
      hubCode: geo.hubCode,
      hubName: geo.hubName,
      hubType: geo.hubType,
      radius: geo.radius,
      alertPhone: geo.alertPhone,
      alertEmail: geo.alertEmail,
      status: geo.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.hubCode || !formData.hubName || !formData.alertPhone) {
      alert('Hub Code, Hub Name and Alert Phone are required');
      return;
    }

    const newGeofence: HubGeofence = {
      id: editingGeofence ? editingGeofence.id : Date.now().toString(),
      hubCode: formData.hubCode.toUpperCase(),
      hubName: formData.hubName,
      hubType: formData.hubType,
      radius: formData.radius,
      alertPhone: formData.alertPhone,
      alertEmail: formData.alertEmail,
      status: formData.status,
      lastTested: 'Just now',
    };

    if (editingGeofence) {
      setGeofences(geofences.map(g => g.id === editingGeofence.id ? newGeofence : g));
    } else {
      setGeofences([...geofences, newGeofence]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const testGeofence = (id: string) => {
    alert(`🔔 Test alert sent to Hub ${id}`);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hub Geofence</h1>
          <p className="text-gray-600 mt-1">Manage geofence boundaries for all mother and regional hubs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Hub Geofence
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Hub</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Hub name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hub Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Types</option>
            <option value="Mother Hub">Mother Hub</option>
            <option value="Regional Hub">Regional Hub</option>
            <option value="Cross-Dock Hub">Cross-Dock Hub</option>
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
                <th className="px-6 py-4 text-left">Hub Code</th>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Geofence Radius</th>
                <th className="px-6 py-4 text-left">Alert Phone</th>
                <th className="px-6 py-4 text-left">Alert Email</th>
                <th className="px-6 py-4 text-left">Last Tested</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGeofences.map((geo) => (
                <tr key={geo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{geo.hubCode}</td>
                  <td className="px-6 py-5 font-medium">{geo.hubName}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {geo.hubType}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium">{geo.radius} km</td>
                  <td className="px-6 py-5 font-mono">{geo.alertPhone}</td>
                  <td className="px-6 py-5 text-sm text-gray-600">{geo.alertEmail}</td>
                  <td className="px-6 py-5 text-sm text-gray-500">{geo.lastTested}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${geo.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {geo.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => testGeofence(geo.hubCode)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="Test Geofence"
                      >
                        <Bell size={18} />
                      </button>
                      <button onClick={() => openEditModal(geo)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setGeofences(geofences.filter(g => g.id !== geo.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">
                {editingGeofence ? 'Edit Hub Geofence' : 'Add Hub Geofence'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Hub Code <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.hubCode} onChange={(e) => setFormData({ ...formData, hubCode: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" maxLength={10} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.hubName} onChange={(e) => setFormData({ ...formData, hubName: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hub Type</label>
                  <select value={formData.hubType} onChange={(e) => setFormData({ ...formData, hubType: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Mother Hub">Mother Hub</option>
                    <option value="Regional Hub">Regional Hub</option>
                    <option value="Cross-Dock Hub">Cross-Dock Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Geofence Radius (km) <span className="text-red-500">*</span></label>
                  <input type="number" value={formData.radius} onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Alert Recipient Phone <span className="text-red-500">*</span></label>
                  <input type="tel" value={formData.alertPhone} onChange={(e) => setFormData({ ...formData, alertPhone: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="9876543210" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Alert Recipient Email</label>
                  <input type="email" value={formData.alertEmail} onChange={(e) => setFormData({ ...formData, alertEmail: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
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
                {editingGeofence ? 'Update Geofence' : 'Create Geofence'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}