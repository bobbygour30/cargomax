// app/employees/page.tsx (Simplified - without refreshData)
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Employee } from '@/types';
import EmployeeTable from '@/components/employees/EmployeeTable';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { toast } from '@/components/ui/use-toast';

const API_URL = process.env.NEXT_PUBLIC_BASE_URI;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/employees/all`);
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch employees", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_URL}/api/employees/delete/${id}`);
        toast({ title: "Success", description: "Employee deleted successfully!" });
        fetchEmployees(); // Refresh after delete
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete employee", variant: "destructive" });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="text-gray-600 mt-1">Manage all employee records</p>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <button
          onClick={() => { setSelectedEmployee(null); setShowAddModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>
      
      <div className="bg-white rounded-lg border">
        {loading ? (
          <div className="text-center py-12">Loading employees...</div>
        ) : (
          <EmployeeTable 
            employees={filteredEmployees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            // refreshData={fetchEmployees}  // ✅ Remove this line
          />
        )}
      </div>
      
      {showAddModal && (
        <EmployeeForm 
          onClose={() => { setShowAddModal(false); setSelectedEmployee(null); fetchEmployees(); }}
          employee={selectedEmployee || undefined}
        />
      )}
    </div>
  );
}