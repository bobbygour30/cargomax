'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Package, QrCode, CheckCircle } from 'lucide-react';

interface DigitalBag {
  id: string;
  bagId: string;
  location: string;
  locationType: 'Hub' | 'Spoke';
  shipmentsCount: number;
  sealedBy: string;
  sealTime: string;
  destination: string;
  status: 'Sealed' | 'In Transit' | 'Delivered' | 'Cancelled';
  qrCode: string;
}

const initialBags: DigitalBag[] = [
  {
    id: '1',
    bagId: 'BAG-PAT-240501',
    location: 'Patna Mother Hub',
    locationType: 'Hub',
    shipmentsCount: 45,
    sealedBy: 'Ramesh Kumar',
    sealTime: '09:45 AM',
    destination: 'Madhubani Spoke',
    status: 'Sealed',
    qrCode: 'QR-BAG-001',
  },
  {
    id: '2',
    bagId: 'BAG-PAT-240502',
    location: 'Patna Mother Hub',
    locationType: 'Hub',
    shipmentsCount: 32,
    sealedBy: 'Sunil Verma',
    sealTime: '10:20 AM',
    destination: 'Darbhanga Spoke',
    status: 'In Transit',
    qrCode: 'QR-BAG-002',
  },
  {
    id: '3',
    bagId: 'BAG-RAN-240501',
    location: 'Ranchi Regional Hub',
    locationType: 'Hub',
    shipmentsCount: 28,
    sealedBy: 'Deepak Sharma',
    sealTime: '11:15 AM',
    destination: 'Dhanbad Spoke',
    status: 'Sealed',
    qrCode: 'QR-BAG-003',
  },
  {
    id: '4',
    bagId: 'BAG-MDH-240501',
    location: 'Madhubani Spoke',
    locationType: 'Spoke',
    shipmentsCount: 15,
    sealedBy: 'Vijay Jha',
    sealTime: '02:30 PM',
    destination: 'Local Delivery',
    status: 'Delivered',
    qrCode: 'QR-BAG-004',
  },
];

export default function DigitalBaggingPage() {
  const [bags, setBags] = useState<DigitalBag[]>(initialBags);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBag, setEditingBag] = useState<DigitalBag | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocationType, setFilterLocationType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    bagId: '',
    location: '',
    locationType: 'Hub' as 'Hub' | 'Spoke',
    shipmentsCount: 0,
    sealedBy: '',
    sealTime: '',
    destination: '',
    status: 'Sealed' as 'Sealed' | 'In Transit' | 'Delivered' | 'Cancelled',
  });

  const filteredBags = bags.filter(bag => {
    const matchesSearch = 
      bag.bagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.sealedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterLocationType || bag.locationType === filterLocationType;
    const matchesStatus = !filterStatus || bag.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      bagId: '',
      location: '',
      locationType: 'Hub',
      shipmentsCount: 0,
      sealedBy: '',
      sealTime: '',
      destination: '',
      status: 'Sealed',
    });
    setEditingBag(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (bag: DigitalBag) => {
    setEditingBag(bag);
    setFormData({
      bagId: bag.bagId,
      location: bag.location,
      locationType: bag.locationType,
      shipmentsCount: bag.shipmentsCount,
      sealedBy: bag.sealedBy,
      sealTime: bag.sealTime,
      destination: bag.destination,
      status: bag.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.bagId || !formData.location || !formData.sealedBy) {
      alert('Bag ID, Location and Sealed By are required');
      return;
    }

    const newBag: DigitalBag = {
      id: editingBag ? editingBag.id : Date.now().toString(),
      bagId: formData.bagId.toUpperCase(),
      location: formData.location,
      locationType: formData.locationType,
      shipmentsCount: formData.shipmentsCount,
      sealedBy: formData.sealedBy,
      sealTime: formData.sealTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      destination: formData.destination,
      status: formData.status,
      qrCode: `QR-${formData.bagId}`,
    };

    if (editingBag) {
      setBags(bags.map(b => b.id === editingBag.id ? newBag : b));
    } else {
      setBags([...bags, newBag]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Bagging</h1>
          <p className="text-gray-600 mt-1">Manage digital bag sealing and shipment consolidation</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Bag
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
              placeholder="Bag ID, Destination or Sealed By..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location Type</label>
          <select value={filterLocationType} onChange={(e) => setFilterLocationType(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Locations</option>
            <option value="Hub">Hub</option>
            <option value="Spoke">Spoke</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Sealed">Sealed</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
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
                <th className="px-6 py-4 text-left">Bag ID</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Shipments</th>
                <th className="px-6 py-4 text-left">Sealed By</th>
                <th className="px-6 py-4 text-left">Seal Time</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBags.map((bag) => (
                <tr key={bag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{bag.bagId}</td>
                  <td className="px-6 py-5 font-medium">{bag.location}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bag.locationType === 'Hub' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {bag.locationType}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium">{bag.shipmentsCount}</td>
                  <td className="px-6 py-5">{bag.sealedBy}</td>
                  <td className="px-6 py-5">{bag.sealTime}</td>
                  <td className="px-6 py-5 text-sm text-gray-600">{bag.destination}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${bag.status === 'Sealed' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${bag.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : ''}
                      ${bag.status === 'Delivered' ? 'bg-purple-100 text-purple-700' : ''}
                      ${bag.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}`}>
                      {bag.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(bag)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setBags(bags.filter(b => b.id !== bag.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
                {editingBag ? 'Edit Digital Bag' : 'Create New Digital Bag'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Bag ID <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.bagId} onChange={(e) => setFormData({ ...formData, bagId: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="BAG-PAT-240505" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Patna Mother Hub" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location Type</label>
                  <select value={formData.locationType} onChange={(e) => setFormData({ ...formData, locationType: e.target.value as 'Hub' | 'Spoke' })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Hub">Hub</option>
                    <option value="Spoke">Spoke</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Shipments</label>
                  <input type="number" value={formData.shipmentsCount} onChange={(e) => setFormData({ ...formData, shipmentsCount: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sealed By <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.sealedBy} onChange={(e) => setFormData({ ...formData, sealedBy: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Ramesh Kumar" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Seal Time</label>
                  <input type="text" value={formData.sealTime} onChange={(e) => setFormData({ ...formData, sealTime: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="10:30 AM" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Madhubani Spoke" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Sealed">Sealed</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingBag ? 'Update Bag' : 'Create Bag'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}