'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Upload } from 'lucide-react';

interface PinCodeEntry {
  id: string;
  pinCode: string;
  city: string;
  district: string;
  state: string;
  assignedHub: string;
  assignedSpoke: string;
  floorZone: string;
  isServiceable: boolean;
  nonServiceableReason?: string;
}

const initialPinCodes: PinCodeEntry[] = [
  { id: '1', pinCode: '847211', city: 'Madhubani', district: 'Madhubani', state: 'Bihar', assignedHub: 'Patna Mother Hub', assignedSpoke: 'Madhubani Spoke', floorZone: 'Zone A - North Bihar', isServiceable: true },
  { id: '2', pinCode: '846001', city: 'Samastipur', district: 'Samastipur', state: 'Bihar', assignedHub: 'Patna Mother Hub', assignedSpoke: 'Samastipur Spoke', floorZone: 'Zone A - North Bihar', isServiceable: true },
  { id: '3', pinCode: '824101', city: 'Gaya', district: 'Gaya', state: 'Bihar', assignedHub: 'Patna Mother Hub', assignedSpoke: 'Gaya Spoke', floorZone: 'Zone B - South Bihar', isServiceable: true },
  { id: '4', pinCode: '854301', city: 'Purnia', district: 'Purnia', state: 'Bihar', assignedHub: 'Patna Mother Hub', assignedSpoke: 'Purnia Spoke', floorZone: 'Zone C - East Bihar', isServiceable: true },
  { id: '5', pinCode: '825301', city: 'Dhanbad', district: 'Dhanbad', state: 'Jharkhand', assignedHub: 'Dankuni Hub', assignedSpoke: 'Dhanbad Spoke', floorZone: 'Zone A - Jharkhand', isServiceable: true },
  { id: '6', pinCode: '834001', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', assignedHub: 'Ranchi Regional Hub', assignedSpoke: 'Ranchi City Spoke', floorZone: 'Zone A - Jharkhand', isServiceable: true },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];
const states = ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Delhi', 'Haryana'];

const hubToSpokes: Record<string, string[]> = {
  'Patna Mother Hub': ['Madhubani Spoke', 'Darbhanga Spoke', 'Purnia Spoke', 'Samastipur Spoke', 'Gaya Spoke'],
  'Ranchi Regional Hub': ['Ranchi City Spoke'],
  'Dankuni Hub': ['Dhanbad Spoke'],
  'Dadri Mother Hub': ['Noida Spoke', 'Ghaziabad Spoke'],
};

const hubToZones: Record<string, string[]> = {
  'Patna Mother Hub': ['Zone A - North Bihar', 'Zone B - South Bihar', 'Zone C - East Bihar'],
  'Ranchi Regional Hub': ['Zone A - Jharkhand'],
  'Dankuni Hub': ['Zone A - Jharkhand'],
  'Dadri Mother Hub': ['Zone A - NCR', 'Zone B - UP Border'],
};

export default function PinCodeRoutingPage() {
  const [pinCodes, setPinCodes] = useState<PinCodeEntry[]>(initialPinCodes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<PinCodeEntry | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterSpoke, setFilterSpoke] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterServiceable, setFilterServiceable] = useState('');

  const [formData, setFormData] = useState({
    pinCode: '',
    city: '',
    district: '',
    state: 'Bihar',
    assignedHub: '',
    assignedSpoke: '',
    floorZone: '',
    isServiceable: true,
    nonServiceableReason: '',
  });

  // Filtered Data
  const filteredPins = pinCodes.filter(pin => {
    const matchesSearch = pin.pinCode.includes(searchTerm) || 
                         pin.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHub = !filterHub || pin.assignedHub === filterHub;
    const matchesSpoke = !filterSpoke || pin.assignedSpoke === filterSpoke;
    const matchesState = !filterState || pin.state === filterState;
    const matchesService = !filterServiceable || 
      (filterServiceable === 'Yes' ? pin.isServiceable : !pin.isServiceable);

    return matchesSearch && matchesHub && matchesSpoke && matchesState && matchesService;
  });

  const resetForm = () => {
    setFormData({
      pinCode: '', city: '', district: '', state: 'Bihar',
      assignedHub: '', assignedSpoke: '', floorZone: '',
      isServiceable: true, nonServiceableReason: ''
    });
    setEditingPin(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (pin: PinCodeEntry) => {
    setEditingPin(pin);
    setFormData({
      pinCode: pin.pinCode,
      city: pin.city,
      district: pin.district,
      state: pin.state,
      assignedHub: pin.assignedHub,
      assignedSpoke: pin.assignedSpoke,
      floorZone: pin.floorZone,
      isServiceable: pin.isServiceable,
      nonServiceableReason: pin.nonServiceableReason || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.pinCode || !formData.assignedHub) {
      alert('PIN Code aur Assigned Hub zaroori hain');
      return;
    }

    const newPin: PinCodeEntry = {
      id: editingPin ? editingPin.id : Date.now().toString(),
      pinCode: formData.pinCode,
      city: formData.city,
      district: formData.district,
      state: formData.state,
      assignedHub: formData.assignedHub,
      assignedSpoke: formData.assignedSpoke,
      floorZone: formData.floorZone,
      isServiceable: formData.isServiceable,
      nonServiceableReason: formData.isServiceable ? undefined : formData.nonServiceableReason,
    };

    if (editingPin) {
      setPinCodes(pinCodes.map(p => p.id === editingPin.id ? newPin : p));
    } else {
      setPinCodes([...pinCodes, newPin]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`✅ ${file.name} uploaded successfully!\n\n(In real app, Excel parsing + validation would happen here)`);
      // Simulate adding few records
      setTimeout(() => {
        alert('Import Successful: 245 PIN codes imported, 12 errors');
      }, 800);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PIN Code Routing</h1>
          <p className="text-gray-600 mt-1">Map destination PIN codes to hubs and spokes for auto-routing</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            Add PIN
          </button>
          <label className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl font-medium cursor-pointer">
            <Upload className="w-5 h-5" />
            Bulk Import (Excel)
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="PIN or City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Assigned Hub</label>
          <select value={filterHub} onChange={(e) => { setFilterHub(e.target.value); setFilterSpoke(''); }} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Hubs</option>
            {hubs.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Assigned Spoke</label>
          <select value={filterSpoke} onChange={(e) => setFilterSpoke(e.target.value)} className="w-full border rounded-xl py-3 px-4" disabled={!filterHub}>
            <option value="">All Spokes</option>
            {filterHub && hubToSpokes[filterHub]?.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Serviceable</label>
          <select value={filterServiceable} onChange={(e) => setFilterServiceable(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">PIN Code</th>
                <th className="px-6 py-4 text-left">City</th>
                <th className="px-6 py-4 text-left">District</th>
                <th className="px-6 py-4 text-left">State</th>
                <th className="px-6 py-4 text-left">Assigned Hub</th>
                <th className="px-6 py-4 text-left">Assigned Spoke</th>
                <th className="px-6 py-4 text-left">Floor Zone</th>
                <th className="px-6 py-4 text-left">Serviceable</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPins.map(pin => (
                <tr key={pin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{pin.pinCode}</td>
                  <td className="px-6 py-5">{pin.city}</td>
                  <td className="px-6 py-5">{pin.district}</td>
                  <td className="px-6 py-5">{pin.state}</td>
                  <td className="px-6 py-5">{pin.assignedHub}</td>
                  <td className="px-6 py-5">{pin.assignedSpoke}</td>
                  <td className="px-6 py-5 text-sm">{pin.floorZone}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${pin.isServiceable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {pin.isServiceable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(pin)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setPinCodes(pinCodes.filter(p => p.id !== pin.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">
                {editingPin ? 'Edit PIN Code' : 'Add New PIN Code'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">PIN Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
                    className="w-full border rounded-xl px-4 py-3 font-mono"
                    placeholder="847211"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">District</label>
                  <input type="text" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State <span className="text-red-500">*</span></label>
                  <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Assigned Hub <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.assignedHub} 
                    onChange={(e) => setFormData({ ...formData, assignedHub: e.target.value, assignedSpoke: '', floorZone: '' })}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">Select Hub</option>
                    {hubs.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Assigned Spoke</label>
                  <select 
                    value={formData.assignedSpoke} 
                    onChange={(e) => setFormData({ ...formData, assignedSpoke: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                    disabled={!formData.assignedHub}
                  >
                    <option value="">Select Spoke</option>
                    {formData.assignedHub && hubToSpokes[formData.assignedHub]?.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Floor Zone Code</label>
                  <select 
                    value={formData.floorZone} 
                    onChange={(e) => setFormData({ ...formData, floorZone: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3"
                    disabled={!formData.assignedHub}
                  >
                    <option value="">Select Zone</option>
                    {formData.assignedHub && hubToZones[formData.assignedHub]?.map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-8">
                  <input 
                    type="checkbox" 
                    checked={formData.isServiceable} 
                    onChange={(e) => setFormData({ ...formData, isServiceable: e.target.checked })} 
                    className="w-5 h-5"
                  />
                  <label className="font-medium">Is Serviceable</label>
                </div>
              </div>

              {!formData.isServiceable && (
                <div>
                  <label className="block text-sm font-medium mb-2">Non-Serviceable Reason</label>
                  <textarea 
                    value={formData.nonServiceableReason} 
                    onChange={(e) => setFormData({ ...formData, nonServiceableReason: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3 h-24"
                    placeholder="Out of service area / No road connectivity..."
                  />
                </div>
              )}
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingPin ? 'Update PIN' : 'Add PIN Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}