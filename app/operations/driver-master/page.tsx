"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save, RefreshCw, Search, Pencil, Trash2, Upload, Download, Eye, X, Plus, Edit, MoreVertical, AlertCircle, Car, Banknote, FileText, Check, Filter, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DriverRecord {
  id: number;
  driverCode: string;
  active: boolean;
  type: string;
  driverName: string;
  fathersName: string;
  aliasName: string;
  employeeName: string;
  presentAddress: string;
  homeCountryAddress: string;
  foreman: string;
  mobileNo: string;
  dateOfBirth: Date;
  age: number;
  aadhaarNo: string;
  joiningDate: Date;
  resignDate: Date | null;
  licenseNo: string;
  issueDate: Date;
  issuedBy: string;
  validUpto: Date;
  panNo: string;
  pfUanNo: string;
  accountHolderName: string;
  bankName: string;
  bankBranch: string;
  bankAccountNo: string;
  ifscCode: string;
  foremanName: string;
  emergencyContactName: string;
  emergencyContactNo: string;
  allowMobileLogin: boolean;
  blackList: boolean;
  attachFile: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DueAlert {
  id: number;
  particular: string;
  validity: string;
  validUpto: Date;
  alertDays: number;
  intervalDays: number;
  smsTo: string;
  emailTo: string;
  remarks: string;
  alertRemarks: string;
  document: string;
}

interface VehicleAssignment {
  id: number;
  fromDate: Date;
  vehicleNo: string;
}

interface BankDetail {
  id: number;
  bankName: string;
  bankBranch: string;
  accountType: string;
  accountHolderName: string;
  accountNo: string;
  ifscCode: string;
  isActive: boolean;
  isPrimary: boolean;
  chequeImage: string;
}

const driverTypeOptions = ["DRIVER", "OWNER", "HELPER", "CLEANER"];
const accountTypeOptions = ["Saving", "Current", "Salary"];

