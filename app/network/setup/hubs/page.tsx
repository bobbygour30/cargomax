'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';

interface Hub {
  id: string;
  hubCode: string;
  hubName: string;
  type: 'Mother Hub' | 'Regional Hub' | 'Cross-Dock Hub';
  city: string;
  state: string;
  incharge: string;
  dockBays: number;
  geofence: string;
  status: 'Active' | 'Inactive';
  area: number;
}

interface Zone {
  zoneCode: string;
  zoneName: string;
  destinations: string;
  color: string;
}

const initialHubs: Hub[] = [
  {
    id: '1',
    hubCode: 'DADRI-01',
    hubName: 'Dadri Mother Hub',
    type: 'Mother Hub',
    city: 'Dadri',
    state: 'UP',
    incharge: 'Ramesh Gupta',
    dockBays: 6,
    geofence: '20km',
    status: 'Active',
    area: 45000,
  },
  {
    id: '2',
    hubCode: 'PATNA-01',
    hubName: 'Patna Mother Hub',
    type: 'Mother Hub',
    city: 'Patna',
    state: 'Bihar',
    incharge: 'Sunil Kumar',
    dockBays: 4,
    geofence: '20km',
    status: 'Active',
    area: 32000,
  },
  {
    id: '3',
    hubCode: 'RANCHI-01',
    hubName: 'Ranchi Regional Hub',
    type: 'Regional Hub',
    city: 'Tatisilwai',
    state: 'Jharkhand',
    incharge: 'Pradeep Yadav',
    dockBays: 3,
    geofence: '20km',
    status: 'Active',
    area: 18000,
  },
  {
    id: '4',
    hubCode: 'DANKUNI-01',
    hubName: 'Dankuni Hub',
    type: 'Cross-Dock Hub',
    city: 'Dankuni',
    state: 'WB',
    incharge: 'Arun Das',
    dockBays: 4,
    geofence: '20km',
    status: 'Active',
    area: 25000,
  },
];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function HubsPage() {
  const [hubs, setHubs] = useState<Hub[]>(initialHubs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHub, setEditingHub] = useState<Hub | null>(null);

  const [formData, setFormData] = useState({
    hubName: '',
    hubCode: '',
    type: 'Mother Hub' as 'Mother Hub' | 'Regional Hub' | 'Cross-Dock Hub',
    inchargeName: '',
    inchargePhone: '',
    alternatePhone: '',
    email: '',
    status: 'Active' as 'Active' | 'Inactive',
    totalArea: '',
    dockBays: '',
    flooringType: 'FM2',
    hasForklift: true,
    hasCctv: true,
    powerBackup: true,
    monthlyRent: '',
    owned: true,
    address1: '',
    address2: '',
    city: '',
    district: '',
    state: 'Uttar Pradesh',
    pinCode: '',
    mapsLink: '',
    latitude: '',
    longitude: '',
    geofenceRadius: 20,
    alertPhone: '',
    alertEmail: '',
    zones: [] as Zone[],
  });

  const [newZone, setNewZone] = useState<Zone>({
    zoneCode: '',
    zoneName: '',
    destinations: '',
    color: '#3b82f6',
  });

  // Stats
  const totalHubs = hubs.length;
  const activeHubs = hubs.filter(h => h.status === 'Active').length;
  const totalDockBays = hubs.reduce((sum, h) => sum + h.dockBays, 0);
  const totalArea = hubs.reduce((sum, h) => sum + h.area, 0);

  const resetForm = () => {
    setFormData({
      hubName: '', hubCode: '', type: 'Mother Hub', inchargeName: '',
      inchargePhone: '', alternatePhone: '', email: '', status: 'Active',
      totalArea: '', dockBays: '', flooringType: 'FM2',
      hasForklift: true, hasCctv: true, powerBackup: true,
      monthlyRent: '', owned: true, address1: '', address2: '',
      city: '', district: '', state: 'Uttar Pradesh', pinCode: '',
      mapsLink: '', latitude: '', longitude: '', geofenceRadius: 20,
      alertPhone: '', alertEmail: '', zones: [],
    });
    setNewZone({ zoneCode: '', zoneName: '', destinations: '', color: '#3b82f6' });
    setEditingHub(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (hub: Hub) => {
    setEditingHub(hub);
    setFormData({
      ...formData,
      hubName: hub.hubName,
      hubCode: hub.hubCode,
      type: hub.type,
      inchargeName: hub.incharge,
      city: hub.city,
      state: hub.state,
      totalArea: hub.area.toString(),
      dockBays: hub.dockBays.toString(),
      status: hub.status,
      zones: [{ zoneCode: 'ZA', zoneName: 'North Zone', destinations: 'Noida, Ghaziabad', color: '#3b82f6' }],
    });
    setIsModalOpen(true);
  };

  const handleSaveHub = () => {
    if (!formData.hubName || !formData.hubCode || formData.zones.length === 0) {
      alert('Please fill Hub Name, Hub Code and add at least 1 Zone');
      return;
    }

    const newHub: Hub = {
      id: editingHub ? editingHub.id : Date.now().toString(),
      hubCode: formData.hubCode.toUpperCase(),
      hubName: formData.hubName,
      type: formData.type,
      city: formData.city,
      state: formData.state,
      incharge: formData.inchargeName,
      dockBays: parseInt(formData.dockBays) || 0,
      geofence: `${formData.geofenceRadius}km`,
      status: formData.status,
      area: parseInt(formData.totalArea) || 0,
    };

    if (editingHub) {
      setHubs(hubs.map(h => h.id === editingHub.id ? newHub : h));
    } else {
      setHubs([...hubs, newHub]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const addZone = () => {
    if (newZone.zoneCode && newZone.zoneName) {
      setFormData({ ...formData, zones: [...formData.zones, { ...newZone }] });
      setNewZone({ zoneCode: '', zoneName: '', destinations: '', color: '#3b82f6' });
    }
  };

  const removeZone = (index: number) => {
    setFormData({
      ...formData,
      zones: formData.zones.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hubs</h1>
          <p className="text-gray-600 mt-1">Manage all mother hubs and regional distribution centers</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Hub
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Hubs</p>
          <p className="text-4xl font-bold mt-2">{totalHubs}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Active Hubs</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{activeHubs}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Dock Bays</p>
          <p className="text-4xl font-bold mt-2">{totalDockBays}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Area (sq ft)</p>
          <p className="text-4xl font-bold mt-2">{(totalArea/1000).toFixed(1)}k</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Hub Code</th>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">City</th>
                <th className="px-6 py-4 text-left">State</th>
                <th className="px-6 py-4 text-left">Incharge</th>
                <th className="px-6 py-4 text-left">Dock Bays</th>
                <th className="px-6 py-4 text-left">Geofence</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hubs.map(hub => (
                <tr key={hub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono">{hub.hubCode}</td>
                  <td className="px-6 py-5 font-medium">{hub.hubName}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${hub.type === 'Mother Hub' ? 'bg-purple-100 text-purple-700' : hub.type === 'Regional Hub' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {hub.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">{hub.city}</td>
                  <td className="px-6 py-5">{hub.state}</td>
                  <td className="px-6 py-5">{hub.incharge}</td>
                  <td className="px-6 py-5">{hub.dockBays}</td>
                  <td className="px-6 py-5">{hub.geofence}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs ${hub.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {hub.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(hub)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setHubs(hubs.filter(h => h.id !== hub.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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

      {/* ====================== ADD / EDIT MODAL ====================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                {editingHub ? 'Edit Hub' : 'Create New Hub'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-12">

              {/* Section 1 */}
              <div>
                <h3 className="text-lg font-semibold mb-6">1. Basic Info and Infrastructure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.hubName} onChange={e => setFormData({...formData, hubName: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hub Code <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.hubCode} onChange={e => setFormData({...formData, hubCode: e.target.value.toUpperCase().slice(0,10)})} className="w-full border rounded-xl px-4 py-3 font-mono" maxLength={10} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hub Type <span className="text-red-500">*</span></label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full border rounded-xl px-4 py-3">
                      <option value="Mother Hub">Mother Hub</option>
                      <option value="Regional Hub">Regional Hub</option>
                      <option value="Cross-Dock Hub">Cross-Dock Hub</option>
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
                    <label className="block text-sm font-medium mb-2">Alternate Phone</label>
                    <input type="tel" value={formData.alternatePhone} onChange={e => setFormData({...formData, alternatePhone: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full border rounded-xl px-4 py-3">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Total Warehouse Area (sq ft) <span className="text-red-500">*</span></label>
                    <input type="number" value={formData.totalArea} onChange={e => setFormData({...formData, totalArea: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Dock Bays <span className="text-red-500">*</span></label>
                    <input type="number" value={formData.dockBays} onChange={e => setFormData({...formData, dockBays: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Flooring Type</label>
                    <select value={formData.flooringType} onChange={e => setFormData({...formData, flooringType: e.target.value})} className="w-full border rounded-xl px-4 py-3">
                      <option value="FM2">FM2</option>
                      <option value="Standard">Standard</option>
                      <option value="Pucca">Pucca</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.hasForklift} onChange={e => setFormData({...formData, hasForklift: e.target.checked})} className="w-5 h-5" />
                    <label>Has Forklift</label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.hasCctv} onChange={e => setFormData({...formData, hasCctv: e.target.checked})} className="w-5 h-5" />
                    <label>Has CCTV</label>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" checked={formData.powerBackup} onChange={e => setFormData({...formData, powerBackup: e.target.checked})} className="w-5 h-5" />
                    <label>Power Backup</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Rent (₹)</label>
                    <input type="number" value={formData.monthlyRent} onChange={e => setFormData({...formData, monthlyRent: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Owned / Rented</label>
                    <select value={formData.owned ? "Owned" : "Rented"} onChange={e => setFormData({...formData, owned: e.target.value === "Owned"})} className="w-full border rounded-xl px-4 py-3">
                      <option value="Owned">Owned</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-lg font-semibold mb-6">2. Address & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
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
                    <label className="block text-sm font-medium mb-2">District</label>
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Google Maps Link</label>
                    <input type="url" value={formData.mapsLink} onChange={e => setFormData({...formData, mapsLink: e.target.value})} className="w-full border rounded-xl px-4 py-3" placeholder="Paste Google Maps link" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Geo Latitude</label>
                    <input type="text" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Geo Longitude</label>
                    <input type="text" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-lg font-semibold mb-6">3. Geofencing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Geofence Radius (km) <span className="text-red-500">*</span></label>
                    <input type="number" value={formData.geofenceRadius} onChange={e => setFormData({...formData, geofenceRadius: Number(e.target.value)})} className="w-full border rounded-xl px-4 py-3" />
                    <p className="text-xs text-gray-500 mt-1">System will alert hub incharge when a vehicle enters this radius</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inbound Alert Recipient Phone</label>
                    <input type="tel" value={formData.alertPhone} onChange={e => setFormData({...formData, alertPhone: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inbound Alert Recipient Email</label>
                    <input type="email" value={formData.alertEmail} onChange={e => setFormData({...formData, alertEmail: e.target.value})} className="w-full border rounded-xl px-4 py-3" />
                  </div>
                </div>
                <button className="mt-4 flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium">
                  <MapPin size={18} /> Test Geofence
                </button>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-lg font-semibold mb-6">4. Zone Configuration <span className="text-red-500 text-sm font-normal">* Minimum 1 zone required</span></h3>

                {formData.zones.length > 0 && (
                  <div className="mb-6 border rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left">Zone Code</th>
                          <th className="px-4 py-3 text-left">Zone Name</th>
                          <th className="px-4 py-3 text-left">Covers (Destinations)</th>
                          <th className="px-4 py-3 text-left">Color</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.zones.map((zone, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-4 py-3 font-mono">{zone.zoneCode}</td>
                            <td className="px-4 py-3">{zone.zoneName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{zone.destinations}</td>
                            <td className="px-4 py-3">
                              <div className="w-7 h-7 rounded" style={{ backgroundColor: zone.color }}></div>
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => removeZone(i)} className="text-red-500 hover:text-red-700">✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="border border-dashed border-gray-300 rounded-2xl p-6">
                  <p className="font-medium mb-4">Add New Zone</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <input placeholder="Zone Code (ZA)" value={newZone.zoneCode} onChange={e => setNewZone({...newZone, zoneCode: e.target.value.toUpperCase()})} className="border rounded-xl px-4 py-3" />
                    <input placeholder="Zone Name" value={newZone.zoneName} onChange={e => setNewZone({...newZone, zoneName: e.target.value})} className="border rounded-xl px-4 py-3" />
                    <input placeholder="Destinations (comma separated)" value={newZone.destinations} onChange={e => setNewZone({...newZone, destinations: e.target.value})} className="border rounded-xl px-4 py-3" />
                    <input type="color" value={newZone.color} onChange={e => setNewZone({...newZone, color: e.target.value})} className="h-12 border rounded-xl p-1" />
                    <button onClick={addZone} className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium">Add Zone</button>
                  </div>
                </div>
              </div>

            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveHub} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingHub ? 'Update Hub' : 'Create Hub'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}