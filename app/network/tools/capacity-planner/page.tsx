'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface CapacityPlan {
  id: string;
  hubName: string;
  month: string;
  year: string;
  plannedCapacity: number;
  expectedVolume: number;
  currentUtilization: number;
  projectedUtilization: number;
  status: 'On Track' | 'At Risk' | 'Over Capacity';
  notes: string;
}

const initialPlans: CapacityPlan[] = [
  {
    id: '1',
    hubName: 'Patna Mother Hub',
    month: 'June',
    year: '2026',
    plannedCapacity: 48000,
    expectedVolume: 42500,
    currentUtilization: 78,
    projectedUtilization: 88,
    status: 'On Track',
    notes: 'Peak season expected',
  },
  {
    id: '2',
    hubName: 'Ranchi Regional Hub',
    month: 'June',
    year: '2026',
    plannedCapacity: 32000,
    expectedVolume: 28500,
    currentUtilization: 65,
    projectedUtilization: 89,
    status: 'At Risk',
    notes: 'Additional staffing required',
  },
  {
    id: '3',
    hubName: 'Dadri Mother Hub',
    month: 'June',
    year: '2026',
    plannedCapacity: 55000,
    expectedVolume: 48000,
    currentUtilization: 82,
    projectedUtilization: 87,
    status: 'On Track',
    notes: '',
  },
];

export default function CapacityPlannerPage() {
  const [plans, setPlans] = useState<CapacityPlan[]>(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CapacityPlan | null>(null);
  const [filterMonth, setFilterMonth] = useState('June');

  const [formData, setFormData] = useState({
    hubName: '',
    month: 'June',
    year: '2026',
    plannedCapacity: 0,
    expectedVolume: 0,
    notes: '',
  });

  const filteredPlans = plans.filter(plan => plan.month === filterMonth);

  const totalPlanned = filteredPlans.reduce((sum, p) => sum + p.plannedCapacity, 0);
  const totalExpected = filteredPlans.reduce((sum, p) => sum + p.expectedVolume, 0);
  const atRiskCount = filteredPlans.filter(p => p.status === 'At Risk').length;

  const openAddModal = () => {
    setEditingPlan(null);
    setFormData({
      hubName: '',
      month: 'June',
      year: '2026',
      plannedCapacity: 0,
      expectedVolume: 0,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan: CapacityPlan) => {
    setEditingPlan(plan);
    setFormData({
      hubName: plan.hubName,
      month: plan.month,
      year: plan.year,
      plannedCapacity: plan.plannedCapacity,
      expectedVolume: plan.expectedVolume,
      notes: plan.notes,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.hubName || !formData.plannedCapacity) {
      alert('Hub Name and Planned Capacity are required');
      return;
    }

    const projectedUtilization = Math.round((formData.expectedVolume / formData.plannedCapacity) * 100);

    const newPlan: CapacityPlan = {
      id: editingPlan ? editingPlan.id : Date.now().toString(),
      hubName: formData.hubName,
      month: formData.month,
      year: formData.year,
      plannedCapacity: formData.plannedCapacity,
      expectedVolume: formData.expectedVolume,
      currentUtilization: editingPlan ? editingPlan.currentUtilization : 75,
      projectedUtilization: projectedUtilization,
      status: projectedUtilization > 95 ? 'Over Capacity' : projectedUtilization > 85 ? 'At Risk' : 'On Track',
      notes: formData.notes,
    };

    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? newPlan : p));
    } else {
      setPlans([...plans, newPlan]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Capacity Planner</h1>
          <p className="text-gray-600 mt-1">Plan and forecast warehouse capacity for upcoming months</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Capacity Plan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Planned Capacity</p>
          <p className="text-4xl font-bold mt-2">{(totalPlanned/1000).toFixed(1)}k sq ft</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Expected Volume</p>
          <p className="text-4xl font-bold mt-2">{(totalExpected/1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">At Risk Plans</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">{atRiskCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Avg Projected Utilization</p>
          <p className="text-4xl font-bold text-indigo-600 mt-2">
            {Math.round(filteredPlans.reduce((sum, p) => sum + p.projectedUtilization, 0) / filteredPlans.length) || 0}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Month</label>
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)} 
            className="border rounded-xl px-5 py-3 min-w-[180px]"
          >
            <option value="May">May 2026</option>
            <option value="June">June 2026</option>
            <option value="July">July 2026</option>
            <option value="August">August 2026</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Hub Name</th>
                <th className="px-6 py-4 text-left">Month</th>
                <th className="px-6 py-4 text-left">Planned Capacity</th>
                <th className="px-6 py-4 text-left">Expected Volume</th>
                <th className="px-6 py-4 text-left">Projected Utilization</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Notes</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">{plan.hubName}</td>
                  <td className="px-6 py-5">{plan.month} {plan.year}</td>
                  <td className="px-6 py-5 font-medium">{plan.plannedCapacity.toLocaleString()} sq ft</td>
                  <td className="px-6 py-5 font-medium">{plan.expectedVolume.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${plan.projectedUtilization > 90 ? 'bg-red-500' : plan.projectedUtilization > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${plan.projectedUtilization}%` }}
                        />
                      </div>
                      <span className="font-medium">{plan.projectedUtilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium
                      ${plan.status === 'On Track' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${plan.status === 'At Risk' ? 'bg-amber-100 text-amber-700' : ''}
                      ${plan.status === 'Over Capacity' ? 'bg-red-100 text-red-700' : ''}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600 max-w-xs truncate">{plan.notes}</td>
                  <td className="px-6 py-5">
                    <button onClick={() => openEditModal(plan)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Edit2 size={18} />
                    </button>
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
                {editingPlan ? 'Edit Capacity Plan' : 'Create New Capacity Plan'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Hub Name <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.hubName} 
                    onChange={(e) => setFormData({...formData, hubName: e.target.value})} 
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">Select Hub</option>
                    <option value="Patna Mother Hub">Patna Mother Hub</option>
                    <option value="Ranchi Regional Hub">Ranchi Regional Hub</option>
                    <option value="Dadri Mother Hub">Dadri Mother Hub</option>
                    <option value="Dankuni Hub">Dankuni Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Month</label>
                  <select 
                    value={formData.month} 
                    onChange={(e) => setFormData({...formData, month: e.target.value})} 
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="June">June 2026</option>
                    <option value="July">July 2026</option>
                    <option value="August">August 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Planned Capacity (sq ft) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={formData.plannedCapacity} 
                    onChange={(e) => setFormData({...formData, plannedCapacity: Number(e.target.value)})} 
                    className="w-full border rounded-xl px-4 py-3" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Volume</label>
                  <input 
                    type="number" 
                    value={formData.expectedVolume} 
                    onChange={(e) => setFormData({...formData, expectedVolume: Number(e.target.value)})} 
                    className="w-full border rounded-xl px-4 py-3" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Notes / Remarks</label>
                  <textarea 
                    value={formData.notes} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    rows={4} 
                    className="w-full border rounded-xl px-4 py-3" 
                    placeholder="Any special requirements or notes..."
                  />
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}