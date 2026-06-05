// // app/hierarchy/page.tsx
'use client';

import React from 'react'

const page = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Hierarchy Page</h1>
    </div>
  )
}

export default page


// import { useState } from 'react';
// import { employees, departments } from '@/lib/mockData';
// import { ChevronRight, ChevronDown, Users, Building2, User, Briefcase } from 'lucide-react';

// interface OrgNode {
//   id: string;
//   name: string;
//   title: string;
//   role?: string;
//   children?: OrgNode[];
//   employeeCount?: number;
//   departmentCode?: string;
// }

// export default function HierarchyPage() {
//   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['dept1', 'dept3']));
//   const [viewType, setViewType] = useState<'department' | 'reporting'>('department');
  
//   // Build department hierarchy
//   const buildDepartmentHierarchy = (): OrgNode[] => {
//     const deptMap: OrgNode[] = departments.map(dept => ({
//       id: dept.id,
//       name: dept.name,
//       title: 'Department',
//       role: 'Department',
//       departmentCode: dept.code,
//       employeeCount: dept.employeeCount,
//       children: []
//     }));
    
//     // Add employees to departments
//     deptMap.forEach(dept => {
//       const deptEmployees = employees.filter(emp => emp.departmentId === dept.id && emp.employmentStatus === 'Active');
//       dept.children = deptEmployees.map(emp => ({
//         id: emp.id,
//         name: `${emp.firstName} ${emp.lastName}`,
//         title: emp.designation,
//         role: emp.designation,
//         children: []
//       }));
//     });
    
//     return deptMap;
//   };
  
//   // Build reporting hierarchy
//   const buildReportingHierarchy = (): OrgNode[] => {
//     // Find CEO (no reportingTo or highest level)
//     const ceo = employees.find(emp => emp.designation === 'CEO' || !emp.reportingTo);
//     if (!ceo) return [];
    
//     const buildTree = (managerId: string): OrgNode[] => {
//       const reports = employees.filter(emp => emp.reportingTo === managerId);
//       return reports.map(emp => ({
//         id: emp.id,
//         name: `${emp.firstName} ${emp.lastName}`,
//         title: emp.designation,
//         role: emp.designation,
//         children: buildTree(emp.id)
//       }));
//     };
    
//     return [{
//       id: ceo.id,
//       name: `${ceo.firstName} ${ceo.lastName}`,
//       title: ceo.designation,
//       role: ceo.designation,
//       children: buildTree(ceo.id)
//     }];
//   };
  
//   const hierarchyData = viewType === 'department' ? buildDepartmentHierarchy() : buildReportingHierarchy();
  
//   const toggleNode = (nodeId: string) => {
//     const newExpanded = new Set(expandedNodes);
//     if (newExpanded.has(nodeId)) {
//       newExpanded.delete(nodeId);
//     } else {
//       newExpanded.add(nodeId);
//     }
//     setExpandedNodes(newExpanded);
//   };
  
//   const getNodeIcon = (node: OrgNode) => {
//     if (node.title === 'Department') {
//       return <Building2 className="w-5 h-5 text-blue-600" />;
//     }
//     if (node.role === 'CEO' || node.role === 'Director') {
//       return <Briefcase className="w-5 h-5 text-purple-600" />;
//     }
//     return <User className="w-5 h-5 text-green-600" />;
//   };
  
//   const getNodeBgColor = (node: OrgNode) => {
//     if (node.title === 'Department') return 'bg-blue-100';
//     if (node.role === 'CEO' || node.role === 'Director') return 'bg-purple-100';
//     return 'bg-green-100';
//   };
  
//   const renderNode = (node: OrgNode, level: number = 0) => {
//     const isExpanded = expandedNodes.has(node.id);
//     const hasChildren = node.children && node.children.length > 0;
//     const nodeBgColor = getNodeBgColor(node);
    
//     return (
//       <div key={node.id} className="relative">
//         {/* Connector lines for tree view */}
//         {level > 0 && (
//           <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" style={{ left: '-12px' }}></div>
//         )}
        
//         <div 
//           className="relative flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
//           style={{ marginLeft: level * 24 }}
//           onClick={() => hasChildren && toggleNode(node.id)}
//         >
//           {/* Expand/Collapse button */}
//           {hasChildren && (
//             <button className="p-1 hover:bg-gray-200 rounded transition-colors z-10">
//               {isExpanded ? 
//                 <ChevronDown className="w-4 h-4 text-gray-500" /> : 
//                 <ChevronRight className="w-4 h-4 text-gray-500" />
//               }
//             </button>
//           )}
//           {!hasChildren && <div className="w-6" />}
          
