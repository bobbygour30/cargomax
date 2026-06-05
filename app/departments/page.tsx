// app/departments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Users, Edit, Trash2, Plus, ChevronDown, ChevronUp, X, UserCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const API_URL = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:5000";

interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  headName?: string;
  headId?: string;
  headDetails?: {
    _id: string;
    name: string;
    employeeId: string;
    designation: string;
  };
  employeeCount: number;
  designationsCount?: number;
}

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  designation: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditDept, setCurrentEditDept] = useState<Department | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [newDept, setNewDept] = useState({ 
    name: '', 
    code: '', 
    description: '', 
    headId: '' 
  });
  
  const [editDept, setEditDept] = useState({ 
    name: '', 
    code: '', 
    description: '', 
    headId: '' 
  });

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/departments/all`);
      if (res.data.success) {
        setDepartments(res.data.data || []);
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load departments", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/departments/employees/dropdown`);
      if (res.data.success) {
        setEmployees(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  // Open Edit Modal
  const handleEditClick = (dept: Department) => {
    setCurrentEditDept(dept);
    setEditDept({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      headId: dept.headId || ''
    });
    setShowEditModal(true);
  };

  // Update Department
  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditDept) return;
    
    if (!editDept.name.trim() || !editDept.code.trim()) {
      toast({ title: "Error", description: "Department name and code are required", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.put(`${API_URL}/api/departments/update/${currentEditDept._id}`, editDept);
      toast({ title: "Success", description: "Department updated successfully!" });
      setShowEditModal(false);
      fetchDepartments();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Update failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Department
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    try {
      await axios.delete(`${API_URL}/api/departments/delete/${id}`);
      toast({ title: "Success", description: "Department deleted successfully" });
      fetchDepartments();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Delete failed", variant: "destructive" });
    }
  };

  // Create Department
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDept.name.trim() || !newDept.code.trim()) {
      toast({ title: "Error", description: "Department Name and Code are required!", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/departments/create`, {
        name: newDept.name.trim(),
        code: newDept.code.trim().toUpperCase(),
        description: newDept.description.trim(),
        headId: newDept.headId || undefined
      });

      toast({ title: "Success", description: "Department created successfully!" });
      setShowAddModal(false);
      setNewDept({ name: '', code: '', description: '', headId: '' });
      fetchDepartments();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create department", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (count: number) => {
    if (count > 30) return 'bg-green-100 text-green-800';
    if (count > 10) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage departments, heads, and designations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Departments</p>
          <p className="text-2xl font-bold">{departments.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold">{departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-sm text-gray-600">Avg. Dept Size</p>
          <p className="text-2xl font-bold">
            {departments.length ? Math.round(departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0) / departments.length) : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-sm text-gray-600">Departments with Head</p>
          <p className="text-2xl font-bold">{departments.filter(d => d.headName).length}</p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept._id} className="bg-white rounded-xl border hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{dept.code}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEditClick(dept)} 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleDelete(dept._id, dept.name)} 
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {dept.description || 'No description available.'}
              </p>

              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Department Head:</span>
                  <div className="flex items-center gap-2">
                    {dept.headDetails ? (
                      <>
                        <UserCircle className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{dept.headDetails.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Not Assigned</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Employees:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dept.employeeCount)}`}>
                    {dept.employeeCount} employees
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Designations:</span>
                  <span className="text-gray-900 font-medium">{dept.designationsCount || 0}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedDept(selectedDept === dept._id ? null : dept._id)} 
                className="w-full py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                {selectedDept === dept._id ? (
                  <>Hide Details <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>View Details <ChevronDown className="w-4 h-4" /></>
                )}
              </button>

              {/* Expanded Details */}
              {selectedDept === dept._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700">Department Information</h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-800">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">Add New Department</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="e.g., Information Technology"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department Code *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., IT"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department Head</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newDept.headId}
                  onChange={(e) => setNewDept({ ...newDept, headId: e.target.value })}
                >
                  <option value="">Select Department Head</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.designation} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Department description..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Department"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && currentEditDept && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">Edit Department</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editDept.name}
                  onChange={(e) => setEditDept({ ...editDept, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department Code *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editDept.code}
                  onChange={(e) => setEditDept({ ...editDept, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department Head</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editDept.headId}
                  onChange={(e) => setEditDept({ ...editDept, headId: e.target.value })}
                >
                  <option value="">Select Department Head</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.designation} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={editDept.description}
                  onChange={(e) => setEditDept({ ...editDept, description: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Update Department"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}