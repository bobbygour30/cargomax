'use client';

import React, { useState } from 'react';
import { Search, Download, Filter, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  id: string;
  hubName: string;
  zoneCode: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentStock: number;
  minStock: number;
  incoming: number;
  outgoing: number;
  lastUpdated: string;
  status: 'Healthy' | 'Low Stock' | 'Critical';
}

const initialInventory: InventoryItem[] = [
  {
    id: '1',
    hubName: 'Patna Mother Hub',
    zoneCode: 'ZA',
    itemCode: 'PKG-001',
    itemName: 'Standard Carton Box',
    category: 'Packaging',
    currentStock: 12450,
    minStock: 5000,
    incoming: 2400,
    outgoing: 1800,
    lastUpdated: 'May 30, 2026',
    status: 'Healthy',
  },
  {
    id: '2',
    hubName: 'Patna Mother Hub',
    zoneCode: 'ZB',
    itemCode: 'TAPE-001',
    itemName: 'Packing Tape Roll',
    category: 'Packaging',
    currentStock: 890,
    minStock: 1200,
    incoming: 500,
    outgoing: 320,
    lastUpdated: 'May 30, 2026',
    status: 'Low Stock',
  },
  {
    id: '3',
    hubName: 'Ranchi Regional Hub',
    zoneCode: 'ZA',
    itemCode: 'LABEL-001',
    itemName: 'Barcode Labels',
    category: 'Consumables',
    currentStock: 2450,
    minStock: 3000,
    incoming: 1200,
    outgoing: 800,
    lastUpdated: 'May 29, 2026',
    status: 'Low Stock',
  },
  {
    id: '4',
    hubName: 'Patna Mother Hub',
    zoneCode: 'ZC',
    itemCode: 'PAL-001',
    itemName: 'Wooden Pallet',
    category: 'Infrastructure',
    currentStock: 185,
    minStock: 150,
    incoming: 50,
    outgoing: 30,
    lastUpdated: 'May 30, 2026',
    status: 'Healthy',
  },
];

const hubs = ['Patna Mother Hub', 'Ranchi Regional Hub', 'Dankuni Hub', 'Dadri Mother Hub'];
const categories = ['All', 'Packaging', 'Consumables', 'Infrastructure', 'Tools'];

export default function HubInventoryReportsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHub, setSelectedHub] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHub = !selectedHub || item.hubName === selectedHub;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;

    return matchesSearch && matchesHub && matchesCategory && matchesStatus;
  });

  const totalItems = filteredInventory.length;
  const lowStockCount = filteredInventory.filter(i => i.status === 'Low Stock').length;
  const totalStockValue = filteredInventory.reduce((sum, i) => sum + (i.currentStock * 10), 0); // Dummy value

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hub Inventory Reports</h1>
          <p className="text-gray-600 mt-1">Real-time inventory visibility and stock management across all hubs</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-xl font-medium">
            <Download size={18} />
            Export Excel
          </button>
          <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-xl font-medium">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-4xl font-bold mt-2">{totalItems}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">{lowStockCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Est. Stock Value</p>
          <p className="text-4xl font-bold mt-2">₹{totalStockValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg. Utilization</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">78%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Item</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Item name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hub</label>
          <select value={selectedHub} onChange={(e) => setSelectedHub(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Hubs</option>
            {hubs.map(hub => <option key={hub} value={hub}>{hub}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="flex items-end">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
            <Filter size={18} />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Item Code</th>
                <th className="px-6 py-4 text-left">Item Name</th>
                <th className="px-6 py-4 text-left">Hub</th>
                <th className="px-6 py-4 text-left">Zone</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Current Stock</th>
                <th className="px-6 py-4 text-left">Incoming</th>
                <th className="px-6 py-4 text-left">Outgoing</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{item.itemCode}</td>
                  <td className="px-6 py-5 font-medium">{item.itemName}</td>
                  <td className="px-6 py-5">{item.hubName}</td>
                  <td className="px-6 py-5 font-mono">{item.zoneCode}</td>
                  <td className="px-6 py-5">{item.category}</td>
                  <td className="px-6 py-5 font-medium">{item.currentStock.toLocaleString()}</td>
                  <td className="px-6 py-5 text-emerald-600 font-medium">+{item.incoming}</td>
                  <td className="px-6 py-5 text-red-600 font-medium">-{item.outgoing}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${item.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : ''}
                      ${item.status === 'Critical' ? 'bg-red-100 text-red-700' : ''}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Showing {filteredInventory.length} items • Last updated: Just now
      </div>
    </div>
  );
}