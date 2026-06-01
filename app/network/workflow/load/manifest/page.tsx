'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Truck, Download, CheckCircle } from 'lucide-react';

interface LoadManifest {
  id: string;
  manifestId: string;
  hubName: string;
  vehicleNumber: string;
  driverName: string;
  bagsCount: number;
  totalWeight: number;
  loadingDate: string;
  status: 'Draft' | 'Loading' | 'Completed' | 'Dispatched';
  destination: string;
}

const initialManifests: LoadManifest[] = [
  {
    id: '1',
    manifestId: 'MAN-PAT-240501',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01AB1234',
    driverName: 'Rajesh Kumar',
    bagsCount: 28,
    totalWeight: 2450,
    loadingDate: 'May 30, 2026',
    status: 'Completed',
    destination: 'Madhubani Spoke',
  },
  {
    id: '2',
    manifestId: 'MAN-PAT-240502',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01CD5678',
    driverName: 'Manoj Singh',
    bagsCount: 35,
    totalWeight: 3120,
    loadingDate: 'May 30, 2026',
    status: 'Loading',
    destination: 'Darbhanga Spoke',
  },
  {
    id: '3',
    manifestId: 'MAN-RAN-240501',
    hubName: 'Ranchi Regional Hub',
    vehicleNumber: 'JH05XY9012',
    driverName: 'Suresh Yadav',
    bagsCount: 22,
    totalWeight: 1890,
    loadingDate: 'May 30, 2026',
    status: 'Draft',
    destination: 'Dhanbad Spoke',
  },
];

export default function LoadManifestPage() {
  const [manifests, setManifests] = useState<LoadManifest[]>(initialManifests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManifest, setEditingManifest] = useState<LoadManifest | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    manifestId: '',
    hubName: '',
    vehicleNumber: '',
    driverName: '',
    bagsCount: 0,
    totalWeight: 0,
    loadingDate: '',
    status: 'Draft' as 'Draft' | 'Loading' | 'Completed' | 'Dispatched',
    destination: '',
  });

  const filteredManifests = manifests.filter(manifest => {
    const matchesSearch = 
      manifest.manifestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manifest.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manifest.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !filterHub || manifest.hubName === filterHub;
    const matchesStatus = !filterStatus || manifest.status === filterStatus;

    return matchesSearch && matchesHub && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      manifestId: '',
      hubName: '',
      vehicleNumber: '',
      driverName: '',
      bagsCount: 0,
      totalWeight: 0,
      loadingDate: '',
      status: 'Draft',
      destination: '',
    });
    setEditingManifest(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (manifest: LoadManifest) => {
    setEditingManifest(manifest);
    setFormData({
      manifestId: manifest.manifestId,
      hubName: manifest.hubName,
      vehicleNumber: manifest.vehicleNumber,
      driverName: manifest.driverName,
      bagsCount: manifest.bagsCount,
      totalWeight: manifest.totalWeight,
      loadingDate: manifest.loadingDate,
      status: manifest.status,
      destination: manifest.destination,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.manifestId || !formData.hubName || !formData.vehicleNumber) {
      alert('Manifest ID, Hub Name and Vehicle Number are required');
      return;
    }

    const newManifest: LoadManifest = {
      id: editingManifest ? editingManifest.id : Date.now().toString(),
      manifestId: formData.manifestId.toUpperCase(),
      hubName: formData.hubName,
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      driverName: formData.driverName,
      bagsCount: formData.bagsCount,
      totalWeight: formData.totalWeight,
      loadingDate: formData.loadingDate,
      status: formData.status,
      destination: formData.destination,
    };

    if (editingManifest) {
      setManifests(manifests.map(m => m.id === editingManifest.id ? newManifest : m));
    } else {
      setManifests([...manifests, newManifest]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Load Manifest</h1>
          <p className="text-gray-600 mt-1">Create and manage digital loading manifests for vehicles</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Manifest
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
              placeholder="Manifest ID, Vehicle or Driver..."
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
            <option value="Patna Mother Hub">Patna Mother Hub</option>
            <option value="Ranchi Regional Hub">Ranchi Regional Hub</option>
            <option value="Dankuni Hub">Dankuni Hub</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Loading">Loading</option>
            <option value="Completed">Completed</option>
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
                <th className="px-6 py-4 text-left">Manifest ID</th>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Vehicle Number</th>
                <th className="px-6 py-4 text-left">Driver Name</th>
                <th className="px-6 py-4 text-left">Bags Count</th>
                <th className="px-6 py-4 text-left">Total Weight (kg)</th>
                <th className="px-6 py-4 text-left">Loading Date</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredManifests.map((manifest) => (
                <tr key={manifest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{manifest.manifestId}</td>
                  <td className="px-6 py-5">{manifest.hubName}</td>
                  <td className="px-6 py-5 font-mono">{manifest.vehicleNumber}</td>
                  <td className="px-6 py-5">{manifest.driverName}</td>
                  <td className="px-6 py-5 font-medium">{manifest.bagsCount}</td>
                  <td className="px-6 py-5">{manifest.totalWeight} kg</td>
                  <td className="px-6 py-5">{manifest.loadingDate}</td>
                  <td className="px-6 py-5 text-sm">{manifest.destination}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${manifest.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${manifest.status === 'Loading' ? 'bg-blue-100 text-blue-700' : ''}
                      ${manifest.status === 'Dispatched' ? 'bg-purple-100 text-purple-700' : ''}
                      ${manifest.status === 'Draft' ? 'bg-gray-100 text-gray-700' : ''}`}>
                      {manifest.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(manifest)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setManifests(manifests.filter(m => m.id !== manifest.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
                {editingManifest ? 'Edit Load Manifest' : 'Create Load Manifest'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Manifest ID <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.manifestId} onChange={(e) => setFormData({ ...formData, manifestId: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="MAN-PAT-240505" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
                  <select value={formData.hubName} onChange={(e) => setFormData({ ...formData, hubName: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Hub</option>
                    <option value="Patna Mother Hub">Patna Mother Hub</option>
                    <option value="Ranchi Regional Hub">Ranchi Regional Hub</option>
                    <option value="Dankuni Hub">Dankuni Hub</option>
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
                  <label className="block text-sm font-medium mb-2">Total Weight (kg)</label>
                  <input type="number" value={formData.totalWeight} onChange={(e) => setFormData({ ...formData, totalWeight: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Loading Date</label>
                  <input type="text" value={formData.loadingDate} onChange={(e) => setFormData({ ...formData, loadingDate: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="May 30, 2026" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Draft">Draft</option>
                    <option value="Loading">Loading</option>
                    <option value="Completed">Completed</option>
                    <option value="Dispatched">Dispatched</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingManifest ? 'Update Manifest' : 'Create Manifest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}