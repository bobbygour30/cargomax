'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, Search, Play, Pause, Eye } from 'lucide-react';

interface Vehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  currentLocation: string;
  destination: string;
  status: 'In Transit' | 'Loading' | 'Unloading' | 'Delivered' | 'Idle';
  speed: number;
  eta: string;
  lastUpdated: string;
  latitude: number;
  longitude: number;
}

const initialVehicles: Vehicle[] = [
  {
    id: '1',
    vehicleNumber: 'BR01AB1234',
    driverName: 'Rajesh Kumar',
    currentLocation: 'Near Hajipur, Bihar',
    destination: 'Madhubani Spoke',
    status: 'In Transit',
    speed: 68,
    eta: '2 hrs 45 mins',
    lastUpdated: 'Just now',
    latitude: 25.78,
    longitude: 85.45,
  },
  {
    id: '2',
    vehicleNumber: 'JH05XY9012',
    driverName: 'Manoj Singh',
    currentLocation: 'Ranchi Regional Hub',
    destination: 'Dhanbad Spoke',
    status: 'Loading',
    speed: 0,
    eta: '45 mins',
    lastUpdated: '3 mins ago',
    latitude: 23.34,
    longitude: 85.31,
  },
  {
    id: '3',
    vehicleNumber: 'DL7CN4567',
    driverName: 'Suresh Yadav',
    currentLocation: 'Near Ghaziabad',
    destination: 'Dadri Mother Hub',
    status: 'In Transit',
    speed: 52,
    eta: '1 hr 20 mins',
    lastUpdated: 'Just now',
    latitude: 28.65,
    longitude: 77.45,
  },
  {
    id: '4',
    vehicleNumber: 'BR01EF3456',
    driverName: 'Vikash Pandey',
    currentLocation: 'Gaya Spoke',
    destination: 'Patna Mother Hub',
    status: 'Delivered',
    speed: 0,
    eta: 'Completed',
    lastUpdated: '12 mins ago',
    latitude: 24.78,
    longitude: 84.99,
  },
];

export default function VehicleTrackerPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Simulate live movement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => {
        if (vehicle.status === 'In Transit') {
          return {
            ...vehicle,
            speed: Math.floor(Math.random() * 30) + 45,
            lastUpdated: 'Just now',
          };
        }
        return vehicle;
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || vehicle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const inTransitCount = vehicles.filter(v => v.status === 'In Transit').length;
  const totalVehicles = vehicles.length;

  const openDetail = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetail(true);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Tracker</h1>
          <p className="text-gray-600 mt-1">Real-time tracking of all vehicles in the network</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl font-medium"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Pause Live' : 'Resume Live'}
          </button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Vehicles</p>
          <p className="text-4xl font-bold mt-2">{totalVehicles}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">In Transit</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{inTransitCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Speed</p>
          <p className="text-4xl font-bold mt-2">58 km/h</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">On Time Vehicles</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">87%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Vehicle</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Vehicle number or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="In Transit">In Transit</option>
            <option value="Loading">Loading</option>
            <option value="Unloading">Unloading</option>
            <option value="Delivered">Delivered</option>
            <option value="Idle">Idle</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Vehicle Number</th>
                <th className="px-6 py-4 text-left">Driver</th>
                <th className="px-6 py-4 text-left">Current Location</th>
                <th className="px-6 py-4 text-left">Destination</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Speed</th>
                <th className="px-6 py-4 text-left">ETA</th>
                <th className="px-6 py-4 text-left">Last Updated</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{vehicle.vehicleNumber}</td>
                  <td className="px-6 py-5">{vehicle.driverName}</td>
                  <td className="px-6 py-5 flex items-center gap-2">
                    <MapPin size={18} className="text-gray-400" />
                    {vehicle.currentLocation}
                  </td>
                  <td className="px-6 py-5 font-medium">{vehicle.destination}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${vehicle.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : ''}
                      ${vehicle.status === 'Loading' ? 'bg-amber-100 text-amber-700' : ''}
                      ${vehicle.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${vehicle.status === 'Idle' ? 'bg-gray-100 text-gray-700' : ''}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-medium">{vehicle.speed} km/h</td>
                  <td className="px-6 py-5">{vehicle.eta}</td>
                  <td className="px-6 py-5 text-sm text-gray-500">{vehicle.lastUpdated}</td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => openDetail(vehicle)}
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

      {/* Vehicle Detail Modal */}
      {showDetail && selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{selectedVehicle.vehicleNumber}</h2>
                <p className="text-gray-500">{selectedVehicle.driverName}</p>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-3xl text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="text-2xl font-bold mt-2">{selectedVehicle.status}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <p className="text-sm text-gray-500">Current Speed</p>
                  <p className="text-2xl font-bold mt-2">{selectedVehicle.speed} km/h</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Current Location</p>
                <p className="text-lg font-medium">{selectedVehicle.currentLocation}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Destination</p>
                <p className="text-lg font-medium">{selectedVehicle.destination}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Estimated Arrival</p>
                <p className="text-2xl font-bold">{selectedVehicle.eta}</p>
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