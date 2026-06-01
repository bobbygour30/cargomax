'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ArrowRightLeft, Clock } from 'lucide-react';

interface CrossDockEntry {
  id: string;
  entryId: string;
  hubName: string;
  vehicleNumber: string;
  incomingFrom: string;
  outgoingTo: string;
  shipmentsCount: number;
  receivedTime: string;
  processedTime: string;
  status: 'Received' | 'Processing' | 'Dispatched' | 'Completed';
}

const initialCrossDock: CrossDockEntry[] = [
  {
    id: '1',
    entryId: 'CD-PAT-240501',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01AB7890',
    incomingFrom: 'Dadri Mother Hub',
    outgoingTo: 'Madhubani Spoke',
    shipmentsCount: 42,
    receivedTime: '08:45 AM',
    processedTime: '09:30 AM',
    status: 'Completed',
  },
  {
    id: '2',
    entryId: 'CD-PAT-240502',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'UP65CD2345',
    incomingFrom: 'Ranchi Regional Hub',
    outgoingTo: 'Gaya Spoke',
    shipmentsCount: 28,
    receivedTime: '10:15 AM',
    processedTime: '11:05 AM',
    status: 'Processing',
  },
  {
    id: '3',
    entryId: 'CD-RAN-240501',
    hubName: 'Ranchi Regional Hub',
    vehicleNumber: 'JH05XY6789',
    incomingFrom: 'Dankuni Hub',
    outgoingTo: 'Dhanbad Spoke',
    shipmentsCount: 35,
    receivedTime: '01:20 PM',
    processedTime: '',
    status: 'Received',
  },
  {
    id: '4',
    entryId: 'CD-PAT-240503',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01EF1122',
    incomingFrom: 'Local Vendor',
    outgoingTo: 'Samastipur Spoke',
    shipmentsCount: 19,
    receivedTime: '02:10 PM',
    processedTime: '02:45 PM',
    status: 'Dispatched',
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];

export default function CrossDockEntryPage() {
  const [entries, setEntries] = useState<CrossDockEntry[]>(initialCrossDock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CrossDockEntry | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    entryId: '',
    hubName: '',
    vehicleNumber: '',
    incomingFrom: '',
    outgoingTo: '',
    shipmentsCount: 0,
    receivedTime: '',
    processedTime: '',
    status: 'Received' as 'Received' | 'Processing' | 'Dispatched' | 'Completed',
  });

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.entryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.incomingFrom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !filterHub || entry.hubName === filterHub;
    const matchesStatus = !filterStatus || entry.status === filterStatus;

    return matchesSearch && matchesHub && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      entryId: '',
      hubName: '',
      vehicleNumber: '',
      incomingFrom: '',
      outgoingTo: '',
      shipmentsCount: 0,
      receivedTime: '',
      processedTime: '',
      status: 'Received',
    });
    setEditingEntry(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (entry: CrossDockEntry) => {
    setEditingEntry(entry);
    setFormData({
      entryId: entry.entryId,
      hubName: entry.hubName,
      vehicleNumber: entry.vehicleNumber,
      incomingFrom: entry.incomingFrom,
      outgoingTo: entry.outgoingTo,
      shipmentsCount: entry.shipmentsCount,
      receivedTime: entry.receivedTime,
      processedTime: entry.processedTime,
      status: entry.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.entryId || !formData.hubName || !formData.vehicleNumber) {
      alert('Entry ID, Hub Name and Vehicle Number are required');
      return;
    }

    const newEntry: CrossDockEntry = {
      id: editingEntry ? editingEntry.id : Date.now().toString(),
      entryId: formData.entryId.toUpperCase(),
      hubName: formData.hubName,
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      incomingFrom: formData.incomingFrom,
      outgoingTo: formData.outgoingTo,
      shipmentsCount: formData.shipmentsCount,
      receivedTime: formData.receivedTime,
      processedTime: formData.processedTime,
      status: formData.status,
    };

    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? newEntry : e));
    } else {
      setEntries([...entries, newEntry]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cross Dock Entry</h1>
          <p className="text-gray-600 mt-1">Manage cross-docking operations and vehicle entries</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          New Cross Dock Entry
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
              placeholder="Entry ID, Vehicle or Destination..."
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
            {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Received">Received</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Entry ID</th>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Vehicle Number</th>
                <th className="px-6 py-4 text-left">Incoming From</th>
                <th className="px-6 py-4 text-left">Outgoing To</th>
                <th className="px-6 py-4 text-left">Shipments</th>
                <th className="px-6 py-4 text-left">Received Time</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{entry.entryId}</td>
                  <td className="px-6 py-5">{entry.hubName}</td>
                  <td className="px-6 py-5 font-mono">{entry.vehicleNumber}</td>
                  <td className="px-6 py-5">{entry.incomingFrom}</td>
                  <td className="px-6 py-5 flex items-center gap-2">
                    {entry.outgoingTo}
                    <ArrowRightLeft size={16} className="text-gray-400" />
                  </td>
                  <td className="px-6 py-5 font-medium">{entry.shipmentsCount}</td>
                  <td className="px-6 py-5">{entry.receivedTime}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${entry.status === 'Received' ? 'bg-blue-100 text-blue-700' : ''}
                      ${entry.status === 'Processing' ? 'bg-amber-100 text-amber-700' : ''}
                      ${entry.status === 'Dispatched' ? 'bg-purple-100 text-purple-700' : ''}
                      ${entry.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(entry)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
                {editingEntry ? 'Edit Cross Dock Entry' : 'New Cross Dock Entry'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Entry ID <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.entryId} onChange={(e) => setFormData({ ...formData, entryId: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="CD-PAT-240505" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
                  <select value={formData.hubName} onChange={(e) => setFormData({ ...formData, hubName: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Hub</option>
                    {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Number <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.vehicleNumber} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="BR01AB1234" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Incoming From</label>
                  <input type="text" value={formData.incomingFrom} onChange={(e) => setFormData({ ...formData, incomingFrom: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Dadri Mother Hub" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Outgoing To</label>
                  <input type="text" value={formData.outgoingTo} onChange={(e) => setFormData({ ...formData, outgoingTo: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Madhubani Spoke" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shipments Count</label>
                  <input type="number" value={formData.shipmentsCount} onChange={(e) => setFormData({ ...formData, shipmentsCount: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Received Time</label>
                  <input type="text" value={formData.receivedTime} onChange={(e) => setFormData({ ...formData, receivedTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="10:15 AM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Processed Time</label>
                  <input type="text" value={formData.processedTime} onChange={(e) => setFormData({ ...formData, processedTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="11:00 AM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Received">Received</option>
                    <option value="Processing">Processing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingEntry ? 'Update Entry' : 'Create Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}