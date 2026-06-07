'use client';

import React, { useState } from 'react';
import { Plus, Edit2, CheckCircle, Search, ArrowRightLeft } from 'lucide-react';

interface ReceiveTransfer {
  id: string;
  transferId: string;
  fromLocation: string;
  toLocation: string;
  transferType: string;
  itemsCount: number;
  expectedDate: string;
  receivedBy: string;
  receivedDate: string;
  status: 'Pending' | 'In Transit' | 'Arrived' | 'Receiving' | 'Received' | 'Rejected';
  remarks?: string;
}

const initialReceiveTransfers: ReceiveTransfer[] = [
  {
    id: '1',
    transferId: 'TRF-PAT-MDH-240501',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Madhubani Spoke',
    transferType: 'Hub to Spoke',
    itemsCount: 125,
    expectedDate: 'May 30, 2026',
    receivedBy: 'Vijay Jha',
    receivedDate: 'May 30, 2026',
    status: 'Received',
    remarks: 'All items verified',
  },
  {
    id: '2',
    transferId: 'TRF-RAN-PAT-240502',
    fromLocation: 'Ranchi Regional Hub',
    toLocation: 'Patna Mother Hub',
    transferType: 'Hub to Hub',
    itemsCount: 78,
    expectedDate: 'May 31, 2026',
    receivedBy: '',
    receivedDate: '',
    status: 'Arrived',
    remarks: '',
  },
  {
    id: '3',
    transferId: 'TRF-PAT-GYA-240503',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Gaya Spoke',
    transferType: 'Hub to Spoke',
    itemsCount: 92,
    expectedDate: 'May 31, 2026',
    receivedBy: '',
    receivedDate: '',
    status: 'In Transit',
    remarks: '',
  },
  {
    id: '4',
    transferId: 'TRF-DHN-RAN-240501',
    fromLocation: 'Dhanbad Spoke',
    toLocation: 'Ranchi Regional Hub',
    transferType: 'Spoke to Hub',
    itemsCount: 45,
    expectedDate: 'May 29, 2026',
    receivedBy: 'Deepak Gupta',
    receivedDate: 'May 29, 2026',
    status: 'Received',
    remarks: 'Minor damage in 2 packages',
  },
];

export default function ReceiveTransferPage() {
  const [transfers, setTransfers] = useState<ReceiveTransfer[]>(initialReceiveTransfers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<ReceiveTransfer | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const [formData, setFormData] = useState({
    transferId: '',
    fromLocation: '',
    toLocation: '',
    transferType: 'Hub to Spoke',
    itemsCount: 0,
    expectedDate: '',
    receivedBy: '',
    receivedDate: '',
    status: 'Received' as 'Pending' | 'In Transit' | 'Arrived' | 'Receiving' | 'Received' | 'Rejected',
    remarks: '',
  });

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = 
      transfer.transferId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || transfer.status === filterStatus;
    const matchesType = !filterType || transfer.transferType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const resetForm = () => {
    setFormData({
      transferId: '',
      fromLocation: '',
      toLocation: '',
      transferType: 'Hub to Spoke',
      itemsCount: 0,
      expectedDate: '',
      receivedBy: '',
      receivedDate: '',
      status: 'Received',
      remarks: '',
    });
    setEditingTransfer(null);
  };

  const openReceiveModal = (transfer: ReceiveTransfer) => {
    setEditingTransfer(transfer);
    setFormData({
      transferId: transfer.transferId,
      fromLocation: transfer.fromLocation,
      toLocation: transfer.toLocation,
      transferType: transfer.transferType as any,
      itemsCount: transfer.itemsCount,
      expectedDate: transfer.expectedDate,
      receivedBy: transfer.receivedBy || '',
      receivedDate: transfer.receivedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Received',
      remarks: transfer.remarks || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.transferId || !formData.receivedBy) {
      alert('Transfer ID and Received By are required');
      return;
    }

    const updatedTransfer = {
      ...editingTransfer!,
      receivedBy: formData.receivedBy,
      receivedDate: formData.receivedDate,
      status: formData.status,
      remarks: formData.remarks,
    };

    setTransfers(transfers.map(t => t.id === editingTransfer?.id ? updatedTransfer : t));

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receive Transfer</h1>
          <p className="text-gray-600 mt-1">Manage and acknowledge incoming transfers at your location</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Transfer ID or From Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
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
            <option value="In Transit">In Transit</option>
            <option value="Arrived">Arrived</option>
            <option value="Received">Received</option>
            <option value="Rejected">Rejected</option>
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
                <th className="px-6 py-4 text-left">From Location</th>
                <th className="px-6 py-4 text-left">To Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Items</th>
                <th className="px-6 py-4 text-left">Expected Date</th>
                <th className="px-6 py-4 text-left">Received By</th>
                <th className="px-6 py-4 text-left">Received Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{transfer.transferId}</td>
                  <td className="px-6 py-5">{transfer.fromLocation}</td>
                  <td className="px-6 py-5 font-medium">{transfer.toLocation}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {transfer.transferType}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium">{transfer.itemsCount}</td>
                  <td className="px-6 py-5">{transfer.expectedDate}</td>
                  <td className="px-6 py-5">{transfer.receivedBy || '-'}</td>
                  <td className="px-6 py-5">{transfer.receivedDate || '-'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${transfer.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${transfer.status === 'Arrived' ? 'bg-blue-100 text-blue-700' : ''}
                      ${transfer.status === 'In Transit' ? 'bg-amber-100 text-amber-700' : ''}
                      ${transfer.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${transfer.status === 'Rejected' ? 'bg-red-100 text-red-700' : ''}`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {(transfer.status === 'Arrived' || transfer.status === 'In Transit') && (
                      <button 
                        onClick={() => openReceiveModal(transfer)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                      >
                        <CheckCircle size={16} />
                        Receive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b flex items-center gap-3">
              <ArrowRightLeft className="text-green-600" size={28} />
              <h2 className="text-2xl font-semibold">Receive Transfer</h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="font-medium">Transfer ID: <span className="font-mono">{formData.transferId}</span></p>
                <p className="mt-2">From: <strong>{formData.fromLocation}</strong> → To: <strong>{formData.toLocation}</strong></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Received By <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.receivedBy} onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Your Name" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Received Date</label>
                  <input type="text" value={formData.receivedDate} onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Remarks / Condition</label>
                  <textarea value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} rows={4} className="w-full border rounded-xl px-4 py-3" placeholder="All items received in good condition..." />
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-medium flex items-center gap-2">
                <CheckCircle size={20} />
                Confirm Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}