export default function DriverMaster() {
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Form state
  const [driverCode, setDriverCode] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [type, setType] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [fathersName, setFathersName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [employeeName, setEmployeeName] = useState<string>("");
  const [presentAddress, setPresentAddress] = useState<string>("");
  const [homeCountryAddress, setHomeCountryAddress] = useState<string>("");
  const [foreman, setForeman] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [age, setAge] = useState<number>(0);
  const [aadhaarNo, setAadhaarNo] = useState<string>("");
  const [joiningDate, setJoiningDate] = useState<Date>(new Date());
  const [resignDate, setResignDate] = useState<Date | null>(null);
  const [licenseNo, setLicenseNo] = useState<string>("");
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [issuedBy, setIssuedBy] = useState<string>("");
  const [validUpto, setValidUpto] = useState<Date>(new Date());
  const [panNo, setPanNo] = useState<string>("");
  const [pfUanNo, setPfUanNo] = useState<string>("");
  const [accountHolderName, setAccountHolderName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankBranch, setBankBranch] = useState<string>("");
  const [bankAccountNo, setBankAccountNo] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [foremanName, setForemanName] = useState<string>("");
  const [emergencyContactName, setEmergencyContactName] = useState<string>("");
  const [emergencyContactNo, setEmergencyContactNo] = useState<string>("");
  const [allowMobileLogin, setAllowMobileLogin] = useState<boolean>(false);
  const [blackList, setBlackList] = useState<boolean>(false);
  const [attachFile, setAttachFile] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Modal states
  const [isDueAlertModalOpen, setIsDueAlertModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverRecord | null>(null);
  
  // Due Alert state
  const [dueAlerts, setDueAlerts] = useState<DueAlert[]>([]);
  const [dueAlertParticular, setDueAlertParticular] = useState("");
  const [dueAlertValidity, setDueAlertValidity] = useState("");
  const [dueAlertValidUpto, setDueAlertValidUpto] = useState<Date>(new Date());
  const [dueAlertDays, setDueAlertDays] = useState(0);
  const [dueAlertIntervalDays, setDueAlertIntervalDays] = useState(0);
  const [dueAlertSmsTo, setDueAlertSmsTo] = useState("");
  const [dueAlertEmailTo, setDueAlertEmailTo] = useState("");
  const [dueAlertRemarks, setDueAlertRemarks] = useState("");
  const [dueAlertAlertRemarks, setDueAlertAlertRemarks] = useState("");
  const [dueAlertDocument, setDueAlertDocument] = useState("");
  const [editDueAlertId, setEditDueAlertId] = useState<number | null>(null);

  // Vehicle Assignment state
  const [vehicles, setVehicles] = useState<VehicleAssignment[]>([]);
  const [vehicleFromDate, setVehicleFromDate] = useState<Date>(new Date());
  const [vehicleNo, setVehicleNo] = useState("");

  // Bank Details state
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [bankNameField, setBankNameField] = useState("");
  const [bankBranchField, setBankBranchField] = useState("");
  const [accountType, setAccountType] = useState("Saving");
  const [accountHolderNameField, setAccountHolderNameField] = useState("");
  const [accountNoField, setAccountNoField] = useState("");
  const [ifscCodeField, setIfscCodeField] = useState("");
  const [isActiveBank, setIsActiveBank] = useState(false);
  const [isPrimaryBank, setIsPrimaryBank] = useState(false);
  const [chequeImage, setChequeImage] = useState("");
  const [editBankId, setEditBankId] = useState<number | null>(null);

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<DriverRecord[]>([
    { id: 1, driverCode: "A0002", active: true, type: "DRIVER", driverName: "NOTE CLEAR", fathersName: "", aliasName: "", employeeName: "", presentAddress: "GHAZIABAD", homeCountryAddress: "", foreman: "", mobileNo: "7310842801", dateOfBirth: new Date(), age: 0, aadhaarNo: "1111111111", joiningDate: new Date("2025-07-11"), resignDate: null, licenseNo: "", issueDate: new Date("2025-07-11"), issuedBy: "", validUpto: new Date("2029-11-29"), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, driverCode: "A0004", active: true, type: "DRIVER", driverName: "SARWAN", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "9821725574", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP5020210018690", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, driverCode: "A0006", active: true, type: "DRIVER", driverName: "SOHANLAL", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "8958440072", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, driverCode: "A0008", active: true, type: "DRIVER", driverName: "PARDEEP", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "7042597426", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP5020190002545", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 5, driverCode: "A0010", active: true, type: "DRIVER", driverName: "KAPIL", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "9468315501", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "HR4220100018118", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "", createdAt: new Date(), updatedAt: new Date() },
    { id: 6, driverCode: "A0012", active: true, type: "DRIVER", driverName: "AJAY", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "7217682171", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP50201920004608", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "", createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  const [searchResults, setSearchResults] = useState<DriverRecord[]>(savedRecords);

  // Calculate age from date of birth
  const calculateAge = (dob: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateOfBirthChange = (date: Date | undefined) => {
    if (date) {
      setDateOfBirth(date);
      setAge(calculateAge(date));
    }
  };

  // Generate driver code
  const generateDriverCode = (): string => {
    const count = savedRecords.length + 1;
    return `A${String(count).padStart(4, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setDriverCode(generateDriverCode());
    setActive(true);
    setType("");
    setDriverName("");
    setFathersName("");
    setAliasName("");
    setEmployeeName("");
    setPresentAddress("");
    setHomeCountryAddress("");
    setForeman("");
    setMobileNo("");
    setDateOfBirth(new Date());
    setAge(0);
    setAadhaarNo("");
    setJoiningDate(new Date());
    setResignDate(null);
    setLicenseNo("");
    setIssueDate(new Date());
    setIssuedBy("");
    setValidUpto(new Date());
    setPanNo("");
    setPfUanNo("");
    setAccountHolderName("");
    setBankName("");
    setBankBranch("");
    setBankAccountNo("");
    setIfscCode("");
    setForemanName("");
    setEmergencyContactName("");
    setEmergencyContactNo("");
    setAllowMobileLogin(false);
    setBlackList(false);
    setAttachFile("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = (): void => {
    if (!driverName.trim()) {
      alert("Please enter Driver Name");
      return;
    }
    if (!fathersName.trim()) {
      alert("Please enter Father's Name");
      return;
    }
    if (!presentAddress.trim()) {
      alert("Please enter Present Address");
      return;
    }
    if (!mobileNo.trim()) {
      alert("Please enter Mobile Number");
      return;
    }
    if (!licenseNo.trim()) {
      alert("Please enter License Number");
      return;
    }

    const newRecord: DriverRecord = {
      id: currentEditId || Date.now(),
      driverCode,
      active,
      type,
      driverName,
      fathersName,
      aliasName,
      employeeName,
      presentAddress,
      homeCountryAddress,
      foreman,
      mobileNo,
      dateOfBirth,
      age,
      aadhaarNo,
      joiningDate,
      resignDate,
      licenseNo,
      issueDate,
      issuedBy,
      validUpto,
      panNo,
      pfUanNo,
      accountHolderName,
      bankName,
      bankBranch,
      bankAccountNo,
      ifscCode,
      foremanName,
      emergencyContactName,
      emergencyContactNo,
      allowMobileLogin,
      blackList,
      attachFile,
      createdAt: editMode && currentEditId ? 
        savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : 
        new Date(),
      updatedAt: new Date(),
    };

    if (editMode && currentEditId) {
      setSavedRecords(savedRecords.map(record => record.id === currentEditId ? newRecord : record));
      alert("Record updated successfully!");
    } else {
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setIsEntrySheetOpen(false);
    handleSearch();
  };

  const handleEdit = (record: DriverRecord): void => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setDriverCode(record.driverCode);
    setActive(record.active);
    setType(record.type);
    setDriverName(record.driverName);
    setFathersName(record.fathersName);
    setAliasName(record.aliasName);
    setEmployeeName(record.employeeName);
    setPresentAddress(record.presentAddress);
    setHomeCountryAddress(record.homeCountryAddress);
    setForeman(record.foreman);
    setMobileNo(record.mobileNo);
    setDateOfBirth(record.dateOfBirth);
    setAge(record.age);
    setAadhaarNo(record.aadhaarNo);
    setJoiningDate(record.joiningDate);
    setResignDate(record.resignDate);
    setLicenseNo(record.licenseNo);
    setIssueDate(record.issueDate);
    setIssuedBy(record.issuedBy);
    setValidUpto(record.validUpto);
    setPanNo(record.panNo);
    setPfUanNo(record.pfUanNo);
    setAccountHolderName(record.accountHolderName);
    setBankName(record.bankName);
    setBankBranch(record.bankBranch);
    setBankAccountNo(record.bankAccountNo);
    setIfscCode(record.ifscCode);
    setForemanName(record.foremanName);
    setEmergencyContactName(record.emergencyContactName);
    setEmergencyContactNo(record.emergencyContactNo);
    setAllowMobileLogin(record.allowMobileLogin);
    setBlackList(record.blackList);
    setAttachFile(record.attachFile);
    setIsEntrySheetOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      setSearchResults(searchResults.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const handleSearch = () => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.driverCode.toLowerCase().includes(term) ||
        r.driverName.toLowerCase().includes(term) ||
        r.mobileNo.includes(term)
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults(savedRecords);
    setCurrentPage(1);
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setDriverCode(generateDriverCode());
    setIsEntrySheetOpen(true);
  };

  // Due Alert Functions
  const handleDueAlertSetup = (driver: DriverRecord) => {
    setSelectedDriver(driver);
    setDueAlerts([]);
    setEditDueAlertId(null);
    resetDueAlertForm();
    setIsDueAlertModalOpen(true);
  };

  const addDueAlert = () => {
    if (!dueAlertParticular) {
      alert("Please enter Particular");
      return;
    }
    const newAlert: DueAlert = {
      id: editDueAlertId || Date.now(),
      particular: dueAlertParticular,
      validity: dueAlertValidity,
      validUpto: dueAlertValidUpto,
      alertDays: dueAlertDays,
      intervalDays: dueAlertIntervalDays,
      smsTo: dueAlertSmsTo,
      emailTo: dueAlertEmailTo,
      remarks: dueAlertRemarks,
      alertRemarks: dueAlertAlertRemarks,
      document: dueAlertDocument,
    };
    if (editDueAlertId) {
      setDueAlerts(dueAlerts.map(alert => alert.id === editDueAlertId ? newAlert : alert));
      setEditDueAlertId(null);
    } else {
      setDueAlerts([...dueAlerts, newAlert]);
    }
    resetDueAlertForm();
  };

  const editDueAlert = (alert: DueAlert) => {
    setEditDueAlertId(alert.id);
    setDueAlertParticular(alert.particular);
    setDueAlertValidity(alert.validity);
    setDueAlertValidUpto(alert.validUpto);
    setDueAlertDays(alert.alertDays);
    setDueAlertIntervalDays(alert.intervalDays);
    setDueAlertSmsTo(alert.smsTo);
    setDueAlertEmailTo(alert.emailTo);
    setDueAlertRemarks(alert.remarks);
    setDueAlertAlertRemarks(alert.alertRemarks);
    setDueAlertDocument(alert.document);
  };

  const removeDueAlert = (id: number) => {
    setDueAlerts(dueAlerts.filter(alert => alert.id !== id));
  };

  const resetDueAlertForm = () => {
    setDueAlertParticular("");
    setDueAlertValidity("");
    setDueAlertValidUpto(new Date());
    setDueAlertDays(0);
    setDueAlertIntervalDays(0);
    setDueAlertSmsTo("");
    setDueAlertEmailTo("");
    setDueAlertRemarks("");
    setDueAlertAlertRemarks("");
    setDueAlertDocument("");
  };

  // Vehicle Functions
  const handleAddVehicle = (driver: DriverRecord) => {
    setSelectedDriver(driver);
    setVehicles([]);
    setVehicleFromDate(new Date());
    setVehicleNo("");
    setIsVehicleModalOpen(true);
  };

  const addVehicle = () => {
    if (!vehicleNo) {
      alert("Please enter Vehicle Number");
      return;
    }
    const newVehicle: VehicleAssignment = {
      id: Date.now(),
      fromDate: vehicleFromDate,
      vehicleNo: vehicleNo,
    };
    setVehicles([...vehicles, newVehicle]);
    setVehicleFromDate(new Date());
    setVehicleNo("");
  };

  const removeVehicle = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // Bank Details Functions
  const handleAddBankDetails = (driver: DriverRecord) => {
    setSelectedDriver(driver);
    setBankDetails([]);
    setEditBankId(null);
    resetBankForm();
    setIsBankModalOpen(true);
  };

  const addBankDetail = () => {
    if (!bankNameField) {
      alert("Please enter Bank Name");
      return;
    }
    if (!accountNoField) {
      alert("Please enter Account Number");
      return;
    }
    const newBank: BankDetail = {
      id: editBankId || Date.now(),
      bankName: bankNameField,
      bankBranch: bankBranchField,
      accountType: accountType,
      accountHolderName: accountHolderNameField,
      accountNo: accountNoField,
      ifscCode: ifscCodeField,
      isActive: isActiveBank,
      isPrimary: isPrimaryBank,
      chequeImage: chequeImage,
    };
    if (editBankId) {
      setBankDetails(bankDetails.map(bank => bank.id === editBankId ? newBank : bank));
      setEditBankId(null);
    } else {
      setBankDetails([...bankDetails, newBank]);
    }
    resetBankForm();
  };

  const editBankDetail = (bank: BankDetail) => {
    setEditBankId(bank.id);
    setBankNameField(bank.bankName);
    setBankBranchField(bank.bankBranch);
    setAccountType(bank.accountType);
    setAccountHolderNameField(bank.accountHolderName);
    setAccountNoField(bank.accountNo);
    setIfscCodeField(bank.ifscCode);
    setIsActiveBank(bank.isActive);
    setIsPrimaryBank(bank.isPrimary);
    setChequeImage(bank.chequeImage);
  };

  const removeBankDetail = (id: number) => {
    setBankDetails(bankDetails.filter(bank => bank.id !== id));
  };

  const resetBankForm = () => {
    setBankNameField("");
    setBankBranchField("");
    setAccountType("Saving");
    setAccountHolderNameField("");
    setAccountNoField("");
    setIfscCodeField("");
    setIsActiveBank(false);
    setIsPrimaryBank(false);
    setChequeImage("");
  };

  // Get status badge
  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-500 hover:bg-green-600 text-[10px]">Active</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500 text-[10px]">Inactive</Badge>
    );
  };

  // Stats
  const stats = {
    total: searchResults.length,
    active: searchResults.filter(r => r.active).length,
    inactive: searchResults.filter(r => !r.active).length,
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">DRIVER MASTER</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={openAddSheet} size="default" className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add New Driver
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Drivers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Drivers</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Check className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Inactive Drivers</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <AlertCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Drivers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Driver Code, Name or Mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button onClick={handleSearch} className="h-9 bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button onClick={clearSearch} variant="outline" className="h-9">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table - Small Font Headings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center gap-2">
              <Table className="h-4 w-4" />
              Drivers List
            </CardTitle>
            <div className="text-sm text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1400px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 min-w-[80px]">Driver Code</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 min-w-[120px]">Driver Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 min-w-[60px]">Type</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 min-w-[80px]">Mobile No.</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 min-w-[100px]">License #</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 min-w-[80px]">Valid Upto</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 min-w-[80px]">Joining Date</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 min-w-[120px]">Address</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 w-20 text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Driver" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 text-center text-xs">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell className="py-2 font-mono font-medium text-xs">{record.driverCode}</TableCell>
                        <TableCell className="py-2 font-medium text-xs">{record.driverName}</TableCell>
                        <TableCell className="py-2 text-xs">{record.type || "-"}</TableCell>
                        <TableCell className="py-2 text-xs">{record.mobileNo}</TableCell>
                        <TableCell className="py-2 text-xs">{record.licenseNo || "-"}</TableCell>
                        <TableCell className="py-2 text-xs">
                          {record.validUpto ? format(record.validUpto, "dd-MM-yyyy") : "-"}
                        </TableCell>
                        <TableCell className="py-2 text-xs">
                          {record.joiningDate ? format(record.joiningDate, "dd-MM-yyyy") : "-"}
                        </TableCell>
                        <TableCell className="py-2 text-xs">{record.presentAddress || "-"}</TableCell>
                        <TableCell className="py-2 text-center">{getStatusBadge(record.active)}</TableCell>
                        <TableCell className="py-2 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => handleEdit(record)} className="cursor-pointer text-xs">
                                <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDueAlertSetup(record)} className="cursor-pointer text-xs">
                                <AlertCircle className="mr-2 h-3.5 w-3.5" /> Due Alert Setup
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddVehicle(record)} className="cursor-pointer text-xs">
                                <Car className="mr-2 h-3.5 w-3.5" /> Add Vehicle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddBankDetails(record)} className="cursor-pointer text-xs">
                                <Banknote className="mr-2 h-3.5 w-3.5" /> Add Bank Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(record.id)} className="cursor-pointer text-red-600 text-xs">
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
                <span className="px-3 py-1 text-xs">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 text-xs"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entry Sheet */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Edit className="h-5 w-5 text-blue-600" />
                  Edit Driver
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add New Driver
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Basic Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Driver Code</Label>
                <Input value={driverCode} readOnly className="h-9 bg-gray-50" />
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded" id="active" />
                  <Label htmlFor="active" className="text-sm font-medium cursor-pointer">Active</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>{driverTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Driver Name <span className="text-red-500">*</span></Label>
                <Input value={driverName} onChange={(e) => setDriverName(e.target.value)} className="h-9" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Father's Name <span className="text-red-500">*</span></Label>
                <Input value={fathersName} onChange={(e) => setFathersName(e.target.value)} className="h-9" />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Present Address <span className="text-red-500">*</span></Label>
                <Input value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} className="h-9" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mobile No <span className="text-red-500">*</span></Label>
                <Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} className="h-9" />
              </div>
            </div>

            {/* License Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">License No <span className="text-red-500">*</span></Label>
                <Input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} className="h-9" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Valid Upto <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(validUpto, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={validUpto} onSelect={(date) => date && setValidUpto(date)} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Joining Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Joining Date <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(joiningDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={joiningDate} onSelect={(date) => date && setJoiningDate(date)} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={allowMobileLogin} onChange={(e) => setAllowMobileLogin(e.target.checked)} className="h-4 w-4 rounded" id="mobileLogin" />
                <Label htmlFor="mobileLogin" className="text-sm cursor-pointer">Allow Mobile Login</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={blackList} onChange={(e) => setBlackList(e.target.checked)} className="h-4 w-4 rounded" id="blackList" />
                <Label htmlFor="blackList" className="text-sm cursor-pointer">Black List</Label>
              </div>
            </div>

            {/* Attach File */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Attach File</Label>
              <Input type="file" onChange={(e) => e.target.files && setAttachFile(e.target.files[0].name)} className="h-9" />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                {editMode ? "Update Driver" : "Save Driver"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Due Alert Modal - Simplified */}
      <Dialog open={isDueAlertModalOpen} onOpenChange={setIsDueAlertModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Due Alert Setup - {selectedDriver?.driverName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label className="text-xs">Particular</Label><Input value={dueAlertParticular} onChange={(e) => setDueAlertParticular(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Validity</Label><Input value={dueAlertValidity} onChange={(e) => setDueAlertValidity(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Alert Days</Label><Input type="number" value={dueAlertDays} onChange={(e) => setDueAlertDays(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">SMS To</Label><Input value={dueAlertSmsTo} onChange={(e) => setDueAlertSmsTo(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Email To</Label><Input value={dueAlertEmailTo} onChange={(e) => setDueAlertEmailTo(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs flex items-end"><Button onClick={addDueAlert} size="sm" className="h-7 text-xs mt-5"><Plus className="mr-1 h-3 w-3" />Add</Button></Label></div>
            </div>
            <div className="border rounded-md max-h-60 overflow-auto">
              <Table className="text-xs">
                <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px]">#</TableHead><TableHead className="text-[10px]">Particular</TableHead><TableHead className="text-[10px]">Alert Days</TableHead><TableHead className="text-[10px]">SMS To</TableHead><TableHead className="text-[10px]">Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {dueAlerts.map((alert, idx) => (
                    <TableRow key={alert.id}>
                      <TableCell>{idx+1}</TableCell><TableCell>{alert.particular}</TableCell><TableCell>{alert.alertDays}</TableCell><TableCell>{alert.smsTo}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => removeDueAlert(alert.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDueAlertModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vehicle Modal - Simplified */}
      <Dialog open={isVehicleModalOpen} onOpenChange={setIsVehicleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Vehicle - {selectedDriver?.driverName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Vehicle No</Label><Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} className="h-8 text-xs" /></div>
            <Button onClick={addVehicle} size="sm" className="h-8 text-xs"><Plus className="mr-1 h-3 w-3" />Add Vehicle</Button>
            <div className="border rounded-md max-h-40 overflow-auto">
              <Table className="text-xs">
                <TableHeader><TableRow><TableHead className="text-[10px]">Vehicle No</TableHead><TableHead className="text-[10px]">Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {vehicles.map(v => (<TableRow key={v.id}><TableCell>{v.vehicleNo}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeVehicle(v.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsVehicleModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bank Details Modal - Simplified */}
      <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Bank Details - {selectedDriver?.driverName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label className="text-xs">Bank Name</Label><Input value={bankNameField} onChange={(e) => setBankNameField(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Account No</Label><Input value={accountNoField} onChange={(e) => setAccountNoField(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">IFSC Code</Label><Input value={ifscCodeField} onChange={(e) => setIfscCodeField(e.target.value)} className="h-8 text-xs uppercase" /></div>
              <div><Label className="text-xs flex items-end"><Button onClick={addBankDetail} size="sm" className="h-7 text-xs mt-5"><Plus className="mr-1 h-3 w-3" />Add</Button></Label></div>
            </div>
            <div className="border rounded-md max-h-60 overflow-auto">
              <Table className="text-xs">
                <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[10px]">#</TableHead><TableHead className="text-[10px]">Bank Name</TableHead><TableHead className="text-[10px]">Account No</TableHead><TableHead className="text-[10px]">IFSC</TableHead><TableHead className="text-[10px]">Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {bankDetails.map((bank, idx) => (
                    <TableRow key={bank.id}>
                      <TableCell>{idx+1}</TableCell><TableCell>{bank.bankName}</TableCell><TableCell>{bank.accountNo}</TableCell><TableCell>{bank.ifscCode}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => removeBankDetail(bank.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsBankModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}