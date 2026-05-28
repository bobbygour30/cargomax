'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Clock, AlertCircle } from 'lucide-react';

interface TransitSLA {
  id: string;
  slaCode: string;
  originHub: string;
  destination: string;
  destinationType: 'Hub' | 'Spoke';
  standardTime: string;
  gracePeriod: number;
  penaltyPercent: number;
  applicableDays: string;
  status: 'Active' | 'Inactive';
}

const initialSLAs: TransitSLA[] = [
  {
    id: '1',
    slaCode: 'SLA-TR-001',
    originHub: 'Patna Mother Hub',
    destination: 'Madhubani Spoke',
    destinationType: 'Spoke',
    standardTime: '4 hrs 30 mins',
    gracePeriod: 1,
    penaltyPercent: 5,
    applicableDays: 'All Days',
    status: 'Active',
  },
  {
    id: '2',
    slaCode: 'SLA-TR-002',
    originHub: 'Patna Mother Hub',
    destination: 'Darbhanga Spoke',
    destinationType: 'Spoke',
    standardTime: '3 hrs 45 mins',
    gracePeriod: 1,
    penaltyPercent: 5,
    applicableDays: 'Mon-Sat',
    status: 'Active',
  },
  {
    id: '3',
    slaCode: 'SLA-TR-003',
    originHub: 'Patna Mother Hub',
    destination: 'Ranchi Regional Hub',
    destinationType: 'Hub',
    standardTime: '9 hrs 00 mins',
    gracePeriod: 2,
    penaltyPercent: 8,
    applicableDays: 'All Days',
    status: 'Active',
  },
  {
    id: '4',
    slaCode: 'SLA-TR-004',
    originHub: 'Ranchi Regional Hub',
    destination: 'Dhanbad Spoke',
    destinationType: 'Spoke',
    standardTime: '4 hrs 15 mins',
    gracePeriod: 1,
    penaltyPercent: 6,
    applicableDays: 'All Days',
    status: 'Active',
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];

export default function TransitSLAPage() {
  const [slas, setSlas] = useState<TransitSLA[]>(initialSLAs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSLA, setEditingSLA] = useState<TransitSLA | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    slaCode: '',
    originHub: '',
    destination: '',
    destinationType: 'Spoke' as 'Hub' | 'Spoke',
    standardTime: '',
    gracePeriod: 1,
    penaltyPercent: 5,
    applicableDays: 'All Days',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const filteredSLAs = slas.filter(sla => {
    const matchesSearch = 
      sla.slaCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sla.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrigin = !filterOrigin || sla.originHub === filterOrigin;
    const matchesType = !filterType || sla.destinationType === filterType;
    const matchesStatus = !filterStatus || sla.status === filterStatus;

    return matchesSearch && matchesOrigin && matchesType && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      slaCode: '',
      originHub: '',
      destination: '',
      destinationType: 'Spoke',
      standardTime: '',
      gracePeriod: 1,
      penaltyPercent: 5,
      applicableDays: 'All Days',
      status: 'Active',
    });
    setEditingSLA(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (sla: TransitSLA) => {
    setEditingSLA(sla);
    setFormData({
      slaCode: sla.slaCode,
      originHub: sla.originHub,
      destination: sla.destination,
      destinationType: sla.destinationType,
      standardTime: sla.standardTime,
      gracePeriod: sla.gracePeriod,
      penaltyPercent: sla.penaltyPercent,
      applicableDays: sla.applicableDays,
      status: sla.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.slaCode || !formData.originHub || !formData.destination || !formData.standardTime) {
      alert('SLA Code, Origin Hub, Destination and Standard Time are required');
      return;
    }

    const newSLA: TransitSLA = {
      id: editingSLA ? editingSLA.id : Date.now().toString(),
      slaCode: formData.slaCode.toUpperCase(),
      originHub: formData.originHub,
      destination: formData.destination,
      destinationType: formData.destinationType,
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
          <h1 className="text-3xl font-bold text-gray-900">Transit SLA</h1>
          <p className="text-gray-600 mt-1">Manage Service Level Agreements for transit time between hubs and spokes</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Transit SLA
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
              placeholder="SLA code or destination..."
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
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Types</option>
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
                <th className="px-6 py-4 text-left">SLA Code</th>
                <th className="px-6 py-4 text-left">Origin Hub</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Type</th>
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
                  <td className="px-6 py-5">{sla.originHub}</td>
                  <td className="px-6 py-5 font-medium">{sla.destination}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sla.destinationType === 'Hub' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {sla.destinationType}
                    </span>
                  </td>
                  <td className="px-6 py-5 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {sla.standardTime}
                  </td>
                  <td className="px-6 py-5">{sla.gracePeriod} hr</td>
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
              <Clock className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">
                {editingSLA ? 'Edit Transit SLA' : 'Create Transit SLA'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">SLA Code <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.slaCode} onChange={(e) => setFormData({ ...formData, slaCode: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="SLA-TR-005" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Origin Hub <span className="text-red-500">*</span></label>
                  <select value={formData.originHub} onChange={(e) => setFormData({ ...formData, originHub: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Origin Hub</option>
                    {hubs.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Madhubani Spoke" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination Type</label>
                  <select value={formData.destinationType} onChange={(e) => setFormData({ ...formData, destinationType: e.target.value as 'Hub' | 'Spoke' })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Spoke">Spoke</option>
                    <option value="Hub">Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Standard Transit Time <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.standardTime} onChange={(e) => setFormData({ ...formData, standardTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="4 hrs 30 mins" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Grace Period (hours)</label>
                  <input type="number" value={formData.gracePeriod} onChange={(e) => setFormData({ ...formData, gracePeriod: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Penalty on Violation (%)</label>
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