'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Shield, AlertTriangle } from 'lucide-react';

interface GeofenceRule {
  id: string;
  ruleCode: string;
  ruleName: string;
  trigger: string;
  condition: string;
  action: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  appliedTo: string;
  status: 'Active' | 'Inactive';
}

const initialRules: GeofenceRule[] = [
  {
    id: '1',
    ruleCode: 'GFR-001',
    ruleName: 'Unauthorized Entry Alert',
    trigger: 'Vehicle Enter',
    condition: 'Outside defined geofence',
    action: 'Send WhatsApp + SMS to Hub Incharge',
    severity: 'High',
    appliedTo: 'All Hubs & Spokes',
    status: 'Active',
  },
  {
    id: '2',
    ruleCode: 'GFR-002',
    ruleName: 'Delayed Exit',
    trigger: 'Vehicle Stay',
    condition: 'Inside geofence > 45 mins',
    action: 'Notify Operations Manager',
    severity: 'Medium',
    appliedTo: 'All Spokes',
    status: 'Active',
  },
  {
    id: '3',
    ruleCode: 'GFR-003',
    ruleName: 'Wrong Direction Entry',
    trigger: 'Vehicle Enter',
    condition: 'Wrong entry gate',
    action: 'Immediate Alert + Block Booking',
    severity: 'Critical',
    appliedTo: 'Mother Hubs',
    status: 'Active',
  },
  {
    id: '4',
    ruleCode: 'GFR-004',
    ruleName: 'Night Time Entry',
    trigger: 'Vehicle Enter',
    condition: 'Between 10 PM - 6 AM',
    action: 'Send Alert to Supervisor',
    severity: 'Medium',
    appliedTo: 'All Hubs',
    status: 'Active',
  },
];

export default function GeofenceRulesPage() {
  const [rules, setRules] = useState<GeofenceRule[]>(initialRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<GeofenceRule | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    ruleCode: '',
    ruleName: '',
    trigger: 'Vehicle Enter',
    condition: '',
    action: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    appliedTo: 'All Hubs & Spokes',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.ruleCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = !filterSeverity || rule.severity === filterSeverity;
    const matchesStatus = !filterStatus || rule.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      ruleCode: '',
      ruleName: '',
      trigger: 'Vehicle Enter',
      condition: '',
      action: '',
      severity: 'Medium',
      appliedTo: 'All Hubs & Spokes',
      status: 'Active',
    });
    setEditingRule(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (rule: GeofenceRule) => {
    setEditingRule(rule);
    setFormData({
      ruleCode: rule.ruleCode,
      ruleName: rule.ruleName,
      trigger: rule.trigger,
      condition: rule.condition,
      action: rule.action,
      severity: rule.severity,
      appliedTo: rule.appliedTo,
      status: rule.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.ruleCode || !formData.ruleName || !formData.condition) {
      alert('Rule Code, Rule Name and Condition are required');
      return;
    }

    const newRule: GeofenceRule = {
      id: editingRule ? editingRule.id : Date.now().toString(),
      ruleCode: formData.ruleCode.toUpperCase(),
      ruleName: formData.ruleName,
      trigger: formData.trigger,
      condition: formData.condition,
      action: formData.action,
      severity: formData.severity,
      appliedTo: formData.appliedTo,
      status: formData.status,
    };

    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? newRule : r));
    } else {
      setRules([...rules, newRule]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geofence Rules</h1>
          <p className="text-gray-600 mt-1">Define rules and automated actions for geofence violations</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Rule
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Rule</label>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rule name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 border rounded-xl py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Severity</label>
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded-xl py-3 px-4">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Rule Code</th>
                <th className="px-6 py-4 text-left">Rule Name</th>
                <th className="px-6 py-4 text-left">Trigger</th>
                <th className="px-6 py-4 text-left">Condition</th>
                <th className="px-6 py-4 text-left">Action</th>
                <th className="px-6 py-4 text-left">Severity</th>
                <th className="px-6 py-4 text-left">Applied To</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-mono font-medium">{rule.ruleCode}</td>
                  <td className="px-6 py-5 font-medium">{rule.ruleName}</td>
                  <td className="px-6 py-5 text-sm">{rule.trigger}</td>
                  <td className="px-6 py-5 text-sm text-gray-600">{rule.condition}</td>
                  <td className="px-6 py-5 text-sm">{rule.action}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${rule.severity === 'Critical' ? 'bg-red-100 text-red-700' : ''}
                      ${rule.severity === 'High' ? 'bg-orange-100 text-orange-700' : ''}
                      ${rule.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${rule.severity === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm">{rule.appliedTo}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium ${rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(rule)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setRules(rules.filter(r => r.id !== rule.id))} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
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
              <Shield className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">
                {editingRule ? 'Edit Geofence Rule' : 'Create New Geofence Rule'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Rule Code <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.ruleCode} onChange={(e) => setFormData({ ...formData, ruleCode: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-4 py-3 font-mono" placeholder="GFR-005" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rule Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.ruleName} onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Unauthorized Night Entry" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trigger Event</label>
                  <select value={formData.trigger} onChange={(e) => setFormData({ ...formData, trigger: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Vehicle Enter">Vehicle Enter</option>
                    <option value="Vehicle Exit">Vehicle Exit</option>
                    <option value="Vehicle Stay">Vehicle Stay</option>
                    <option value="Speed Violation">Speed Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Severity</label>
                  <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Condition <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="w-full border rounded-xl px-4 py-3" placeholder="Outside geofence radius or wrong gate" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Action to Take <span className="text-red-500">*</span></label>
                  <textarea value={formData.action} onChange={(e) => setFormData({ ...formData, action: e.target.value })} rows={3} className="w-full border rounded-xl px-4 py-3" placeholder="Send WhatsApp alert to hub incharge + Notify supervisor" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Applied To</label>
                  <select value={formData.appliedTo} onChange={(e) => setFormData({ ...formData, appliedTo: e.target.value })} className="w-full border rounded-xl px-4 py-3">
                    <option value="All Hubs & Spokes">All Hubs & Spokes</option>
                    <option value="All Hubs">All Hubs</option>
                    <option value="All Spokes">All Spokes</option>
                    <option value="Mother Hubs">Mother Hubs Only</option>
                    <option value="Regional Hubs">Regional Hubs Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })} className="w-full border rounded-xl px-4 py-3">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium">
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}