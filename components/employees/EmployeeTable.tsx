'use client';

import { Employee } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
}

export default function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Terminated':
      case 'Resigned': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Employee ID</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Department</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Designation</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((employee) => {
            const id = employee._id || employee.id;
            return (
              <tr key={id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium">{employee.employeeId}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {employee.firstName?.[0]}{employee.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                      <p className="text-xs text-gray-500">{employee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{employee.departmentName}</td>
                <td className="py-3 px-4 text-gray-600">{employee.designation}</td>
                <td className="py-3 px-4">
                  <Badge variant={getStatusColor(employee.employmentStatus)}>
                    {employee.employmentStatus}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link href={`/employees/${id}`}>
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </Link>
                    <button className="p-2 hover:bg-gray-100 rounded-md" onClick={() => onEdit?.(employee)}>
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-md" onClick={() => onDelete?.(id!)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {employees.length === 0 && (
        <div className="text-center py-12 text-gray-500">No employees found</div>
      )}
    </div>
  );
}