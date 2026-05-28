'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Map, Link } from 'lucide-react';

interface RouteMapping {
  id: string;
  pinCode: string;
  city: string;
  district: string;
  originHub: string;
  primaryRoute: string;
  alternateRoute: string;
  assignedSpoke: string;
  zoneCode: string;
  status: 'Active' | 'Inactive';
}

const initialMappings: RouteMapping[] = [
  {
    id: '1',
    pinCode: '847211',
    city: 'Madhubani',
    district: 'Madhubani',
    originHub: 'Patna Mother Hub',
    primaryRoute: 'PTR-PAT-001',
    alternateRoute: 'ALT-PTR-MDH-01',
    assignedSpoke: 'Madhubani Spoke',
    zoneCode: 'ZA',
    status: 'Active',
  },
  {
    id: '2',
    pinCode: '846001',
    city: 'Samastipur',
    district: 'Samastipur',
    originHub: 'Patna Mother Hub',
    primaryRoute: 'PTR-PAT-002',
    alternateRoute: 'ALT-PTR-DBG-01',
    assignedSpoke: 'Samastipur Spoke',
    zoneCode: 'ZA',
    status: 'Active',
  },
  {
    id: '3',
    pinCode: '824101',
    city: 'Gaya',
    district: 'Gaya',
    originHub: 'Patna Mother Hub',
    primaryRoute: 'PTR-PAT-003',
    alternateRoute: '',
    assignedSpoke: 'Gaya Spoke',
    zoneCode: 'ZB',
    status: 'Active',
  },
  {
    id: '4',
    pinCode: '834001',
    city: 'Ranchi',
    district: 'Ranchi',
    originHub: 'Ranchi Regional Hub',
    primaryRoute: 'RAN-RAN-001',
    alternateRoute: 'ALT-RAN-DHN-01',
    assignedSpoke: 'Ranchi City Spoke',
    zoneCode: 'ZA',
    status: 'Active',
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];
const zones = ['ZA', 'ZB', 'ZC', 'ZD', 'ZE'];

export default function RouteMappingPage() {
  const [mappings, setMappings] = useState<RouteMapping[]>(initialMappings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<RouteMapping | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterZone, setFilterZone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    pinCode: '',
    city: '',
    district: '',
    originHub: '',
    primaryRoute: '',
    alternateRoute: '',
    assignedSpoke: '',
    zoneCode: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Filtered Data
  const filteredMappings = mappings.filter(mapping => {
    const matchesSearch = 
      mapping.pinCode.includes(searchTerm) || 
      mapping.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !filterHub || mapping.originHub === filterHub;
    const matchesZone = !filterZone || mapping.zoneCode === filterZone;
    const matchesStatus = !filterStatus || mapping.status === filterStatus;

    return matchesSearch && matchesHub && matchesZone && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      pinCode: '', city: '', district: '', originHub: '',
      primaryRoute: '', alternateRoute: '', assignedSpoke: '',
      zoneCode: '', status: 'Active',
    });
    setEditingMapping(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (mapping: RouteMapping) => {
    setEditingMapping(mapping);
    setFormData({
      pinCode: mapping.pinCode,
      city: mapping.city,
      district: mapping.district,
      originHub: mapping.originHub,
      primaryRoute: mapping.primaryRoute,
      alternateRoute: mapping.alternateRoute,
      assignedSpoke: mapping.assignedSpoke,
      zoneCode: mapping.zoneCode,
      status: mapping.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.pinCode || !formData.originHub || !formData.primaryRoute) {
      alert('PIN Code, Origin Hub aur Primary Route zaroori hain');
      return;
    }

    const newMapping: RouteMapping = {
      id: editingMapping ? editingMapping.id : Date.now().toString(),
      pinCode: formData.pinCode,
      city: formData.city,
      district: formData.district,
      originHub: formData.originHub,
      primaryRoute: formData.primaryRoute.toUpperCase(),
      alternateRoute: formData.alternateRoute.toUpperCase(),
      assignedSpoke: formData.assignedSpoke,
      zoneCode: formData.zoneCode,
      status: formData.status,
    };

    if (editingMapping) {
      setMappings(mappings.map(m => m.id === editingMapping.id ? newMapping : m));
    } else {
      setMappings([...mappings, newMapping]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Mapping</h1>
          <p className="text-gray-600 mt-1">Map routes to PIN codes, zones and spokes for intelligent routing</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Mapping
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="PIN or City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Origin Hub</label>
          <select value={filterHub} onChange={(e) => setFilterHub(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Hubs</option>
            {hubs.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Zone</label>
          <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Zones</option>
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">PIN Code</th>
                <th className="px-6 py-4 text-left">City / District</th>
                <th className="px-6 py-4 text-left">Origin Hub</th>
                <th className="px-6 py-4 text-left">Primary Route</th>
                <th className="px-6 py-4 text-left">Alternate Route</th>
                <th className="px-6 py-4 text-left">Assigned Spoke</th>
                <th className="px-6 py-4 text-left">Zone</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMappings.map((mapping) => (
                <tr key={mapping.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{mapping.pinCode}</td>
                  <td className="px-6 py-5">
                    <div>{mapping.city}</div>
                    <div className="text-xs text-gray-500">{mapping.district}</div>
                  </td>
                  <td className="px-6 py-5">{mapping.originHub}</td>
                  <td className="px-6 py-5 font-mono text-blue-600">{mapping.primaryRoute}</td>
                  <td className="px-6 py-5 font-mono text-amber-600">
                    {mapping.alternateRoute || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-5">{mapping.assignedSpoke}</td>
                  <td className="px-6 py-5">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {mapping.zoneCode}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${mapping.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {mapping.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(mapping)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setMappings(mappings.filter(m => m.id !== mapping.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
              <Map className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">
                {editingMapping ? 'Edit Route Mapping' : 'New Route Mapping'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">PIN Code <span className="text-red-500">*</span></label>
                  <input type="text" maxLength={6} value={formData.pinCode} onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="847211" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">District</label>
                  <input type="text" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Origin Hub <span className="text-red-500">*</span></label>
                  <select value={formData.originHub} onChange={(e) => setFormData({ ...formData, originHub: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Hub</option>
                    {hubs.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Route <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.primaryRoute} onChange={(e) => setFormData({ ...formData, primaryRoute: e.target.value })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="PTR-PAT-001" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Alternate Route</label>
                  <input type="text" value={formData.alternateRoute} onChange={(e) => setFormData({ ...formData, alternateRoute: e.target.value })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="ALT-PTR-MDH-01" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Assigned Spoke</label>
                  <input type="text" value={formData.assignedSpoke} onChange={(e) => setFormData({ ...formData, assignedSpoke: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Madhubani Spoke" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zone Code</label>
                  <select value={formData.zoneCode} onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Zone</option>
                    {zones.map(z => <option key={z} value={z}>{z}</option>)}
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
                {editingMapping ? 'Update Mapping' : 'Create Mapping'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}