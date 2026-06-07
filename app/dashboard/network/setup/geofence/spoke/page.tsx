'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, Bell } from 'lucide-react';

interface SpokeGeofence {
  id: string;
  spokeCode: string;
  spokeName: string;
  parentHub: string;
  radius: number;
  alertPhone: string;
  alertEmail: string;
  status: 'Active' | 'Inactive';
  lastTested: string;
}

const initialSpokeGeofences: SpokeGeofence[] = [
  {
    id: '1',
    spokeCode: 'MDH-01',
    spokeName: 'Madhubani Spoke',
    parentHub: 'Patna Mother Hub',
    radius: 40,
    alertPhone: '9876543214',
    alertEmail: 'madhubani.spoke@logistic.com',
    status: 'Active',
    lastTested: 'Today',
  },
  {
    id: '2',
    spokeCode: 'DBG-01',
    spokeName: 'Darbhanga Spoke',
    parentHub: 'Patna Mother Hub',
    radius: 35,
    alertPhone: '9876543215',
    alertEmail: 'darbhanga.spoke@logistic.com',
    status: 'Active',
    lastTested: '3 days ago',
  },
  {
    id: '3',
    spokeCode: 'PRN-01',
    spokeName: 'Purnia Spoke',
    parentHub: 'Patna Mother Hub',
    radius: 50,
    alertPhone: '9876543216',
    alertEmail: 'purnia.spoke@logistic.com',
    status: 'Active',
    lastTested: 'Yesterday',
  },
  {
    id: '4',
    spokeCode: 'RNC-01',
    spokeName: 'Ranchi City Spoke',
    parentHub: 'Ranchi Regional Hub',
    radius: 25,
    alertPhone: '9876543217',
    alertEmail: 'ranchi.spoke@logistic.com',
    status: 'Active',
    lastTested: '1 week ago',
  },
  {
    id: '5',
    spokeCode: 'DHN-01',
    spokeName: 'Dhanbad Spoke',
    parentHub: 'Dankuni Hub',
    radius: 30,
    alertPhone: '9876543218',
    alertEmail: 'dhanbad.spoke@logistic.com',
    status: 'Active',
    lastTested: '2 days ago',
  },
];

const parentHubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];

export default function SpokeGeofencePage() {
  const [geofences, setGeofences] = useState<SpokeGeofence[]>(initialSpokeGeofences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<SpokeGeofence | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    spokeCode: '',
    spokeName: '',
    parentHub: '',
    radius: 30,
    alertPhone: '',
    alertEmail: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Filtered Data
  const filteredGeofences = geofences.filter(geo => {
    const matchesSearch = 
      geo.spokeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      geo.spokeCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !filterHub || geo.parentHub === filterHub;
    const matchesStatus = !filterStatus || geo.status === filterStatus;

    return matchesSearch && matchesHub && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      spokeCode: '',
      spokeName: '',
      parentHub: '',
      radius: 30,
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

  const openEditModal = (geo: SpokeGeofence) => {
    setEditingGeofence(geo);
    setFormData({
      spokeCode: geo.spokeCode,
      spokeName: geo.spokeName,
      parentHub: geo.parentHub,
      radius: geo.radius,
      alertPhone: geo.alertPhone,
      alertEmail: geo.alertEmail,
      status: geo.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.spokeCode || !formData.spokeName || !formData.parentHub || !formData.alertPhone) {
      alert('Spoke Code, Name, Parent Hub and Alert Phone are required');
      return;
    }

    const newGeofence: SpokeGeofence = {
      id: editingGeofence ? editingGeofence.id : Date.now().toString(),
      spokeCode: formData.spokeCode.toUpperCase(),
      spokeName: formData.spokeName,
      parentHub: formData.parentHub,
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

  const testGeofence = (spokeCode: string) => {
    alert(`🔔 Test Geofence Alert sent successfully to ${spokeCode}`);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spoke Geofence</h1>
          <p className="text-gray-600 mt-1">Manage geofence boundaries for all last-mile delivery spokes</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Spoke Geofence
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Spoke</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Spoke name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Parent Hub</label>
          <select value={filterHub} onChange={(e) => setFilterHub(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Hubs</option>
            {parentHubs.map(hub => (
              <option key={hub} value={hub}>{hub}</option>
            ))}
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
                <th className="px-6 py-4 text-left">Spoke Code</th>
                <th className="px-6 py-4 text-left">Spoke Name</th>
                <th className="px-6 py-4 text-left">Parent Hub</th>
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
                  <td className="px-6 py-5 font-mono font-medium">{geo.spokeCode}</td>
                  <td className="px-6 py-5 font-medium">{geo.spokeName}</td>
                  <td className="px-6 py-5 text-gray-700">{geo.parentHub}</td>
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
                        onClick={() => testGeofence(geo.spokeCode)}
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
                {editingGeofence ? 'Edit Spoke Geofence' : 'Add Spoke Geofence'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Spoke Code <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.spokeCode} 
                    onChange={(e) => setFormData({ ...formData, spokeCode: e.target.value.toUpperCase() })} 
                    className="w-full border rounded-xl px-4 py-3 font-mono" 
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Spoke Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.spokeName} 
                    onChange={(e) => setFormData({ ...formData, spokeName: e.target.value })} 
                    className="w-full border rounded-xl px-4 py-3" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Parent Hub <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.parentHub} 
                    onChange={(e) => setFormData({ ...formData, parentHub: e.target.value })} 
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">Select Parent Hub</option>
                    {parentHubs.map(hub => (
                      <option key={hub} value={hub}>{hub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Geofence Radius (km) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={formData.radius} 
                    onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })} 
                    className="w-full border rounded-xl px-4 py-3" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Alert Recipient Phone <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    value={formData.alertPhone} 
                    onChange={(e) => setFormData({ ...formData, alertPhone: e.target.value })} 
                    className="w-full border rounded-xl px-4 py-3" 
                    placeholder="9876543210" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Alert Recipient Email</label>
                  <input 
                    type="email" 
                    value={formData.alertEmail} 
                    onChange={(e) => setFormData({ ...formData, alertEmail: e.target.value })} 
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