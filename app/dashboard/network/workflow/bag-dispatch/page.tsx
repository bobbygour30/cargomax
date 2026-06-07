'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Truck, Clock, ArrowRight } from 'lucide-react';

interface BagDispatch {
  id: string;
  dispatchId: string;
  bagId: string;
  fromHub: string;
  destination: string;
  vehicleNumber: string;
  driverName: string;
  dispatchTime: string;
  estimatedArrival: string;
  status: 'Dispatched' | 'In Transit' | 'Arrived' | 'Delivered';
  bagsCount: number;
}

const initialDispatches: BagDispatch[] = [
  {
    id: '1',
    dispatchId: 'DSP-PAT-240501',
    bagId: 'BAG-PAT-240501',
    fromHub: 'Patna Mother Hub',
    destination: 'Madhubani Spoke',
    vehicleNumber: 'BR01AB1234',
    driverName: 'Rajesh Kumar',
    dispatchTime: '10:30 AM',
    estimatedArrival: '03:00 PM',
    status: 'In Transit',
    bagsCount: 1,
  },
  {
    id: '2',
    dispatchId: 'DSP-PAT-240502',
    bagId: 'BAG-PAT-240502',
    fromHub: 'Patna Mother Hub',
    destination: 'Darbhanga Spoke',
    vehicleNumber: 'BR01CD5678',
    driverName: 'Manoj Singh',
    dispatchTime: '11:15 AM',
    estimatedArrival: '03:45 PM',
    status: 'Dispatched',
    bagsCount: 2,
  },
  {
    id: '3',
    dispatchId: 'DSP-RAN-240501',
    bagId: 'BAG-RAN-240501',
    fromHub: 'Ranchi Regional Hub',
    destination: 'Dhanbad Spoke',
    vehicleNumber: 'JH05XY9012',
    driverName: 'Suresh Yadav',
    dispatchTime: '01:20 PM',
    estimatedArrival: '05:30 PM',
    status: 'In Transit',
    bagsCount: 1,
  },
  {
    id: '4',
    dispatchId: 'DSP-PAT-240503',
    bagId: 'BAG-PAT-240503',
    fromHub: 'Patna Mother Hub',
    destination: 'Gaya Spoke',
    vehicleNumber: 'BR01EF3456',
    driverName: 'Vikash Pandey',
    dispatchTime: '09:45 AM',
    estimatedArrival: '01:15 PM',
    status: 'Delivered',
    bagsCount: 3,
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];

export default function BagDispatchPage() {
  const [dispatches, setDispatches] = useState<BagDispatch[]>(initialDispatches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState<BagDispatch | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    dispatchId: '',
    bagId: '',
    fromHub: '',
    destination: '',
    vehicleNumber: '',
    driverName: '',
    dispatchTime: '',
    estimatedArrival: '',
    status: 'Dispatched' as 'Dispatched' | 'In Transit' | 'Arrived' | 'Delivered',
    bagsCount: 1,
  });

  const filteredDispatches = dispatches.filter(dispatch => {
    const matchesSearch = 
      dispatch.dispatchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.bagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !filterHub || dispatch.fromHub === filterHub;
    const matchesStatus = !filterStatus || dispatch.status === filterStatus;

    return matchesSearch && matchesHub && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      dispatchId: '',
      bagId: '',
      fromHub: '',
      destination: '',
      vehicleNumber: '',
      driverName: '',
      dispatchTime: '',
      estimatedArrival: '',
      status: 'Dispatched',
      bagsCount: 1,
    });
    setEditingDispatch(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (dispatch: BagDispatch) => {
    setEditingDispatch(dispatch);
    setFormData({
      dispatchId: dispatch.dispatchId,
      bagId: dispatch.bagId,
      fromHub: dispatch.fromHub,
      destination: dispatch.destination,
      vehicleNumber: dispatch.vehicleNumber,
      driverName: dispatch.driverName,
      dispatchTime: dispatch.dispatchTime,
      estimatedArrival: dispatch.estimatedArrival,
      status: dispatch.status,
      bagsCount: dispatch.bagsCount,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.dispatchId || !formData.bagId || !formData.fromHub) {
      alert('Dispatch ID, Bag ID and From Hub are required');
      return;
    }

    const newDispatch: BagDispatch = {
      id: editingDispatch ? editingDispatch.id : Date.now().toString(),
      dispatchId: formData.dispatchId.toUpperCase(),
      bagId: formData.bagId.toUpperCase(),
      fromHub: formData.fromHub,
      destination: formData.destination,
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      driverName: formData.driverName,
      dispatchTime: formData.dispatchTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedArrival: formData.estimatedArrival,
      status: formData.status,
      bagsCount: formData.bagsCount,
    };

    if (editingDispatch) {
      setDispatches(dispatches.map(d => d.id === editingDispatch.id ? newDispatch : d));
    } else {
      setDispatches([...dispatches, newDispatch]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bag Dispatch</h1>
          <p className="text-gray-600 mt-1">Manage dispatch of sealed bags from hubs to spokes</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          New Dispatch
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
              placeholder="Dispatch ID, Bag ID or Destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">From Hub</label>
          <select value={filterHub} onChange={(e) => setFilterHub(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Hubs</option>
            {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Transit">In Transit</option>
            <option value="Arrived">Arrived</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Dispatch ID</th>
                <th className="px-6 py-4 text-left">Bag ID</th>
                <th className="px-6 py-4 text-left">From Hub</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Vehicle No.</th>
                <th className="px-6 py-4 text-left">Driver</th>
                <th className="px-6 py-4 text-left">Dispatch Time</th>
                <th className="px-6 py-4 text-left">Est. Arrival</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDispatches.map((dispatch) => (
                <tr key={dispatch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{dispatch.dispatchId}</td>
                  <td className="px-6 py-5 font-mono">{dispatch.bagId}</td>
                  <td className="px-6 py-5">{dispatch.fromHub}</td>
                  <td className="px-6 py-5 font-medium">{dispatch.destination}</td>
                  <td className="px-6 py-5 font-mono">{dispatch.vehicleNumber}</td>
                  <td className="px-6 py-5">{dispatch.driverName}</td>
                  <td className="px-6 py-5">{dispatch.dispatchTime}</td>
                  <td className="px-6 py-5">{dispatch.estimatedArrival}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${dispatch.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' : ''}
                      ${dispatch.status === 'In Transit' ? 'bg-amber-100 text-amber-700' : ''}
                      ${dispatch.status === 'Arrived' ? 'bg-purple-100 text-purple-700' : ''}
                      ${dispatch.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                      {dispatch.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(dispatch)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDispatches(dispatches.filter(d => d.id !== dispatch.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
                {editingDispatch ? 'Edit Bag Dispatch' : 'Create New Bag Dispatch'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Dispatch ID <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.dispatchId} onChange={(e) => setFormData({ ...formData, dispatchId: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="DSP-PAT-240505" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bag ID <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.bagId} onChange={(e) => setFormData({ ...formData, bagId: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="BAG-PAT-240505" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">From Hub <span className="text-red-500">*</span></label>
                  <select value={formData.fromHub} onChange={(e) => setFormData({ ...formData, fromHub: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="">Select Hub</option>
                    {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Madhubani Spoke" />
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
                  <label className="block text-sm font-medium mb-2">Dispatch Time</label>
                  <input type="text" value={formData.dispatchTime} onChange={(e) => setFormData({ ...formData, dispatchTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="10:30 AM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Arrival</label>
                  <input type="text" value={formData.estimatedArrival} onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="03:00 PM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Bags</label>
                  <input type="number" value={formData.bagsCount} onChange={(e) => setFormData({ ...formData, bagsCount: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Dispatched">Dispatched</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingDispatch ? 'Update Dispatch' : 'Create Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}