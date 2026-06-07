'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Truck, Clock, CheckCircle } from 'lucide-react';

interface Inbound {
  id: string;
  inboundId: string;
  hubName: string;
  vehicleNumber: string;
  driverName: string;
  arrivalTime: string;
  expectedTime: string;
  shipmentsCount: number;
  status: 'On Time' | 'Delayed' | 'Arrived' | 'In Progress';
}

const initialInbounds: Inbound[] = [
  {
    id: '1',
    inboundId: 'INB-240501',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01AB1234',
    driverName: 'Rajesh Kumar',
    arrivalTime: '10:15 AM',
    expectedTime: '10:00 AM',
    shipmentsCount: 24,
    status: 'Arrived',
  },
  {
    id: '2',
    inboundId: 'INB-240502',
    hubName: 'Dadri Mother Hub',
    vehicleNumber: 'DL7CN4567',
    driverName: 'Suresh Yadav',
    arrivalTime: '11:45 AM',
    expectedTime: '11:30 AM',
    shipmentsCount: 18,
    status: 'On Time',
  },
  {
    id: '3',
    inboundId: 'INB-240503',
    hubName: 'Ranchi Regional Hub',
    vehicleNumber: 'JH05DE8901',
    driverName: 'Manoj Singh',
    arrivalTime: '02:20 PM',
    expectedTime: '01:45 PM',
    shipmentsCount: 31,
    status: 'Delayed',
  },
  {
    id: '4',
    inboundId: 'INB-240504',
    hubName: 'Patna Mother Hub',
    vehicleNumber: 'BR01XY2345',
    driverName: 'Vikash Pandey',
    arrivalTime: '09:50 AM',
    expectedTime: '10:00 AM',
    shipmentsCount: 15,
    status: 'In Progress',
  },
];

const hubs = ['Patna Mother Hub', 'Dadri Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub'];

export default function InboundAtHubPage() {
  const [inbounds, setInbounds] = useState<Inbound[]>(initialInbounds);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInbound, setEditingInbound] = useState<Inbound | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    inboundId: '',
    hubName: '',
    vehicleNumber: '',
    driverName: '',
    arrivalTime: '',
    expectedTime: '',
    shipmentsCount: 0,
    status: 'On Time' as 'On Time' | 'Delayed' | 'Arrived' | 'In Progress',
  });

  const filteredInbounds = inbounds.filter(inb => {
    const matchesSearch = 
      inb.inboundId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inb.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inb.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !filterHub || inb.hubName === filterHub;
    const matchesStatus = !filterStatus || inb.status === filterStatus;

    return matchesSearch && matchesHub && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      inboundId: '',
      hubName: '',
      vehicleNumber: '',
      driverName: '',
      arrivalTime: '',
      expectedTime: '',
      shipmentsCount: 0,
      status: 'On Time',
    });
    setEditingInbound(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (inb: Inbound) => {
    setEditingInbound(inb);
    setFormData({
      inboundId: inb.inboundId,
      hubName: inb.hubName,
      vehicleNumber: inb.vehicleNumber,
      driverName: inb.driverName,
      arrivalTime: inb.arrivalTime,
      expectedTime: inb.expectedTime,
      shipmentsCount: inb.shipmentsCount,
      status: inb.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.inboundId || !formData.hubName || !formData.vehicleNumber) {
      alert('Inbound ID, Hub Name and Vehicle Number are required');
      return;
    }

    const newInbound: Inbound = {
      id: editingInbound ? editingInbound.id : Date.now().toString(),
      inboundId: formData.inboundId.toUpperCase(),
      hubName: formData.hubName,
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      driverName: formData.driverName,
      arrivalTime: formData.arrivalTime,
      expectedTime: formData.expectedTime,
      shipmentsCount: formData.shipmentsCount,
      status: formData.status,
    };

    if (editingInbound) {
      setInbounds(inbounds.map(i => i.id === editingInbound.id ? newInbound : i));
    } else {
      setInbounds([...inbounds, newInbound]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inbound at Hub</h1>
          <p className="text-gray-600 mt-1">Manage incoming vehicles and shipments at all hubs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Inbound
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
              placeholder="Inbound ID, Vehicle or Driver..."
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
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Arrived">Arrived</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Inbound ID</th>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Vehicle Number</th>
                <th className="px-6 py-4 text-left">Driver Name</th>
                <th className="px-6 py-4 text-left">Expected Time</th>
                <th className="px-6 py-4 text-left">Arrival Time</th>
                <th className="px-6 py-4 text-left">Shipments</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInbounds.map((inb) => (
                <tr key={inb.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{inb.inboundId}</td>
                  <td className="px-6 py-5">{inb.hubName}</td>
                  <td className="px-6 py-5 font-mono">{inb.vehicleNumber}</td>
                  <td className="px-6 py-5">{inb.driverName}</td>
                  <td className="px-6 py-5">{inb.expectedTime}</td>
                  <td className="px-6 py-5">{inb.arrivalTime}</td>
                  <td className="px-6 py-5 font-medium">{inb.shipmentsCount}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${inb.status === 'On Time' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${inb.status === 'Arrived' ? 'bg-blue-100 text-blue-700' : ''}
                      ${inb.status === 'Delayed' ? 'bg-red-100 text-red-700' : ''}
                      ${inb.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : ''}`}>
                      {inb.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(inb)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setInbounds(inbounds.filter(i => i.id !== inb.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
                {editingInbound ? 'Edit Inbound' : 'Add New Inbound'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Inbound ID <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.inboundId} onChange={(e) => setFormData({ ...formData, inboundId: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="INB-240505" />
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
                  <label className="block text-sm font-medium mb-2">Driver Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.driverName} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Arrival Time</label>
                  <input type="text" value={formData.expectedTime} onChange={(e) => setFormData({ ...formData, expectedTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="10:00 AM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Actual Arrival Time</label>
                  <input type="text" value={formData.arrivalTime} onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="10:15 AM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Shipments</label>
                  <input type="number" value={formData.shipmentsCount} onChange={(e) => setFormData({ ...formData, shipmentsCount: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Arrived">Arrived</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingInbound ? 'Update Inbound' : 'Add Inbound'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}