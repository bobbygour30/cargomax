'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

interface Spoke {
  id: string;
  spokeCode: string;
  spokeName: string;
  parentHub: string;
  district: string;
  city: string;
  incharge: string;
  coverageRadius: number;
  status: 'Active' | 'Inactive';
}

interface SpokeFormData {
  spokeName: string;
  spokeCode: string;
  parentHub: string;
  deliveryTypes: string[];
  inchargeName: string;
  inchargePhone: string;
  email: string;
  status: 'Active' | 'Inactive';
  address1: string;
  address2: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  maxRadius: number;
  coverageDistricts: string;
  pinCodesCovered: string;
  transitDays: number;
  operatingDays: string[];
  operatingHours: string;
  vehicleTypes: string[];
  dailyCapacity: number;
}

const initialSpokes: Spoke[] = [
  { id: '1', spokeCode: 'MDH-01', spokeName: 'Madhubani Spoke', parentHub: 'Patna Mother Hub', district: 'Madhubani', city: 'Madhubani', incharge: 'Vijay Jha', coverageRadius: 40, status: 'Active' },
  { id: '2', spokeCode: 'DBG-01', spokeName: 'Darbhanga Spoke', parentHub: 'Patna Mother Hub', district: 'Darbhanga', city: 'Darbhanga', incharge: 'Ravi Kumar', coverageRadius: 35, status: 'Active' },
  { id: '3', spokeCode: 'PRN-01', spokeName: 'Purnia Spoke', parentHub: 'Patna Mother Hub', district: 'Purnia', city: 'Purnia', incharge: 'Sanjay Singh', coverageRadius: 50, status: 'Active' },
  { id: '4', spokeCode: 'SMS-01', spokeName: 'Samastipur Spoke', parentHub: 'Patna Mother Hub', district: 'Samastipur', city: 'Samastipur', incharge: 'Mukesh Rai', coverageRadius: 30, status: 'Active' },
  { id: '5', spokeCode: 'GYA-01', spokeName: 'Gaya Spoke', parentHub: 'Patna Mother Hub', district: 'Gaya', city: 'Dobhi', incharge: 'Anil Sharma', coverageRadius: 45, status: 'Active' },
  { id: '6', spokeCode: 'RNC-01', spokeName: 'Ranchi City Spoke', parentHub: 'Ranchi Regional Hub', district: 'Ranchi', city: 'Ranchi', incharge: 'Deepak Gupta', coverageRadius: 25, status: 'Active' },
  { id: '7', spokeCode: 'DHN-01', spokeName: 'Dhanbad Spoke', parentHub: 'Dankuni Hub', district: 'Dhanbad', city: 'Barwadda', incharge: 'Suresh Mondal', coverageRadius: 30, status: 'Active' },
];

const parentHubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];
const indianStates = ['Bihar', 'Jharkhand', 'West Bengal', 'Uttar Pradesh', 'Delhi', 'Haryana'];