//           {/* Node icon */}
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${nodeBgColor} transition-transform group-hover:scale-105`}>
//             {getNodeIcon(node)}
//           </div>
          
//           {/* Node information */}
//           <div className="flex-1">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="font-semibold text-gray-900">{node.name}</span>
//               <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
//                 {node.title}
//               </span>
//               {node.departmentCode && (
//                 <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
//                   {node.departmentCode}
//                 </span>
//               )}
//               {node.employeeCount && (
//                 <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
//                   {node.employeeCount} members
//                 </span>
//               )}
//             </div>
//             {node.title !== 'Department' && (
//               <p className="text-xs text-gray-500 mt-0.5">
//                 Employee ID: {node.id}
//               </p>
//             )}
//           </div>
          
//           {/* Quick stats */}
//           {node.title === 'Department' && node.employeeCount && (
//             <div className="text-xs text-gray-400">
//               {node.employeeCount} members
//             </div>
//           )}
//         </div>
        
//         {/* Render children if expanded */}
//         {hasChildren && isExpanded && (
//           <div className="ml-6 border-l-2 border-gray-200 pl-4 mt-1 space-y-1">
//             {node.children!.map(child => renderNode(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   // Calculate statistics
//  const totalManagers = employees.filter(emp => 
//     employees.some(e => e.reportingTo === emp.id)
//   ).length;
  
//   const avgSpanOfControl = (totalManagers > 0 ? 
//     employees.filter(e => e.reportingTo).length / totalManagers : 0
//   ).toFixed(1);
  
//   const maxDepth = (() => {
//     let max = 0;
//     const calculateDepth = (empId: string, depth: number): number => {
//       const reports = employees.filter(e => e.reportingTo === empId);
//       if (reports.length === 0) return depth;
//       return Math.max(...reports.map(r => calculateDepth(r.id, depth + 1)));
//     };
//     const ceo = employees.find(e => e.designation === 'CEO' || !e.reportingTo);
//     if (ceo) max = calculateDepth(ceo.id, 1);
//     return max;
//   })();
  
//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Organization Hierarchy</h1>
//         <p className="text-gray-600 mt-1">Visualize your organization structure</p>
//       </div>
      
//       {/* View Toggle Buttons */}
//       <div className="mb-6 flex gap-3">
//         <button
//           onClick={() => setViewType('department')}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//             viewType === 'department'
//               ? 'bg-blue-600 text-white shadow-md'
//               : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
//           }`}
//         >
//           <Building2 className="w-4 h-4 inline mr-2" />
//           Department View
//         </button>
//         <button
//           onClick={() => setViewType('reporting')}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//             viewType === 'reporting'
//               ? 'bg-blue-600 text-white shadow-md'
//               : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
//           }`}
//         >
//           <Users className="w-4 h-4 inline mr-2" />
//           Reporting View
//         </button>
//       </div>
      
//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg border p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Departments</p>
//               <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-full">
//               <Building2 className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Management Levels</p>
//               <p className="text-2xl font-bold text-gray-900">{maxDepth}</p>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-full">
//               <Briefcase className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Managers</p>
//               <p className="text-2xl font-bold text-gray-900">{totalManagers}</p>
//             </div>
//             <div className="p-3 bg-green-100 rounded-full">
//               <Users className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Avg. Span of Control</p>
//               <p className="text-2xl font-bold text-gray-900">{avgSpanOfControl}</p>
//             </div>
//             <div className="p-3 bg-orange-100 rounded-full">
//               <Users className="w-6 h-6 text-orange-600" />
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Hierarchy Tree */}
//       <div className="bg-white rounded-lg border shadow-sm">
//         <div className="p-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">
//             {viewType === 'department' ? 'Department Structure' : 'Reporting Structure'}
//           </h3>
//           <p className="text-sm text-gray-600 mt-0.5">
//             {viewType === 'department' 
//               ? 'View organization by departments and team members'
//               : 'View reporting relationships from CEO to individual contributors'}
//           </p>
//         </div>
//         <div className="p-6">
//           <div className="space-y-2">
//             {hierarchyData.length > 0 ? (
//               hierarchyData.map(node => renderNode(node))
//             ) : (
//               <div className="text-center py-12">
//                 <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-500">No hierarchy data available</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Legend */}
//       <div className="mt-6 bg-white rounded-lg border p-4">
//         <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
//         <div className="flex flex-wrap gap-4">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//               <Building2 className="w-4 h-4 text-blue-600" />
//             </div>
//             <span className="text-sm text-gray-600">Department</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//               <Briefcase className="w-4 h-4 text-purple-600" />
//             </div>
//             <span className="text-sm text-gray-600">Leadership (CEO/Director)</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//               <User className="w-4 h-4 text-green-600" />
//             </div>
//             <span className="text-sm text-gray-600">Employee</span>
//           </div>
//         </div>
//       </div>
      
//       {/* Instructions */}
//       <div className="mt-4 text-sm text-gray-500 text-center">
//         💡 Tip: Click on any department or manager to expand/collapse the hierarchy
//       </div>
//     </div>
//   );
// }