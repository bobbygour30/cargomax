'use client';

import React, { useState } from 'react';
import { Search, Eye, Calendar, ArrowRightLeft } from 'lucide-react';

interface TransferHistory {
  id: string;
  transferId: string;
  fromLocation: string;
  toLocation: string;
  transferType: string;
  itemsCount: number;
  requestedBy: string;
  requestDate: string;
  completedDate: string;
  status: 'Completed' | 'Cancelled' | 'Rejected';
  remarks?: string;
}

const initialHistory: TransferHistory[] = [
  {
    id: '1',
    transferId: 'TRF-PAT-MDH-240501',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Madhubani Spoke',
    transferType: 'Hub to Spoke',
    itemsCount: 125,
    requestedBy: 'Ramesh Kumar',
    requestDate: 'May 28, 2026',
    completedDate: 'May 30, 2026',
    status: 'Completed',
    remarks: 'All items received in good condition',
  },
  {
    id: '2',
    transferId: 'TRF-RAN-PAT-240502',
    fromLocation: 'Ranchi Regional Hub',
    toLocation: 'Patna Mother Hub',
    transferType: 'Hub to Hub',
    itemsCount: 78,
    requestedBy: 'Deepak Sharma',
    requestDate: 'May 27, 2026',
    completedDate: 'May 29, 2026',
    status: 'Completed',
    remarks: '',
  },
  {
    id: '3',
    transferId: 'TRF-PAT-GYA-240503',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Gaya Spoke',
    transferType: 'Hub to Spoke',
    itemsCount: 92,
    requestedBy: 'Sunil Verma',
    requestDate: 'May 26, 2026',
    completedDate: 'May 28, 2026',
    status: 'Completed',
    remarks: '2 packages damaged',
  },
  {
    id: '4',
    transferId: 'TRF-DHN-RAN-240501',
    fromLocation: 'Dhanbad Spoke',
    toLocation: 'Ranchi Regional Hub',
    transferType: 'Spoke to Hub',
    itemsCount: 45,
    requestedBy: 'Suresh Mondal',
    requestDate: 'May 25, 2026',
    completedDate: 'May 27, 2026',
    status: 'Completed',
    remarks: '',
  },
  {
    id: '5',
    transferId: 'TRF-PAT-DAD-240501',
    fromLocation: 'Patna Mother Hub',
    toLocation: 'Dadri Mother Hub',
    transferType: 'Hub to Hub',
    itemsCount: 210,
    requestedBy: 'Ramesh Kumar',
    requestDate: 'May 20, 2026',
    completedDate: 'May 22, 2026',
    status: 'Cancelled',
    remarks: 'Vehicle breakdown',
  },
];

export default function TransferHistoryPage() {
  const [history, setHistory] = useState<TransferHistory[]>(initialHistory);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferHistory | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.transferId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.toLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || item.transferType === filterType;
    const matchesStatus = !filterStatus || item.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const openDetailModal = (transfer: TransferHistory) => {
    setSelectedTransfer(transfer);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfer History</h1>
          <p className="text-gray-600 mt-1">Complete history of all transfers across the network</p>
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
              placeholder="Transfer ID or Location..."
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
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Transfer ID</th>
                <th className="px-6 py-4 text-left">From Location</th>
                <th className="px-6 py-4 text-left">To Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Items</th>
                <th className="px-6 py-4 text-left">Requested By</th>
                <th className="px-6 py-4 text-left">Request Date</th>
                <th className="px-6 py-4 text-left">Completed Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHistory.map((transfer) => (
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
                  <td className="px-6 py-5">{transfer.requestedBy}</td>
                  <td className="px-6 py-5 text-sm">{transfer.requestDate}</td>
                  <td className="px-6 py-5 text-sm">{transfer.completedDate}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${transfer.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${transfer.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                      ${transfer.status === 'Rejected' ? 'bg-orange-100 text-orange-700' : ''}`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => openDetailModal(transfer)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium"
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Detail Modal */}
      {isDetailModalOpen && selectedTransfer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">Transfer Details</h2>
              <p className="text-gray-500 mt-1">{selectedTransfer.transferId}</p>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium mt-1">{selectedTransfer.fromLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium mt-1">{selectedTransfer.toLocation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Transfer Type</p>
                  <p className="font-medium mt-1">{selectedTransfer.transferType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Items Count</p>
                  <p className="font-medium mt-1">{selectedTransfer.itemsCount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Requested By</p>
                  <p className="font-medium mt-1">{selectedTransfer.requestedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Date</p>
                  <p className="font-medium mt-1">{selectedTransfer.requestDate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Completed Date</p>
                <p className="font-medium mt-1">{selectedTransfer.completedDate}</p>
              </div>

              {selectedTransfer.remarks && (
                <div>
                  <p className="text-sm text-gray-500">Remarks</p>
                  <p className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedTransfer.remarks}</p>
                </div>
              )}
            </div>

            <div className="border-t p-6 flex justify-end">
              <button 
                onClick={() => setIsDetailModalOpen(false)} 
                className="px-8 py-3 border rounded-2xl hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}