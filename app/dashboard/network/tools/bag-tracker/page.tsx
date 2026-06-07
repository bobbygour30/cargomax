'use client';

import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Search, Eye, Truck } from 'lucide-react';

interface BagTrack {
  id: string;
  bagId: string;
  currentLocation: string;
  destination: string;
  status: 'In Transit' | 'At Hub' | 'Delivered' | 'Delayed' | 'Scanned';
  vehicleNumber?: string;
  lastScanned: string;
  eta: string;
  seals: number;
}

const initialBags: BagTrack[] = [
  {
    id: '1',
    bagId: 'BAG-PAT-240501',
    currentLocation: 'Patna Mother Hub - Zone A',
    destination: 'Madhubani Spoke',
    status: 'In Transit',
    vehicleNumber: 'BR01AB1234',
    lastScanned: 'Just now',
    eta: '2 hrs 40 mins',
    seals: 3,
  },
  {
    id: '2',
    bagId: 'BAG-PAT-240502',
    currentLocation: 'Near Hajipur',
    destination: 'Darbhanga Spoke',
    status: 'In Transit',
    vehicleNumber: 'BR01CD5678',
    lastScanned: '8 mins ago',
    eta: '3 hrs 15 mins',
    seals: 2,
  },
  {
    id: '3',
    bagId: 'BAG-RAN-240501',
    currentLocation: 'Ranchi Regional Hub',
    destination: 'Dhanbad Spoke',
    status: 'At Hub',
    vehicleNumber: '',
    lastScanned: '22 mins ago',
    eta: '45 mins',
    seals: 4,
  },
  {
    id: '4',
    bagId: 'BAG-PAT-240503',
    currentLocation: 'Gaya Spoke',
    destination: 'Local Delivery',
    status: 'Delivered',
    vehicleNumber: 'BR01EF3456',
    lastScanned: '1 hour ago',
    eta: 'Completed',
    seals: 1,
  },
];

export default function BagTrackerPage() {
  const [bags, setBags] = useState<BagTrack[]>(initialBags);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBag, setSelectedBag] = useState<BagTrack | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Simulate live scanning updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBags(prev => prev.map(bag => ({
        ...bag,
        lastScanned: Math.random() > 0.6 ? 'Just now' : bag.lastScanned,
      })));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const filteredBags = bags.filter(bag => {
    const matchesSearch = 
      bag.bagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || bag.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const inTransitCount = bags.filter(b => b.status === 'In Transit').length;

  const openDetail = (bag: BagTrack) => {
    setSelectedBag(bag);
    setShowDetail(true);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bag Tracker</h1>
          <p className="text-gray-600 mt-1">Real-time tracking of all sealed bags in the network</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          LIVE TRACKING
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Bags</p>
          <p className="text-4xl font-bold mt-2">{bags.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">In Transit</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{inTransitCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Delivered Today</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">
            {bags.filter(b => b.status === 'Delivered').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Transit Time</p>
          <p className="text-4xl font-bold mt-2">3.8 hrs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Bag</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Bag ID or Destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="w-full border rounded-xl py-3 px-4"
          >
            <option value="">All Status</option>
            <option value="In Transit">In Transit</option>
            <option value="At Hub">At Hub</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Bag ID</th>
                <th className="px-6 py-4 text-left">Current Location</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Vehicle</th>
                <th className="px-6 py-4 text-left">ETA</th>
                <th className="px-6 py-4 text-left">Last Scanned</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBags.map((bag) => (
                <tr key={bag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{bag.bagId}</td>
                  <td className="px-6 py-5 flex items-center gap-2">
                    <MapPin size={18} className="text-gray-400" />
                    {bag.currentLocation}
                  </td>
                  <td className="px-6 py-5 font-medium">{bag.destination}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${bag.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : ''}
                      ${bag.status === 'At Hub' ? 'bg-amber-100 text-amber-700' : ''}
                      ${bag.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${bag.status === 'Delayed' ? 'bg-red-100 text-red-700' : ''}`}>
                      {bag.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-mono">{bag.vehicleNumber || '-'}</td>
                  <td className="px-6 py-5">{bag.eta}</td>
                  <td className="px-6 py-5 text-sm text-gray-500">{bag.lastScanned}</td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => openDetail(bag)}
                      className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      <Eye size={18} />
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bag Detail Modal */}
      {showDetail && selectedBag && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">Bag Tracking</h2>
              <p className="font-mono text-lg text-gray-700">{selectedBag.bagId}</p>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="font-semibold text-xl mt-1">{selectedBag.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Scanned</p>
                  <p className="font-semibold text-xl mt-1">{selectedBag.lastScanned}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Current Location</p>
                <p className="text-lg font-medium">{selectedBag.currentLocation}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Destination</p>
                <p className="text-lg font-medium">{selectedBag.destination}</p>
              </div>

              {selectedBag.vehicleNumber && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Current Vehicle</p>
                  <p className="font-mono text-lg">{selectedBag.vehicleNumber}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">Estimated Arrival</p>
                <p className="text-2xl font-bold">{selectedBag.eta}</p>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end">
              <button 
                onClick={() => setShowDetail(false)}
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