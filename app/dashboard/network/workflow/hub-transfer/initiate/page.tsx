'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ArrowRightLeft, Clock } from 'lucide-react';

interface Transfer {
  id: string;
  transferId: string;
  fromLocation: string;
  toLocation: string;
  transferType: 'Hub to Hub' | 'Hub to Spoke' | 'Spoke to Hub';
  itemsCount: number;
  requestedBy: string;
  requestDate: string;
  estimatedArrival: string;
  status: 'Pending' | 'Approved' | 'In Transit' | 'Completed' | 'Cancelled';
}

const initialTransfers: Transfer[] = [
  {
    id: '1',
    transferId: 'TRF-PAT-MDH-240501',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Madhubani Spoke',
    transferType: 'Hub to Spoke',
    itemsCount: 125,
    requestedBy: 'Ramesh Kumar',
    requestDate: 'May 28, 2026',
    estimatedArrival: 'May 29, 2026',
    status: 'In Transit',
  },
  {
    id: '2',
    transferId: 'TRF-RAN-PAT-240501',
    fromLocation: 'Ranchi Regional Hub',
    toLocation: 'Patna Mother Hub',
    transferType: 'Hub to Hub',
    itemsCount: 85,
    requestedBy: 'Deepak Sharma',
    requestDate: 'May 28, 2026',
    estimatedArrival: 'May 30, 2026',
    status: 'Approved',
  },
  {
    id: '3',
    transferId: 'TRF-PAT-GYA-240501',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Gaya Spoke',
    transferType: 'Hub to Spoke',
    itemsCount: 67,
    requestedBy: 'Sunil Verma',
    requestDate: 'May 29, 2026',
    estimatedArrival: 'May 30, 2026',
    status: 'Pending',
  },
  {
    id: '4',
    transferId: 'TRF-DHN-RAN-240501',
    fromLocation: 'Dhanbad Spoke',
    toLocation: 'Ranchi Regional Hub',
    transferType: 'Spoke to Hub',
    itemsCount: 45,
    requestedBy: 'Suresh Mondal',
    requestDate: 'May 27, 2026',
    estimatedArrival: 'May 29, 2026',
    status: 'Completed',
  },
];

const locations = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub', 'Madhubani Spoke', 'Darbhanga Spoke', 'Gaya Spoke'];

export default function InitiateTransferPage() {
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    transferId: '',
    fromLocation: '',
    toLocation: '',
    transferType: 'Hub to Spoke' as 'Hub to Hub' | 'Hub to Spoke' | 'Spoke to Hub',
    itemsCount: 0,
    requestedBy: '',
    requestDate: '',
    estimatedArrival: '',
    status: 'Pending' as 'Pending' | 'Approved' | 'In Transit' | 'Completed' | 'Cancelled',
  });

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = 
      transfer.transferId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFrom = !filterFrom || transfer.fromLocation === filterFrom;
    const matchesType = !filterType || transfer.transferType === filterType;
    const matchesStatus = !filterStatus || transfer.status === filterStatus;

    return matchesSearch && matchesFrom && matchesType && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      transferId: '',
      fromLocation: '',
      toLocation: '',
      transferType: 'Hub to Spoke',
      itemsCount: 0,
      requestedBy: '',
      requestDate: '',
      estimatedArrival: '',
      status: 'Pending',
    });
    setEditingTransfer(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (transfer: Transfer) => {
    setEditingTransfer(transfer);
    setFormData({
      transferId: transfer.transferId,
      fromLocation: transfer.fromLocation,
      toLocation: transfer.toLocation,
      transferType: transfer.transferType,
      itemsCount: transfer.itemsCount,
      requestedBy: transfer.requestedBy,
      requestDate: transfer.requestDate,
      estimatedArrival: transfer.estimatedArrival,
      status: transfer.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.transferId || !formData.fromLocation || !formData.toLocation) {
      alert('Transfer ID, From Location and To Location are required');
      return;
    }

    const newTransfer: Transfer = {
      id: editingTransfer ? editingTransfer.id : Date.now().toString(),
      transferId: formData.transferId.toUpperCase(),
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      transferType: formData.transferType,
      itemsCount: formData.itemsCount,
      requestedBy: formData.requestedBy || 'Current User',
      requestDate: formData.requestDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedArrival: formData.estimatedArrival,
      status: formData.status,
    };

    if (editingTransfer) {
      setTransfers(transfers.map(t => t.id === editingTransfer.id ? newTransfer : t));
    } else {
      setTransfers([...transfers, newTransfer]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Initiate Transfer</h1>
          <p className="text-gray-600 mt-1">Manage inventory and shipment transfers between locations</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Initiate New Transfer
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
              placeholder="Transfer ID or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">From Location</label>
          <select value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Transfer Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Types</option>
            <option value="Hub to Hub">Hub to Hub</option>
            <option value="Hub to Spoke">Hub to Spoke</option>
            <option value="Spoke to Hub">Spoke to Hub</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Transit">In Transit</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Transfer ID</th>
                <th className="px-6 py-4 text-left">From</th>
                <th className="px-6 py-4 text-left">To</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Items</th>
                <th className="px-6 py-4 text-left">Requested By</th>
                <th className="px-6 py-4 text-left">Request Date</th>
                <th className="px-6 py-4 text-left">Est. Arrival</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{transfer.transferId}</td>
                  <td className="px-6 py-5">{transfer.fromLocation}</td>
                  <td className="px-6 py-5 font-medium flex items-center gap-2">
                    {transfer.toLocation}
                    <ArrowRightLeft size={16} className="text-gray-400" />
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {transfer.transferType}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium">{transfer.itemsCount}</td>
                  <td className="px-6 py-5">{transfer.requestedBy}</td>
                  <td className="px-6 py-5 text-sm">{transfer.requestDate}</td>
                  <td className="px-6 py-5 text-sm">{transfer.estimatedArrival}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${transfer.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${transfer.status === 'Approved' ? 'bg-blue-100 text-blue-700' : ''}
                      ${transfer.status === 'In Transit' ? 'bg-amber-100 text-amber-700' : ''}
                      ${transfer.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${transfer.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(transfer)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setTransfers(transfers.filter(t => t.id !== transfer.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
              <ArrowRightLeft className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">
                {editingTransfer ? 'Edit Transfer' : 'Initiate New Transfer'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Transfer ID <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.transferId} onChange={(e) => setFormData({ ...formData, transferId: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="TRF-PAT-MDH-240506" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">From Location <span className="text-red-500">*</span></label>
                  <select value={formData.fromLocation} onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select From Location</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">To Location <span className="text-red-500">*</span></label>
                  <select value={formData.toLocation} onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select To Location</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Transfer Type</label>
                  <select value={formData.transferType} onChange={(e) => setFormData({ ...formData, transferType: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Hub to Hub">Hub to Hub</option>
                    <option value="Hub to Spoke">Hub to Spoke</option>
                    <option value="Spoke to Hub">Spoke to Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Items</label>
                  <input type="number" value={formData.itemsCount} onChange={(e) => setFormData({ ...formData, itemsCount: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Requested By</label>
                  <input type="text" value={formData.requestedBy} onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Your Name" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Arrival Date</label>
                  <input type="text" value={formData.estimatedArrival} onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="May 31, 2026" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingTransfer ? 'Update Transfer' : 'Initiate Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}