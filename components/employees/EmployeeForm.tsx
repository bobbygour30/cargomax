// components/employees/EmployeeForm.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const API_URL = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:5000";

interface EmployeeFormProps {
  onClose: () => void;
  employee?: any;
}

export default function EmployeeForm({ onClose, employee }: EmployeeFormProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    dateOfBirth: employee?.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
    gender: employee?.gender || 'Male',
    maritalStatus: employee?.maritalStatus || 'Single',
    nationality: employee?.nationality || 'Indian',

    departmentId: typeof employee?.departmentId === 'object' ? employee.departmentId._id || '' : employee?.departmentId || '',
    departmentName: employee?.departmentName || '',

    designationId: typeof employee?.designationId === 'object' ? employee.designationId._id || '' : employee?.designationId || '',
    designation: employee?.designation || '',

    hireDate: employee?.hireDate ? employee.hireDate.split('T')[0] : '',
    employmentType: employee?.employmentType || 'Permanent',
    employmentStatus: employee?.employmentStatus || 'Active',
    salary: employee?.salary || 0,

    address: {
      street: employee?.address?.street || '',
      city: employee?.address?.city || '',
      state: employee?.address?.state || '',
      country: employee?.address?.country || 'India',
      zipCode: employee?.address?.zipCode || '',
    },
    emergencyContact: {
      name: employee?.emergencyContact?.name || '',
      relationship: employee?.emergencyContact?.relationship || '',
      phone: employee?.emergencyContact?.phone || '',
    },
  });

  // Fetch Departments
  useEffect(() => {
    axios.get(`${API_URL}/api/departments/all`)
      .then(res => setDepartments(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  // Fetch Designations when department changes
  useEffect(() => {
    if (!formData.departmentId) {
      setDesignations([]);
      return;
    }
    axios.get(`${API_URL}/api/designations/all`)
      .then(res => {
        const filtered = res.data.data.filter((d: any) => {
          const deptId = typeof d.departmentId === 'object' ? d.departmentId._id : d.departmentId;
          return deptId === formData.departmentId;
        });
        setDesignations(filtered);
      })
      .catch(err => console.error(err));
  }, [formData.departmentId]);

  const handleDepartmentChange = (deptId: string, deptName: string) => {
    setFormData(prev => ({
      ...prev,
      departmentId: deptId,
      departmentName: deptName,
      designationId: '',
      designation: ''
    }));
  };

  const handleDesignationChange = (desId: string, desTitle: string) => {
    setFormData(prev => ({
      ...prev,
      designationId: desId,
      designation: desTitle
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = employee?._id || employee?.id;
      const url = id ? `${API_URL}/api/employees/update/${id}` : `${API_URL}/api/employees/create`;
      const method = id ? 'put' : 'post';

      await axios[method](url, formData);
      toast({ title: "Success", description: id ? "Employee updated!" : "Employee created!" });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <div className="flex justify-between items-center">
            <CardTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="font-semibold mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>First Name *</label><Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required /></div>
                <div><label>Last Name *</label><Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required /></div>
                <div><label>Email *</label><Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
                <div><label>Phone *</label><Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
                <div><label>Date of Birth *</label><Input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} required /></div>
                <div><label>Gender</label>
                  <select className="w-full px-3 py-2 border rounded-md" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="font-semibold mb-3">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Department *</label>
                  <select className="w-full px-3 py-2 border rounded-md" value={formData.departmentId} onChange={(e) => {
                    const dept = departments.find(d => d._id === e.target.value);
                    handleDepartmentChange(e.target.value, dept?.name || '');
                  }} required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>

                <div>
                  <label>Designation *</label>
                  <select className="w-full px-3 py-2 border rounded-md" value={formData.designationId} onChange={(e) => {
                    const des = designations.find(d => d._id === e.target.value);
                    handleDesignationChange(e.target.value, des?.title || des?.name || '');
                  }} required disabled={!formData.departmentId}>
                    <option value="">Select Designation</option>
                    {designations.map(d => <option key={d._id} value={d._id}>{d.title || d.name}</option>)}
                  </select>
                </div>

                <div><label>Hire Date *</label><Input type="date" value={formData.hireDate} onChange={e => setFormData({...formData, hireDate: e.target.value})} required /></div>
                <div><label>Salary (₹)</label><Input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: Number(e.target.value) || 0})} /></div>
              </div>
            </div>

            {/* Address & Emergency Contact sections are same as before */}
            {/* (Kept short for brevity - they are already correct in your last code) */}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}