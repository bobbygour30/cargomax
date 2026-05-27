'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Zone {
  id: string;
  zoneCode: string;
  zoneName: string;
  hub: string;
  covers: string;
  color: string;
  status: 'Active' | 'Inactive';
  physicalLocation: string;
  palletCapacity: number;
}

const initialZones: Zone[] = [
  {
    id: '1',
    zoneCode: 'ZA',
    zoneName: 'Zone A — North Bihar',
    hub: 'Patna Mother Hub',
    covers: 'Madhubani, Sitamarhi, Darbhanga, Samastipur',
    color: '#3b82f6',
    status: 'Active',
    physicalLocation: 'Left wall, Bays 1-4',
    palletCapacity: 450,
  },
  {
    id: '2',
    zoneCode: 'ZB',
    zoneName: 'Zone B — South Bihar',
    hub: 'Patna Mother Hub',
    covers: 'Gaya, Aurangabad, Nawada, Jehanabad',
    color: '#22c55e',
    status: 'Active',
    physicalLocation: 'Right side, Bays 5-8',
    palletCapacity: 380,
  },
  {
    id: '3',
    zoneCode: 'ZC',
    zoneName: 'Zone C — East Bihar',
    hub: 'Patna Mother Hub',
    covers: 'Purnia, Kishanganj, Araria, Katihar',
    color: '#eab308',
    status: 'Active',
    physicalLocation: 'Middle section',
    palletCapacity: 420,
  },
  {
    id: '4',
    zoneCode: 'ZD',
    zoneName: 'Zone D — Nepal Border',
    hub: 'Patna Mother Hub',
    covers: 'Raxaul, Motihari, Sitamarhi',
    color: '#ef4444',
    status: 'Active',
    physicalLocation: 'Near Gate 2',
    palletCapacity: 250,
  },
  {
    id: '5',
    zoneCode: 'ZE',
    zoneName: 'Zone E — Transit / Cross-Dock',
    hub: 'Patna Mother Hub',
    covers: 'Packages moving to Ranchi/Dhanbad hub',
    color: '#6b7280',
    status: 'Active',
    physicalLocation: 'Back dock area',
    palletCapacity: 300,
  },
  {
    id: '6',
    zoneCode: 'ZA',
    zoneName: 'Zone A — Jharkhand',
    hub: 'Ranchi Regional Hub',
    covers: 'Ranchi, Khunti, Lohardaga',
    color: '#3b82f6',
    status: 'Active',
    physicalLocation: 'Main warehouse',
    palletCapacity: 280,
  },
];

const hubsList = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];

export default function ZoneConfigurationPage() {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [selectedHubFilter, setSelectedHubFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  const [formData, setFormData] = useState({
    zoneCode: '',
    zoneName: '',
    hub: '',
    covers: '',
    color: '#3b82f6',
    status: 'Active' as 'Active' | 'Inactive',
    physicalLocation: '',
    palletCapacity: 0,
  });

  // Filtered Zones
  const filteredZones = selectedHubFilter
    ? zones.filter(z => z.hub === selectedHubFilter)
    : zones;

  const resetForm = () => {
    setFormData({
      zoneCode: '',
      zoneName: '',
      hub: '',
      covers: '',
      color: '#3b82f6',
      status: 'Active',
      physicalLocation: '',
      palletCapacity: 0,
    });
    setEditingZone(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      zoneCode: zone.zoneCode,
      zoneName: zone.zoneName,
      hub: zone.hub,
      covers: zone.covers,
      color: zone.color,
      status: zone.status,
      physicalLocation: zone.physicalLocation,
      palletCapacity: zone.palletCapacity,
    });
    setIsModalOpen(true);
  };

  const handleSaveZone = () => {
    if (!formData.zoneCode || !formData.zoneName || !formData.hub || !formData.covers) {
      alert('Zone Code, Name, Hub aur Coverage fields zaroori hain');
      return;
    }

    const newZone: Zone = {
      id: editingZone ? editingZone.id : Date.now().toString(),
      zoneCode: formData.zoneCode.toUpperCase(),
      zoneName: formData.zoneName,
      hub: formData.hub,
      covers: formData.covers,
      color: formData.color,
      status: formData.status,
      physicalLocation: formData.physicalLocation,
      palletCapacity: formData.palletCapacity,
    };

    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone.id ? newZone : z));
    } else {
      setZones([...zones, newZone]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zone Configuration</h1>
          <p className="text-gray-600 mt-1">Manage operational zones across all hubs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Zone
        </button>
      </div>

      {/* Hub Filter */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex items-center gap-4">
        <label className="font-medium text-gray-700">Filter by Hub:</label>
        <select
          value={selectedHubFilter}
          onChange={(e) => setSelectedHubFilter(e.target.value)}
          className="border rounded-xl px-5 py-3 min-w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Hubs</option>
          {hubsList.map(hub => (
            <option key={hub} value={hub}>{hub}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Zone Code</th>
                <th className="px-6 py-4 text-left">Zone Name</th>
                <th className="px-6 py-4 text-left">Hub</th>
                <th className="px-6 py-4 text-left">Covers Destinations</th>
                <th className="px-6 py-4 text-left">Color</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-semibold">{zone.zoneCode}</td>
                  <td className="px-6 py-5 font-medium">{zone.zoneName}</td>
                  <td className="px-6 py-5 text-gray-700">{zone.hub}</td>
                  <td className="px-6 py-5 text-sm text-gray-600 max-w-md">{zone.covers}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-200"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-sm text-gray-500">{zone.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${zone.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {zone.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(zone)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setZones(zones.filter(z => z.id !== zone.id))}
                        className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                      >
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
                {editingZone ? 'Edit Zone' : 'Add New Zone'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
                  <select
                    value={formData.hub}
                    onChange={(e) => setFormData({ ...formData, hub: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">Select Hub</option>
                    {hubsList.map(hub => (
                      <option key={hub} value={hub}>{hub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zone Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.zoneCode}
                    onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value.toUpperCase() })}
                    maxLength={5}
                    className="w-full border rounded-xl px-4 py-3 font-mono"
                    placeholder="ZA"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Zone Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.zoneName}
                    onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                    placeholder="North Bihar Deliveries"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Destination Coverage <span className="text-red-500">*</span></label>
                  <textarea
                    value={formData.covers}
                    onChange={(e) => setFormData({ ...formData, covers: e.target.value })}
                    rows={4}
                    className="w-full border rounded-xl px-4 py-3"
                    placeholder="Madhubani, Sitamarhi, Darbhanga, Samastipur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zone Color <span className="text-red-500">*</span></label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-12 border rounded-xl p-1 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">{formData.color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pallet Capacity</label>
                  <input
                    type="number"
                    value={formData.palletCapacity}
                    onChange={(e) => setFormData({ ...formData, palletCapacity: Number(e.target.value) })}
                    className="w-full border rounded-xl px-4 py-3"
                    placeholder="450"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Physical Location Description</label>
                  <input
                    type="text"
                    value={formData.physicalLocation}
                    onChange={(e) => setFormData({ ...formData, physicalLocation: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                    placeholder="Left wall, Bays 1-4"
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
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 border rounded-2xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveZone}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium"
              >
                {editingZone ? 'Update Zone' : 'Create Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}