const deliveryTypeOptions = ['Door Delivery', 'Godown Delivery', 'Branch Pickup'];
const vehicleTypeOptions = ['LCV', 'HCV', 'Two Wheeler', 'Auto'];
const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SpokesPage() {
  const [spokes, setSpokes] = useState<Spoke[]>(initialSpokes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpoke, setEditingSpoke] = useState<Spoke | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHub, setFilterHub] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState<SpokeFormData>({
    spokeName: '',
    spokeCode: '',
    parentHub: '',
    deliveryTypes: [],
    inchargeName: '',
    inchargePhone: '',
    email: '',
    status: 'Active',
    address1: '',
    address2: '',
    city: '',
    district: '',
    state: 'Bihar',
    pinCode: '',
    maxRadius: 30,
    coverageDistricts: '',
    pinCodesCovered: '',
    transitDays: 1,
    operatingDays: [],
    operatingHours: '9:00 AM - 6:00 PM',
    vehicleTypes: [],
    dailyCapacity: 0,
  });

  // Filtered Data
  const filteredSpokes = spokes.filter(spoke => {
    const matchesSearch = 
      spoke.spokeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spoke.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHub = !filterHub || spoke.parentHub === filterHub;
    const matchesState = !filterState || true; // Can enhance later with state mapping
    const matchesStatus = !filterStatus || spoke.status === filterStatus;

    return matchesSearch && matchesHub && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      spokeName: '', spokeCode: '', parentHub: '', deliveryTypes: [],
      inchargeName: '', inchargePhone: '', email: '', status: 'Active',
      address1: '', address2: '', city: '', district: '', state: 'Bihar', pinCode: '',
      maxRadius: 30, coverageDistricts: '', pinCodesCovered: '',
      transitDays: 1, operatingDays: [], operatingHours: '9:00 AM - 6:00 PM',
      vehicleTypes: [], dailyCapacity: 0,
    });
    setEditingSpoke(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (spoke: Spoke) => {
    setEditingSpoke(spoke);
    setFormData({
      ...formData,
      spokeName: spoke.spokeName,
      spokeCode: spoke.spokeCode,
      parentHub: spoke.parentHub,
      inchargeName: spoke.incharge,
      city: spoke.city,
      district: spoke.district,
      maxRadius: spoke.coverageRadius,
      status: spoke.status,
      // Demo values
      deliveryTypes: ['Door Delivery', 'Godown Delivery'],
      vehicleTypes: ['Two Wheeler', 'LCV'],
      operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    });
    setIsModalOpen(true);
  };

  const handleSaveSpoke = () => {
    if (!formData.spokeName || !formData.spokeCode || !formData.parentHub) {
      alert('Spoke Name, Code aur Parent Hub zaroori hain');
      return;
    }

    const newSpoke: Spoke = {
      id: editingSpoke ? editingSpoke.id : Date.now().toString(),
      spokeCode: formData.spokeCode.toUpperCase(),
      spokeName: formData.spokeName,
      parentHub: formData.parentHub,
      district: formData.district,
      city: formData.city,
      incharge: formData.inchargeName,
      coverageRadius: formData.maxRadius,
      status: formData.status,
    };

    if (editingSpoke) {
      setSpokes(spokes.map(s => s.id === editingSpoke.id ? newSpoke : s));
    } else {
      setSpokes([...spokes, newSpoke]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spokes</h1>
          <p className="text-gray-600 mt-1">Manage all last-mile delivery branches linked to hubs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Spoke
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm font-medium mb-2">Search Spoke</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Parent Hub</label>
          <select value={filterHub} onChange={(e) => setFilterHub(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Hubs</option>
            {parentHubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
          </select>
        </div>

        <div className="min-w-[180px]">
          <label className="block text-sm font-medium mb-2">State</label>
          <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All States</option>
            {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>

        <div className="min-w-[160px]">
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All</option>
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
                <th className="px-6 py-4 text-left">Spoke Code</th>
                <th className="px-6 py-4 text-left">Spoke Name</th>
                <th className="px-6 py-4 text-left">Parent Hub</th>
                <th className="px-6 py-4 text-left">District</th>
                <th className="px-6 py-4 text-left">City</th>
                <th className="px-6 py-4 text-left">Incharge</th>
                <th className="px-6 py-4 text-left">Coverage Radius</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSpokes.map(spoke => (
                <tr key={spoke.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{spoke.spokeCode}</td>
                  <td className="px-6 py-5 font-medium">{spoke.spokeName}</td>
                  <td className="px-6 py-5 text-gray-700">{spoke.parentHub}</td>
                  <td className="px-6 py-5">{spoke.district}</td>
                  <td className="px-6 py-5">{spoke.city}</td>
                  <td className="px-6 py-5">{spoke.incharge}</td>
                  <td className="px-6 py-5">{spoke.coverageRadius} km</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${spoke.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {spoke.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(spoke)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setSpokes(spokes.filter(s => s.id !== spoke.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">
                {editingSpoke ? 'Edit Spoke' : 'Add New Spoke'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-10">
              {/* Section 1 */}
              <div>
                <h3 className="font-semibold text-lg mb-6">1. Basic Info & Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Spoke Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.spokeName} onChange={e => setFormData({...formData, spokeName: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Spoke Code <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.spokeCode} onChange={e => setFormData({...formData, spokeCode: e.target.value.toUpperCase()})} maxLength={10} className="w-full border rounded-xl px-4 py-3 font-mono" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Parent Hub <span className="text-red-500">*</span></label>
                    <select value={formData.parentHub} onChange={e => setFormData({...formData, parentHub: e.target.value})} className="w-full border rounded-xl px-4 py-3">
                      <option value="">Select Parent Hub</option>
                      {parentHubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Incharge Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.inchargeName} onChange={e => setFormData({...formData, inchargeName: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Incharge Phone <span className="text-red-500">*</span></label>
                    <input type="tel" value={formData.inchargePhone} onChange={e => setFormData({...formData, inchargePhone: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-3">Delivery Type Handled</label>
                    <div className="flex flex-wrap gap-4">
                      {deliveryTypeOptions.map(type => (
                        <label key={type} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.deliveryTypes.includes(type)}
                            onChange={() => toggleArrayItem(formData.deliveryTypes, type, (newTypes) => setFormData({...formData, deliveryTypes: newTypes}))}
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address Line 1 <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.address1} onChange={e => setFormData({...formData, address1: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address Line 2</label>
                    <input type="text" value={formData.address2} onChange={e => setFormData({...formData, address2: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">District <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State <span className="text-red-500">*</span></label>
                    <select value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border rounded-xl px-4 py-3">
                      {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">PIN Code <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} maxLength={6} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="font-semibold text-lg mb-6">2. Coverage & Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Delivery Radius (km)</label>
                    <input type="number" value={formData.maxRadius} onChange={e => setFormData({...formData, maxRadius: Number(e.target.value)})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Estimated Transit Days from Hub</label>
                    <input type="number" value={formData.transitDays} onChange={e => setFormData({...formData, transitDays: Number(e.target.value)})} className="w-full border rounded-xl px-4 py-3" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Coverage Districts</label>
                    <input type="text" value={formData.coverageDistricts} onChange={e => setFormData({...formData, coverageDistricts: e.target.value})} className="w-full border rounded-xl px-4 py-3" placeholder="Madhubani, Sitamarhi, Sheohar" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">PIN Codes Covered</label>
                    <textarea value={formData.pinCodesCovered} onChange={e => setFormData({...formData, pinCodesCovered: e.target.value})} rows={4} className="w-full border rounded-xl px-4 py-3" placeholder="848101, 848102, 848113..." />
                    <p className="text-xs text-gray-500 mt-1">PIN codes entered here are automatically linked in PIN Code Routing</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Operating Days</label>
                    <div className="flex flex-wrap gap-3">
                      {daysOptions.map(day => (
                        <label key={day} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl cursor-pointer">
                          <input type="checkbox" checked={formData.operatingDays.includes(day)} onChange={() => toggleArrayItem(formData.operatingDays, day, (days) => setFormData({...formData, operatingDays: days}))} />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Operating Hours</label>
                    <input type="text" value={formData.operatingHours} onChange={e => setFormData({...formData, operatingHours: e.target.value})} className="w-full border rounded-xl px-4 py-3" placeholder="9:00 AM - 6:00 PM" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-3">Vehicle Types Available</label>
                    <div className="flex flex-wrap gap-4">
                      {vehicleTypeOptions.map(v => (
                        <label key={v} className="flex items-center gap-2">
                          <input type="checkbox" checked={formData.vehicleTypes.includes(v)} onChange={() => toggleArrayItem(formData.vehicleTypes, v, (types) => setFormData({...formData, vehicleTypes: types}))} />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Average Daily Delivery Capacity (packages)</label>
                    <input type="number" value={formData.dailyCapacity} onChange={e => setFormData({...formData, dailyCapacity: Number(e.target.value)})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveSpoke} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingSpoke ? 'Update Spoke' : 'Create Spoke'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}