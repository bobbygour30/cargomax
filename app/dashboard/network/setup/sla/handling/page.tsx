'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Clock } from 'lucide-react';

interface HandlingSLA {
  id: string;
  slaCode: string;
  location: string;
  locationType: 'Hub' | 'Spoke';
  operationType: string;
  standardTime: string;
  gracePeriod: number;
  penaltyPercent: number;
  applicableDays: string;
  status: 'Active' | 'Inactive';
}

const initialHandlingSLAs: HandlingSLA[] = [
  {
    id: '1',
    slaCode: 'SLA-HN-001',
    location: 'Patna Mother Hub',
    locationType: 'Hub',
    operationType: 'Loading',
    standardTime: '45 mins',
    gracePeriod: 15,
    penaltyPercent: 8,
    applicableDays: 'All Days',
    status: 'Active',
  },
  {
    id: '2',
    slaCode: 'SLA-HN-002',
    location: 'Patna Mother Hub',
    locationType: 'Hub',
    operationType: 'Unloading',
    standardTime: '60 mins',
    gracePeriod: 20,
    penaltyPercent: 10,
    applicableDays: 'All Days',
    status: 'Active',
  },
  {
    id: '3',
    slaCode: 'SLA-HN-003',
    location: 'Madhubani Spoke',
    locationType: 'Spoke',
    operationType: 'Loading',
    standardTime: '30 mins',
    gracePeriod: 10,
    penaltyPercent: 6,
    applicableDays: 'Mon-Sat',
    status: 'Active',
  },
  {
    id: '4',
    slaCode: 'SLA-HN-004',
    location: 'Ranchi Regional Hub',
    locationType: 'Hub',
    operationType: 'Cross-Docking',
    standardTime: '2 hrs 30 mins',
    gracePeriod: 30,
    penaltyPercent: 12,
    applicableDays: 'All Days',
    status: 'Active',
  },
];

const locations = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub', 'Madhubani Spoke', 'Darbhanga Spoke'];

export default function HandlingSLAPage() {
  const [slas, setSlas] = useState<HandlingSLA[]>(initialHandlingSLAs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSLA, setEditingSLA] = useState<HandlingSLA | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocationType, setFilterLocationType] = useState('');
  const [filterOperation, setFilterOperation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    slaCode: '',
    location: '',
    locationType: 'Hub' as 'Hub' | 'Spoke',
    operationType: 'Loading',
    standardTime: '',
    gracePeriod: 15,
    penaltyPercent: 8,
    applicableDays: 'All Days',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const filteredSLAs = slas.filter(sla => {
    const matchesSearch = 
      sla.slaCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sla.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterLocationType || sla.locationType === filterLocationType;
    const matchesOperation = !filterOperation || sla.operationType === filterOperation;
    const matchesStatus = !filterStatus || sla.status === filterStatus;

    return matchesSearch && matchesType && matchesOperation && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      slaCode: '',
      location: '',
      locationType: 'Hub',
      operationType: 'Loading',
      standardTime: '',
      gracePeriod: 15,
      penaltyPercent: 8,
      applicableDays: 'All Days',
      status: 'Active',
    });
    setEditingSLA(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (sla: HandlingSLA) => {
    setEditingSLA(sla);
    setFormData({
      slaCode: sla.slaCode,
      location: sla.location,
      locationType: sla.locationType,
      operationType: sla.operationType,
      standardTime: sla.standardTime,
      gracePeriod: sla.gracePeriod,
      penaltyPercent: sla.penaltyPercent,
      applicableDays: sla.applicableDays,
      status: sla.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.slaCode || !formData.location || !formData.standardTime) {
      alert('SLA Code, Location and Standard Time are required');
      return;
    }

    const newSLA: HandlingSLA = {
      id: editingSLA ? editingSLA.id : Date.now().toString(),
      slaCode: formData.slaCode.toUpperCase(),
      location: formData.location,
      locationType: formData.locationType,
      operationType: formData.operationType,
      standardTime: formData.standardTime,
      gracePeriod: formData.gracePeriod,
      penaltyPercent: formData.penaltyPercent,
      applicableDays: formData.applicableDays,
      status: formData.status,
    };

    if (editingSLA) {
      setSlas(slas.map(s => s.id === editingSLA.id ? newSLA : s));
    } else {
      setSlas([...slas, newSLA]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Handling SLA</h1>
          <p className="text-gray-600 mt-1">Manage Service Level Agreements for loading, unloading and handling operations</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Handling SLA
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
              placeholder="SLA code or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location Type</label>
          <select value={filterLocationType} onChange={(e) => setFilterLocationType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Types</option>
            <option value="Hub">Hub</option>
            <option value="Spoke">Spoke</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Operation Type</label>
          <select value={filterOperation} onChange={(e) => setFilterOperation(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Operations</option>
            <option value="Loading">Loading</option>
            <option value="Unloading">Unloading</option>
            <option value="Cross-Docking">Cross-Docking</option>
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
                <th className="px-6 py-4 text-left">SLA Code</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Operation</th>
                <th className="px-6 py-4 text-left">Standard Time</th>
                <th className="px-6 py-4 text-left">Grace Period</th>
                <th className="px-6 py-4 text-left">Penalty (%)</th>
                <th className="px-6 py-4 text-left">Applicable Days</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSLAs.map((sla) => (
                <tr key={sla.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{sla.slaCode}</td>
                  <td className="px-6 py-5 font-medium">{sla.location}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sla.locationType === 'Hub' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {sla.locationType}
                    </span>
                  </td>
                  <td className="px-6 py-5">{sla.operationType}</td>
                  <td className="px-6 py-5 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {sla.standardTime}
                  </td>
                  <td className="px-6 py-5">{sla.gracePeriod} mins</td>
                  <td className="px-6 py-5 text-red-600 font-medium">{sla.penaltyPercent}%</td>
                  <td className="px-6 py-5 text-sm">{sla.applicableDays}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${sla.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {sla.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(sla)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setSlas(slas.filter(s => s.id !== sla.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
              <Package className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">
                {editingSLA ? 'Edit Handling SLA' : 'Create Handling SLA'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">SLA Code <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.slaCode} onChange={(e) => setFormData({ ...formData, slaCode: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="SLA-HN-005" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location <span className="text-red-500">*</span></label>
                  <select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Location</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location Type</label>
                  <select value={formData.locationType} onChange={(e) => setFormData({ ...formData, locationType: e.target.value as 'Hub' | 'Spoke' })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Hub">Hub</option>
                    <option value="Spoke">Spoke</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Operation Type <span className="text-red-500">*</span></label>
                  <select value={formData.operationType} onChange={(e) => setFormData({ ...formData, operationType: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Loading">Loading</option>
                    <option value="Unloading">Unloading</option>
                    <option value="Cross-Docking">Cross-Docking</option>
                    <option value="Sorting">Sorting</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Standard Time <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.standardTime} onChange={(e) => setFormData({ ...formData, standardTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="45 mins" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Grace Period (mins)</label>
                  <input type="number" value={formData.gracePeriod} onChange={(e) => setFormData({ ...formData, gracePeriod: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Penalty on Delay (%)</label>
                  <input type="number" value={formData.penaltyPercent} onChange={(e) => setFormData({ ...formData, penaltyPercent: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Applicable Days</label>
                  <select value={formData.applicableDays} onChange={(e) => setFormData({ ...formData, applicableDays: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="All Days">All Days</option>
                    <option value="Mon-Sat">Mon-Sat</option>
                    <option value="Mon-Fri">Mon-Fri</option>
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
                {editingSLA ? 'Update SLA' : 'Create SLA'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}