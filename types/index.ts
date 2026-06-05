// types/index.ts
// types/index.ts - Update Employee interface
export interface Employee {
  _id?: string;        // MongoDB ID
  id?: string;         // For compatibility
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  nationality: string;
  profilePicture?: string;
  hireDate: string;
  confirmationDate?: string;
  terminationDate?: string;
  employmentStatus: 'Active' | 'On Leave' | 'Terminated' | 'Resigned' | 'Retired';
  employmentType: 'Permanent' | 'Contract' | 'Intern' | 'Temporary' | 'Consultant';
  departmentId: string;
  departmentName: string;
  designationId: string;
  designation: string;
  reportingTo?: string;
  managerName?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headId?: string;
  headName?: string;
  employeeCount: number;
  parentDeptId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'ID Proof' | 'Contract' | 'Certificate' | 'Photo' | 'Other';
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
  expiryDate?: string;
  employeeId: string;
  employeeName: string;
}

export interface LifecycleEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  eventType: 'Hired' | 'Confirmed' | 'Promoted' | 'Transferred' | 'Resigned' | 'Terminated';
  eventDate: string;
  oldValue?: string;
  newValue?: string;
  remarks?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  averageTenure: number;
  genderRatio: { male: number; female: number; other: number };
  employmentType: Record<string, number>;
  recentHires: number;
  upcomingBirthdays: number;
}

// types/index.ts - Add these interfaces

export interface SalaryStructure {
  id: string;
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  hra: number;           // House Rent Allowance
  da: number;            // Dearness Allowance
  conveyance: number;    // Conveyance Allowance
  medicalAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
  totalEarnings: number;
  
  // Deductions
  pf: number;            // Provident Fund
  esi: number;           // ESI
  professionalTax: number;
  tds: number;           // Tax Deducted at Source
  loanDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  
  netSalary: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string;         // YYYY-MM
  salaryStructure: SalaryStructure;
  
  // Attendance based
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  overtime: number;
  
  // Bonuses & Incentives
  performanceBonus: number;
  festivalBonus: number;
  incentive: number;
  otherBonus: number;
  
  // Reimbursements
  travelReimbursement: number;
  medicalReimbursement: number;
  otherReimbursement: number;
  
  // Final calculations
  grossEarnings: number;
  totalDeductions: number;
  netPayable: number;
  
  paymentMode: 'Bank Transfer' | 'Cheque' | 'Cash';
  bankAccount?: string;
  paymentDate?: string;
  status: 'Pending' | 'Processed' | 'Paid';
  processedBy?: string;
  processedAt?: string;
}

export interface ReimbursementRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Travel' | 'Medical' | 'Food' | 'Other';
  amount: number;
  description: string;
  date: string;
  documentUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  approvedBy?: string;
  approvedAt?: string;
  remarks?: string;
}

export interface BonusIncentive {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Performance Bonus' | 'Festival Bonus' | 'Diwali Bonus' | 'Annual Bonus' | 'Incentive' | 'Referral Bonus';
  amount: number;
  month: string;
  reason: string;
  approvedBy: string;
  status: 'Approved' | 'Pending' | 'Paid';
}

export interface TaxCalculation {
  employeeId: string;
  employeeName: string;
  financialYear: string;
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  tdsAmount: number;
  cess: number;
  totalTax: number;
  monthlyTds: number;
}